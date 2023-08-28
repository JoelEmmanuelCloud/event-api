import express from 'express';
import connectDB from './db/connectDB';
import userRouter from './routes/user-route';
import eventRouter from './routes/event-route';
import notFoundMiddleware from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/events', eventRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = Number(process.env.PORT);

const MONGO_URL = process.env.MONGO_URL as string;

const start = async () => {
    try {
        await connectDB(MONGO_URL);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`),
        );
    } catch (error) {
        console.log(error);
    }
};

start();
