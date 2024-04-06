import { Request, Response } from 'express';
import { SearchResult, searchInt } from './SearchEngine';
import UserHistory from './UserHistory';
import { generateSummary } from './GenerateSummary';


export interface ParsedSearchResult {
    generatedTitle: string;
    generatedBrief: string;
    generatedSummary: string;
    linksToShow: {
        title: string;
        link: string;
        whyRelevant: string;
    }[];
}
export async function SearchController(req: Request, res: Response) {
    const { userEmail, query } = req.body;

    try {
        let searchResults: SearchResult[];

        const userHistory = await UserHistory.findOne({ userEmail }).exec();

        if (!userHistory) {
            searchResults = await searchInt(query);

            await UserHistory.create({ userEmail, query, timestamp: Date.now() });
        } else {
            const previousQuery = userHistory.query;
            const previousTimestamp = userHistory.timestamp;

            if (previousQuery === query) {
                const historicalResults = userHistory.searchResult;
                const engineResults = await searchInt(query);

                searchResults = combineResults(historicalResults, engineResults);
            } else {
                searchResults = await searchInt(query);

                await UserHistory.updateOne({ userEmail }, { query, timestamp: Date.now() });
            }
        }

        //pass the search results to the open ai service
        const summary = await generateSummary(searchResults.filter((result) => result!==null)
            , userEmail);
        const finalSummaryString = summary.replace("```json", "").replace("```", "");
        console.log('Summary:', finalSummaryString);

        const parsedSummary: ParsedSearchResult = JSON.parse(finalSummaryString);

        res.status(200).json({ success: true, results: parsedSummary });
    } catch (error) {
        console.error('Error in searchController:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// Utility function to combine historical results and search engine results
function combineResults(historicalResults: SearchResult[], engineResults: SearchResult[]): SearchResult[] {
    return [...historicalResults, ...engineResults];
}


