import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './database'; // Import the connectDB function from database.ts
import { SearchController } from './src/controllers/SeachController';

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/search', SearchController); // Assuming this route handles search requests

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Connect to MongoDB
connectDB().catch(console.error);
