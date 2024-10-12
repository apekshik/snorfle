import { NextRequest, NextResponse } from 'next/server';
import FirecrawlApp, { CrawlParams, CrawlStatusResponse } from '@mendable/firecrawl-js';
import OpenAI from "openai";
import { summarizeInput } from '@/utils/xaiSummarizer';
import { title } from 'process';


interface PostInput {
  prompt: string;
  displayLink: string;
  link: URL;
  title: string;
  snippet: string;
}

interface ScrapeResponse {
  displayLink: string;
  link: URL;
  title: string;
  snippet: string;
  markdown?: string;
}

interface PostResponse {
  prompt: string;
  result: ScrapeResponse;
}

export async function GET() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  const firecrawlApp = new FirecrawlApp({ apiKey: apiKey });
  const xAi = new OpenAI();

  const scrapeResponse = await firecrawlApp.scrapeUrl('https://sf.eater.com/maps/best-seafood-restaurants-san-francisco', {
    formats: ['markdown', 'html'],
  });

  console.log(scrapeResponse);

  if (!scrapeResponse.success) {
    throw new Error(`Failed to scrape: ${scrapeResponse.error}`)
  }

  return NextResponse.json({ message: 'OK', response: scrapeResponse }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  const firecrawlApp = new FirecrawlApp({ apiKey: apiKey });
  const xAi = new OpenAI();

  try {
    // Parse the JSON body from the request
    const body: PostInput = await request.json();

    console.log(body);

    const scrapeResponse = await firecrawlApp.scrapeUrl(body.link.toString(), {
      formats: ['markdown'],
    });

    if (!scrapeResponse.success) {
      throw new Error(`Failed to scrape: ${scrapeResponse.error}`)
    }

    const response: PostResponse = {
      prompt: body.prompt,
      result: {
        displayLink: body.displayLink,
        link: body.link,
        title: body.title,
        snippet: body.snippet,
        markdown: scrapeResponse.markdown,
      },
    }

    const summary = await summarizeInput(
      [body.prompt, [{ title: body.title, website: body.link.toString(), markdown: scrapeResponse.markdown }]], xAi);

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/summarize:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
