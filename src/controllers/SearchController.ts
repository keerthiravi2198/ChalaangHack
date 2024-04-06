import { Request, Response } from 'express';
import { SearchResult, searchInt } from './SearchEngine';
import UserHistory, {  IUserHistory } from './UserHistory';
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
    const { userEmail, query, isRegenerate } = req.body;
    try {
        const queryResult = await UserHistory.find(
            { userEmail }
        ).sort({ _id: -1 }).exec();
        if(!isRegenerate){
            const searchResult: { id: string; userHistory: IUserHistory; }[] = queryResult
            .filter(result => result.userEmail === userEmail && result.query === query)
            .map(result => ({
                id: result._id, // Assuming the ID field is named "_id" in your queryResult
                userHistory: {
                    userEmail: result.userEmail,
                    query: result.query,
                    timestamp: result.timestamp,
                    searchResult: JSON.parse(result.searchResult),
                    feedback: result.feedback,
                } as IUserHistory // Ensure userHistory matches IUserHistory
            }));
        
        
            if(searchResult.length > 0){
                res.status(200).json({ success: true, results: searchResult[0].userHistory.searchResult, id: searchResult[0].id });
            }
        }
            const historicalResults: IUserHistory[] = queryResult.map((result) => {
                return {
                    userEmail: result.userEmail,
                    query: result.query,
                    timestamp: result.timestamp,
                    searchResult: JSON.parse(result.searchResult),
                    feedback: result.feedback,
                } as IUserHistory;
            });
            const searchResultsFromEngine: SearchResult[] = await searchInt(query);
            const summary = await generateSummary(query, searchResultsFromEngine.filter(result => result !== null), userEmail, historicalResults);
            const finalSummaryString = summary.replace("```json", "").replace("```", "");
            const parsedSummary: ParsedSearchResult = JSON.parse(finalSummaryString);
            let userHistory = await UserHistory.create({ userEmail, query, searchResult: finalSummaryString, timestamp: Date.now() });
            console.log("id", userHistory._id);
            res.status(200).json({ success: true, results: parsedSummary, id: userHistory._id });
    } catch (error) {
        console.error('Error in searchController:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


