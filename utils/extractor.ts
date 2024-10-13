import axios from 'axios';
import { load } from 'cheerio'; // Use named import for 'load' from 'cheerio'

export async function fetchWebpageContent(url: string) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = load(html); // Use the 'load' method correctly here

    // Extract meaningful content from the webpage, e.g., paragraphs or main sections
    const content = $('p').map((_, el) => $(el).text()).get().join('\n');
    
    // Limit content length to avoid passing large inputs to the API
    return content.length > 2000 ? content.slice(0, 2000) : content;
  } catch (error) {
    console.error('Error fetching webpage content:', error);
    throw new Error('Failed to fetch content.');
  }
}