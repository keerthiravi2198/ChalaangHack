import { Request, Response } from 'express';
import Example from '../models/indexModel';
import { getExternalData } from '../services/externalService';
import { getOpenAICompletion } from '../services/openaiService';

export const getAllExamples = async (req: Request, res: Response): Promise<void> => {
  try {
    const examples = await Example.find();
    res.json(examples);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createExample = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;
    const example = new Example({ name });
  
    try {
      const newExample = await example.save();
      res.status(201).json(newExample);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  export const getExternalDataExample = async (req: Request, res: Response): Promise<void> => {
    try {
      const externalData = await getExternalData();
      res.json(externalData);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  export const getOpenAICompletionExample = async (req: Request, res: Response): Promise<void> => {
    try {
      const prompt: string = req.body.prompt;
      const completion = await getOpenAICompletion(prompt);
      res.json({ completion });
    } catch (error) {
      res.status(500).json({ message: err.message });
    }
  };