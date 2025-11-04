import { fetchLatestTechSpaceNews } from '../lib/googleNews';
import { generateContent } from '../lib/contentGenerator';
import { format } from 'date-fns';

export const revalidate = 120;

export default async function Home() {
  const articles = await fetchLatestTechSpaceNews();
  const generated = generateContent(articles);
  const generatedAt = new Date();

  return (
    <main>
      <div className="brand">
        TechSpace AI <span>Autonomous</span>
      </div>
      <h1 className="title">Latest Tech & Space Short</h1>
      <p className="subtitle">
        Automatically curated from verified Google News sources in the past 24 hours. Ready-to-go
        narration, social hooks, and production notes for a 60-second vertical video.
      </p>

      <section className="section script-block">
        <h2>YouTube Short Package</h2>
        <div>
          <strong>Title:</strong> {generated.youtubeTitle}
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <strong>Voiceover Script:</strong>
          <pre>{generated.narrationScript}</pre>
        </div>
        <div className="hashtags">
          {generated.hashtags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <strong>Thumbnail Text:</strong> {generated.thumbnailText}
        </div>
      </section>

      <section className="section visual-ideas">
        <h2>Creative Notes</h2>
        <p className="muted">Visual ideas for each beat to guide editing or prompt generation.</p>
        <ul>
          {generated.visualIdeas.map((idea, index) => (
            <li key={index}>{idea}</li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Voice-Over Prompt</h2>
        <pre>{generated.voiceOverPrompt}</pre>
      </section>

      <section className="section">
        <h2>Featured Stories</h2>
        <p className="muted">
          Pulled directly from Google News within the last 24 hours. Each card links to the original
          coverage.
        </p>
        {articles.length > 0 ? (
          <div className="news-list">
            {articles.map((article) => (
              <article key={article.id}>
                <span className="pill">{article.topic}</span>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <footer>
                  <span>
                    Source:{' '}
                    <a className="source-link" href={article.link} target="_blank" rel="noreferrer">
                      {article.sourceName}
                    </a>
                  </span>
                  <span className="timestamp">{article.publishedRelative}</span>
                </footer>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">
            No qualifying articles were detected within the last 24 hours. Check back shortly for the
            next refresh.
          </p>
        )}
      </section>

      <section className="section">
        <h2>Metadata</h2>
        <p className="muted">
          Generated at {format(generatedAt, "MMM d, yyyy 'at' HH:mm 'UTC'xxx")} · Feed refreshes every
          ~2 minutes.
        </p>
      </section>
    </main>
  );
}
