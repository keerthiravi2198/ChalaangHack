import express from 'express';
import bodyParser from 'body-parser';
import { indexRouter } from './routes/indexRoutes';

const app = express();

app.use(bodyParser.json());
app.use('/api', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});