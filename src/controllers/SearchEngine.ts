import axios from 'axios';
import puppeteer from 'puppeteer';

export interface SearchResult {
  title: string;
  snippet: string;
  link: string;
  description: string;
}

export async function searchInt(query: string): Promise<SearchResult[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage'
    ],
  });
  const page = await browser.newPage();

  try {
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded' });
    //  await page.goto(`https://www.bing.com/search?q=${encodeURIComponent(query)}`);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const results: SearchResult[] = await page.evaluate(() => {
      const searchItems: HTMLElement[] = Array.from(document.querySelectorAll('.g'));

      return searchItems.map(item => ({
        title: item.querySelector('h3')?.textContent || '',
        snippet: item.querySelector('div.IsZvec')?.textContent || '',
        link: item.querySelector('a')?.href || '',
        description: item.querySelector('span.st')?.textContent || '',
      }));
    });

    // Fetch meta descriptions for each search result using promises
    await Promise.all(results.map(async (result) => {
      try {
        const metaDescription = await getMetaDescription(result.link);
        console.log('Meta description for', result.link, ':', metaDescription);
        result.description = metaDescription;
      } catch (error) {
        console.error('Error fetching meta description for', result.link, ':', error);
        result.description = '';
      }
    }));
    //sort the results by description in descending order
    results.sort((a, b) => b.description.length - a.description.length);
    return results;
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  } finally {
    await browser.close();
  }
}

async function getMetaDescription(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const metaDescriptionRegex = /<meta\s+name=["']description["']\s+content=["']([^"']+)["']\s*\/?>/i;

    // Extract meta description from HTML using regex
    const match = html.match(metaDescriptionRegex);

    if (match && match[1]) {
      return match[1]; // Return meta description if found
    } else {
      return ''; // Return empty string if meta description is not available
    }
  } catch (error) {
    return '';
  }
}





