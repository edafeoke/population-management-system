import dotenv from 'dotenv';
import mongoose from 'mongoose';

import config from './config';

dotenv.config();

// db connection
mongoose.connect(config[process.env.NODE_ENV].url, { useNewUrlParser: true });

const dbConnection = mongoose.connection

export default dbConnection;
