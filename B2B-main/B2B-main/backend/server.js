import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectToDb } from './database/db.js';
import authRoute from './routes/authRoute.js';
import orderRoute from './routes/orderRoute.js';
import adminRoute from './routes/adminRoute.js';
import stockRoute from './routes/stockRoute.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT;
connectToDb();

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoute);
app.use('/api/orders',orderRoute);
app.use('/api/admin',adminRoute);
app.use('/api/stock',stockRoute);

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
});

