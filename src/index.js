import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import expressValidator from 'express-validator';

import appRoutes from './routes';
import dbConnection from './config';

// Use dotenv package
require('dotenv').config();

const app = express();
const port = process.env.PORT || 9000;

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(expressValidator());
app.use('/api/v1', appRoutes);


dbConnection.on('error', (error) => console.log(error))
dbConnection.once('open', () => {
  console.log('database is connected');
});

// Listen for connection requests
app.listen(port, (error) => {
  error ? console.log(error): console.log(`App started on ${port}`);
});

export default app;