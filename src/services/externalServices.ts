import axios, { AxiosResponse } from 'axios';

const BASE_URL = 'https://api.example.com'; // Replace with your API base URL

export const getExternalData = async (): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios.get(`${BASE_URL}/endpoint`);
    return response.data;
  } catch (error) {
    throw error;
  }
};