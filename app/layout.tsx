import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://agentic-09f9d8e1.vercel.app'),
  title: 'TechSpace AI - Autonomous Tech & Space News Curator',
  description:
    'TechSpace AI automatically curates, summarizes, and scripts the latest technology and space exploration news for YouTube Shorts.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
