import express from 'express';
const router = express.Router();
import { createJWT } from '../utils/jwt';
import  { signUpUser, signinUser }   from '../controllers/auth-controller';
import {signupSchema, signinSchema}  from  '../validators/auth-validator'
import { StatusCodes } from 'http-status-codes'; 

router.post('/signup', async (req, res) => {
    const newUserSignupData = req.body;
  
    try {
      const { error, value } = signupSchema.validate(newUserSignupData);
  
      if (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ errors: error.details });
        return;
      }
  
      const user = await signUpUser(value);

      const userWithoutPassword = { ...user.toObject() };
      delete userWithoutPassword.password;
      res.status(StatusCodes.CREATED).json({ user: userWithoutPassword });
    } catch (error) {
      const errorMessage = (error as Error).message;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    }
});
  


router.post('/signin', async (req, res) => {
    const signinData = req.body;

    try {
        const { error, value } = signinSchema.validate(signinData);

        if (error) {
            res.status(StatusCodes.BAD_REQUEST).json({ errors: error.details });
            return;
        }

        const user = await signinUser(value);

        const token = createJWT( {payload: { _id: user._id}} );

        const userResponse = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };

        res.status(StatusCodes.OK).json({ token, user: userResponse });
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    }
});



export default router;
