export interface RawGoogleNewsItem {
  title?: string[];
  link?: string[];
  pubDate?: string[];
  description?: string[];
  source?: Array<{
    _: string;
    $: { url: string };
  }>;
}

export interface GoogleNewsArticle {
  id: string;
  title: string;
  link: string;
  publishedAt: Date;
  publishedRelative: string;
  sourceName: string;
  summary: string;
  rawSnippet?: string;
  topic: string;
}

export interface GeneratedContent {
  youtubeTitle: string;
  narrationScript: string;
  hashtags: string[];
  thumbnailText: string;
  visualIdeas: string[];
  voiceOverPrompt: string;
}
