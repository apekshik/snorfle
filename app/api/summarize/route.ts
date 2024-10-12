import { NextResponse } from 'next/server';
import FirecrawlApp, { CrawlParams, CrawlStatusResponse } from '@mendable/firecrawl-js';

export async function GET() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  const firecrawlApp = new FirecrawlApp({ apiKey: apiKey });

  const scrapeResponse = await firecrawlApp.scrapeUrl('https://sf.eater.com/maps/best-seafood-restaurants-san-francisco', {
    formats: ['markdown', 'html'],
  });

  console.log(scrapeResponse);

  if (!scrapeResponse.success) {
    throw new Error(`Failed to scrape: ${scrapeResponse.error}`)
  }

  return NextResponse.json({ message: 'OK', response: scrapeResponse }, { status: 200 });
}
