import { Request, Response } from 'express';
import UserHistory from './UserHistory';
import { ParsedSearchResult } from './SearchController';

export async function GetSearchResultController(req: Request, res: Response) {
    const { id } = req.query;
    try {

        const queryResult = await UserHistory.findById(id).exec();
        if(!queryResult || !queryResult.searchResult) {
            throw("Data not found!");
        }
        let searchResult = queryResult.searchResult;
      
        const parsedSummary: ParsedSearchResult = JSON.parse(searchResult);
        res.status(200).json({ success: true, results: parsedSummary });

    } catch (error) {
        console.error('Error in ShareSearchResultController:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}



