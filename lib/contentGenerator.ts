import { format } from 'date-fns';
import { GeneratedContent, GoogleNewsArticle } from './types';

const introHooks = [
  'Quick tech-and-space blast incoming!',
  'Did you catch this cosmic tech update?',
  'TechSpace AI scanning the latest headlines!'
];

const transitions = [
  'Meanwhile',
  'On the launch pad',
  'Back on Earth',
  'In orbit'
];

function pick<T>(arr: T[], index: number) {
  return arr[index % arr.length];
}

function buildNarration(articles: GoogleNewsArticle[]): string {
  if (articles.length === 0) {
    return [
      'Scanning the feeds… no major tech or space shakeups in the last orbit.',
      'TechSpace AI stays on standby so you never miss the next breakthrough!',
      'Follow TechSpace AI for your next daily launch into the future!'
    ].join(' ');
  }

  const segments = articles.map((article, index) => {
    const transition = index === 0 ? pick(introHooks, articles.length) : pick(transitions, index);

    const highlight = `${transition}, ${article.title.replace(/[-–—]+.*/, '').trim()}.`;
    const recap = `${article.summary}`;
    const source = `Source: ${article.sourceName}.`;

    return `${highlight} ${recap} ${source}`;
  });

  const closing = 'Follow TechSpace AI for your next daily launch into the future!';
  return segments.concat(closing).join(' ');
}

function buildTitle(articles: GoogleNewsArticle[]): string {
  const first = articles[0];
  if (!first) return 'TechSpace AI: Breaking Tech & Space News';

  const trimmed = first.title.replace(/\s*\|.*$/, '').trim();
  return trimmed.length > 55
    ? `TechSpace AI: ${trimmed.slice(0, 52).trim()}…`
    : `TechSpace AI: ${trimmed}`;
}

function buildHashtags(articles: GoogleNewsArticle[]): string[] {
  const base = ['#TechNews', '#SpaceExploration', '#TechSpaceAI'];
  const extras = articles
    .map((article) =>
      article.topic === 'Space Exploration'
        ? '#SpaceUpdate'
        : article.topic === 'Technology'
          ? '#FutureTech'
          : '#SpaceX'
    )
    .filter((tag, index, arr) => arr.indexOf(tag) === index);

  return base.concat(extras).slice(0, 6);
}

function buildThumbnailText(articles: GoogleNewsArticle[]): string {
  const label = articles.length > 1 ? 'Tech + Space' : articles[0]?.topic ?? 'TechSpace AI';
  return `${label}\nFlash Briefing`;
}

function buildVisualIdeas(articles: GoogleNewsArticle[]): string[] {
  if (articles.length === 0) {
    return [
      'Looping animation of radar HUD scanning over Earth with text "Standing by for fresh intel".',
      'Countdown-inspired motion graphics signaling the next update window.'
    ];
  }

  return articles.map((article) => {
    const date = format(article.publishedAt, 'MMM d, HH:mm');
    return `Overlay article title "${article.title}" with animated HUD graphics, timestamp ${date}, and B-roll themed around ${article.topic.toLowerCase()}.`;
  });
}

function buildVoiceOverPrompt(narration: string): string {
  return [
    'Voice-over prompt:',
    'Energetic, youthful presenter speaking quickly but clearly.',
    'Pacing suitable for a 55-second short with slight emphasis on key buzzwords.',
    `Script: ${narration}`
  ].join('\n');
}

export function generateContent(articles: GoogleNewsArticle[]): GeneratedContent {
  const narrationScript = buildNarration(articles);

  return {
    youtubeTitle: buildTitle(articles),
    narrationScript,
    hashtags: buildHashtags(articles),
    thumbnailText: buildThumbnailText(articles),
    visualIdeas: buildVisualIdeas(articles),
    voiceOverPrompt: buildVoiceOverPrompt(narrationScript)
  };
}
