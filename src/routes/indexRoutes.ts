import express from 'express';
import { getAllExamples, createExample, getExternalDataExample, getOpenAICompletionExample } from '../controllers/indexController';
export const indexRouter = express.Router();

indexRouter.get('/examples', getAllExamples);
indexRouter.post('/examples', createExample);
indexRouter.get('/external-data', getExternalDataExample);
indexRouter.get('openai-completion',getOpenAICompletionExample)
