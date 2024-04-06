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

export interface UserHistoryDetails {
    searchResult: any,
    query: string,
    feedback?:  "happy with response" | "not happy with the response" | "user is ok with the response recived"
}
export async function SearchController(req: Request, res: Response) {



    const { userEmail, query, id } = req.body;
    //
    try {

        //handle regeneration flow as well.
        if(id) { 
            const queryResult = await UserHistory.findById({ id }).exec();
            
        }

        //use top historic data of that user to improve/ provide customisable results.
        const userHistoryWithFeedback = await UserHistory.find({ userEmail  }).sort({_id:1}).exec();

        let userHistoryDetailsWithFeedback : UserHistoryDetails[] = [];
        userHistoryWithFeedback?.forEach(history => {
            userHistoryDetailsWithFeedback.push({ 
                searchResult: history.searchResult,
                query: history.query,
                feedback: history.feedback? "happy with response" : (history.feedback === false? "not happy with the response" : "user is ok with the response recived")
            })
            
           });

        let searchResults: SearchResult[] = await searchInt(query);
   
        //pass the search results to the open ai service
        const summary = await generateSummary(
            query,
            searchResults.filter((result) => result!==null),
            userHistoryDetailsWithFeedback, 
            userEmail);
        const finalSummaryString = summary.replace("```json", "").replace("```", "");
        console.log('Summary:', finalSummaryString);

        const parsedSummary: ParsedSearchResult = JSON.parse(finalSummaryString);

        await UserHistory.create({ userEmail, query, searchResult: parsedSummary , timestamp: Date.now() });


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


