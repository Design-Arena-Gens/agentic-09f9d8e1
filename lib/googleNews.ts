import { differenceInMinutes, formatDistanceToNowStrict } from 'date-fns';
import { createHash } from 'crypto';
import { parseStringPromise } from 'xml2js';
import { GoogleNewsArticle, RawGoogleNewsItem } from './types';

const topics = [
  { label: 'Technology', query: 'technology', limit: 12 },
  { label: 'Space Exploration', query: '"space exploration"', limit: 12 },
  { label: 'SpaceX', query: 'SpaceX', limit: 8 }
];

const MAX_ITEMS = 3;

const GOOGLE_NEWS_BASE = 'https://news.google.com/rss/search';

function sanitizeDescription(description: string) {
  return description
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function smartSummary(text: string, title: string, sourceName?: string) {
  let clean = sanitizeDescription(text);
  if (sourceName) {
    const trimmed = clean.replace(new RegExp(`${escapeRegExp(sourceName)}$`, 'i'), '').trim();
    if (trimmed.length >= 40) {
      clean = trimmed;
    }
  }

  if (!clean) {
    return `${title.replace(/[-–—:]+.*/, '').trim()} just broke in the last 24 hours.`;
  }

  const firstSentence = clean.split(/(?<=[.!?])\s+/)[0]?.trim() ?? '';
  if (firstSentence.length > 220) {
    return `${firstSentence.slice(0, 215).trim()}…`;
  }

  if (firstSentence.length >= 60) {
    return firstSentence;
  }

  return clean.slice(0, 220) + (clean.length > 220 ? '…' : '');
}

function buildId(link: string, topic: string) {
  const hash = createHash('md5').update(link).digest('hex').slice(0, 10);
  return `${topic.toLowerCase().replace(/\s+/g, '-')}-${hash}`;
}

function parseDate(pubDate?: string[]) {
  if (!pubDate || !pubDate[0]) return new Date(0);
  const parsed = new Date(pubDate[0]);
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

function extractPrimaryUrl(descriptionHtml: string, fallback: string) {
  const anchorMatch = descriptionHtml.match(/href="(https?:\/\/[^"]+)"/i);
  if (anchorMatch?.[1]) {
    return anchorMatch[1];
  }

  const urlParamMatch = fallback.match(/[?&]url=([^&]+)/i);
  if (urlParamMatch?.[1]) {
    try {
      return decodeURIComponent(urlParamMatch[1]);
    } catch (error) {
      console.warn('Failed to decode Google News url parameter', error);
    }
  }

  return fallback;
}

export async function fetchLatestTechSpaceNews(): Promise<GoogleNewsArticle[]> {
  const fetched: GoogleNewsArticle[] = [];

  await Promise.all(
    topics.map(async (topic) => {
      const params = new URLSearchParams({
        q: `${topic.query} when:1d`,
        hl: 'en-US',
        gl: 'US',
        ceid: 'US:en'
      });

      const response = await fetch(`${GOOGLE_NEWS_BASE}?${params.toString()}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TechSpaceAI/1.0)' },
        next: { revalidate: 60 }
      });

      if (!response.ok) {
        console.error(`Failed to fetch ${topic.label} feed`, await response.text());
        return;
      }

      const xml = await response.text();
      const parsed = await parseStringPromise(xml);
      const items: RawGoogleNewsItem[] = parsed?.rss?.channel?.[0]?.item ?? [];

      items.slice(0, topic.limit).forEach((item) => {
        const title = item.title?.[0] ?? 'Untitled';
        const rawLink = item.link?.[0] ?? '#';
        const descriptionHtml = item.description?.[0] ?? '';
        const link = extractPrimaryUrl(descriptionHtml, rawLink);
        const publishedAt = parseDate(item.pubDate);
        const now = new Date();
        if (differenceInMinutes(now, publishedAt) > 26 * 60) {
          return;
        }

        fetched.push({
          id: buildId(link, topic.label),
          title,
          link,
          publishedAt,
          publishedRelative: formatDistanceToNowStrict(publishedAt, { addSuffix: true }),
          sourceName: item.source?.[0]?._ ?? 'Google News',
          summary: smartSummary(item.description?.[0] ?? '', title, item.source?.[0]?._),
          rawSnippet: sanitizeDescription(item.description?.[0] ?? ''),
          topic: topic.label
        });
      });
    })
  );

  const uniqueByLink = new Map<string, GoogleNewsArticle>();
  fetched
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .forEach((article) => {
      if (!uniqueByLink.has(article.link)) {
        uniqueByLink.set(article.link, article);
      }
    });

  return Array.from(uniqueByLink.values()).slice(0, MAX_ITEMS);
}
