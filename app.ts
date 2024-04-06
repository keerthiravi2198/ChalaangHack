import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './database'; // Import the connectDB function from database.ts
import { SearchController } from './src/controllers/SeachController';
import { GetSearchResultController } from './src/controllers/getSearchResult';
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.post('/search', SearchController);
app.get('/searchResult', GetSearchResultController)


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Connect to MongoDB
connectDB().catch(console.error);
