import puppeteer from 'puppeteer';
import axios from 'axios';

export interface SearchResult {
  title: string;
  snippet: string;
  link: string;
  description: string;
}

export async function searchInt(query: string): Promise<SearchResult[] > {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage'
    ],
  });
  const page = await browser.newPage();

  try {
    const searchEngines = [  'google' ];
    const searchResults: { [key: string]: SearchResult[] } = {};

    for (const engine of searchEngines) {
      let searchUrl: string;
      switch (engine) {
        case 'google':
          searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)},`;
          break;
        case 'bing':
          searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
          break;
        case 'duckduckgo':
          searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
          break;
        default:
          throw new Error('Invalid search engine specified');
      }

      await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

      // Wait for the search results container to appear based on the search engine
      let selector: string;
      switch (engine) {
        case 'google':
          selector = '.g';
          break;
        case 'bing':
          selector = '.b_algo';
          break;
        case 'duckduckgo':
          selector = '.result';
          break;
        default:
          throw new Error('Invalid search engine specified');
      }
      await page.waitForSelector(selector);

      const results: SearchResult[] = await page.evaluate((sel) => {
        const searchItems: HTMLElement[] = Array.from(document.querySelectorAll(sel));

        return searchItems.map(item => ({
          title: item.querySelector('h3')?.textContent || '',
          snippet: item.querySelector('div.IsZvec')?.textContent || '',
          link: item.querySelector('a')?.href || '',
          description: item.querySelector('span.st')?.textContent || '',
        })).filter(result => result.title && result.link); // Filter out null or empty title/link
      }, selector);

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

      // Sort the results by description length in descending order
      results.sort((a, b) => b.description.length - a.description.length);

      searchResults[engine] = results;
    }

    return searchResults.google;
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


