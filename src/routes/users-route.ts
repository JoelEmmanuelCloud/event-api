import express from 'express';
const router = express.Router();

import  { signUpUser }   from '../controllers/users-controller';

import { StatusCodes } from 'http-status-codes'; 


router.post('/signup', async (req, res) => {
    const newUserSignupData = req.body;

    try {
        const user = await signUpUser(newUserSignupData);
        res.status(StatusCodes.CREATED).json({ user });
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(StatusCodes.BAD_REQUEST).json({  message: errorMessage });
    }
});

export default router;






