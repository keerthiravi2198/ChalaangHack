import { Request, Response } from 'express';
import { SearchResult, searchInt } from './SearchEngine';
import UserHistory from './UserHistory';
import { generateSummary } from './GenerateSummary';

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
        const summary = await generateSummary(searchResults, userEmail);

        console.log('Summary:', summary);

        res.status(200).json({ success: true, results: searchResults });
    } catch (error) {
        console.error('Error in searchController:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// Utility function to combine historical results and search engine results
function combineResults(historicalResults: SearchResult[], engineResults: SearchResult[]): SearchResult[] {
    return [...historicalResults, ...engineResults];
}


