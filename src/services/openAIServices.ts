import axios, { AxiosResponse } from 'axios';

const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // Replace with your OpenAI API key
const OPENAI_API_URL = 'https://api.openai.com/v1/';

export const getOpenAICompletion = async (prompt: string): Promise<string> => {
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${OPENAI_API_URL}/completions`,
      {
        model: 'text-davinci-002', // Replace with the desired model
        prompt,
        max_tokens: 50, // Adjust based on your requirements
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].text;
  } catch (error) {
    throw error;
  }
};