import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import testRoute from './routes/testRoute.js';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactionRoutes.js';
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'Missing');

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoute);


app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
