import express from 'express';
const router = express.Router();

import  { signUpUser }   from '../controllers/auth-controller';
import signupSchema  from  '../validators/auth-validator'
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
  
export default router;
