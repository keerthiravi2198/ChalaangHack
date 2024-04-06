import { ChatCompletionMessageParam } from 'openai/resources';
import { EnumOpenAIModel, OpenAIService } from './OpenAIService'; // Assuming OpenAIService contains the chatCompletion method
import { SearchResult } from './SearchEngine';
import { UserHistoryDetails } from './SeachController';
const openAIService = new OpenAIService();

export async function generateSummary(userQuery: string,searchResults: SearchResult[], userHistoryDetails?: UserHistoryDetails[], userEmail?: string, previousQuerySummary?: string): Promise<string> {
    try {
        const priorMessages: ChatCompletionMessageParam[] = [];

        priorMessages.push({
            role: "system",
            content: `You are coding a function to parse structured data and generate a summary from search engine results for a given query.
        
            Instructions:
            - Analyze and distill data from the top search engine results given to you.
            - Refine the extracted information to ensure coherence, accuracy, and relevance in the summary.
            - Filter out noise and prioritize valuable insights from the search results.

            Rules:
            - The search results are based on the user's query and should be accurately summarized.
            - The summary should be concise, informative, and well-structured.
            - Include key details and highlights from the search results.
            - Avoid redundancy and irrelevant information in the summary.
            - Ensure that the summary is easy to read and understand.
            - Do not hallucinate or generate false information in the summary or title or linksToShow.
            - Do not generate irrelevant links in the linksToShow section.
            - Do not assume facts not present in the search results if it's about personal data or private information.
            - Make sure the content is joyful to read and not dull or boring.
            - You can add any relevant emoji to make the title and summary more engaging and fun, but don't overdo it.
            - The System should be capable of understanding user behaviour based on his past search history and his feedbacks provide for the search result he recived.
            - The System should regenerate a more informed and user currated search result  if user wants requests for another response.
            Response Format:
            - Respond in the JSON format without additional descriptions about why you came up with the particular JSON.
            - Preamble is not required in the response.
            - Include structured data and a summary for each search result item.
            - Follow the structure provided in the ParsedSearchResult interface below.
            - Do not add more than 3 relevant links for each search result that we can show to user.
            - Generated summary should be atleast 500-1000 characters long separated in 1-3 paragraphs and not exceed 4096 characters.
            - Generated title, brief, and summary should be relevant to the search results.
            - Generated brief should be a concise version of the summary, ideally around 1-3 sentences.
            - Do not generate array of ParsedSearchResult. Only generate a single ParsedSearchResult object.
        
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
            `,
        });

        let userContent = `Search results from the search engine:
        ${searchResults.map((result, index) => `${index + 1}. ${result.title}\nDescription: ${result.description}\nURL: ${result.link}`).join('\n\n')}
    `;

        //request of regenerate
        if(userHistoryDetails && userHistoryDetails.length) {
           
            userContent += `Below is user search history, use this to understand user behaviour : 
                    ${userHistoryDetails.map((result, index) => `${index + 1}. ${result.query}\nSearch result: ${result.searchResult}\nUser feedback: ${result.feedback}`).join('\n\n')}
                    `;
        }
        if(previousQuerySummary) {
            userContent += `Below is the response user received for the query previously, give a regenerated and improved response : 
                    ${previousQuerySummary}
                    `;
        }
        priorMessages.push({
            role: "user",
            content: userContent,
        });

        priorMessages.push({
            role: "assistant",
            content: `Based on the search results, here is a summary of the information in JSON format:
            `,
        });

        var response = await openAIService.chatCompletion({
            messages: priorMessages,
            model: EnumOpenAIModel.gpt4Turbo,
            maxTokens: 4096,
            temperature: 0.7,
            userId: userEmail ?? '',
        });

        var summary = response.choices?.[0].message?.content ?? '';

        return summary;
    } catch (error) {
        console.error('Error generating summary:', error);
        throw new Error('Error generating summary');
    }
}
