import express from 'express';
import connectDB from './db/connectDB';
import dotenv from 'dotenv';
import morgan from 'morgan';


dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {

    res.send('Hello, Express!');
});


const port = Number(process.env.PORT) || 5000;

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