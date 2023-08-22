import express from 'express';
const router = express.Router();
import { createJWT } from '../utils/jwt';
import { signUpUser, signInUser } from '../controllers/user-controller';
import { signupSchema, signInSchema } from '../validators/user-validator';
import { StatusCodes } from 'http-status-codes';

router.post('/sign-up', async (req, res) => {
    const newUserSignupData = req.body;

    try {
        const { error, value } = signupSchema.validate(newUserSignupData);

        if (error) {
            res.status(StatusCodes.BAD_REQUEST).json({ errors: error.details });
            return;
        }

        const user = await signUpUser(value);
        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: user.birthDate,
            city: user.city,
            country: user.country,
            email: user.email,
            __v: user.__v
        };

        res.status(StatusCodes.CREATED).json(userResponse);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: errorMessage,
        });
    }
});

router.post('/sign-in', async (req, res) => {
    const signInData = req.body;

    try {
        const { error, value } = signInSchema.validate(signInData);

        if (error) {
            res.status(StatusCodes.BAD_REQUEST).json({ errors: error.details });
            return;
        }

        const user = await signInUser(value);

        const token = createJWT({ payload: { _id: user._id } });

        res.status(StatusCodes.OK).json({
            token,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: errorMessage,
        });
    }
});

export default router;
