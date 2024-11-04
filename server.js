import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const PORT = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get('/api/test', (req, res) => {
    res.send({ message: "Connexion réussie avec le backend !" });
});

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    
   
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
} else {
   
    app.get('/', (req, res) => {
        res.send('API is running....');
    });
}


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


