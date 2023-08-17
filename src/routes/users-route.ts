import express from 'express';
const router = express.Router();

import  { signUpUser }   from '../controllers/auth-controller';
import  signupSchema  from  '../validators/auth-validator';
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
      res.status(StatusCodes.CREATED).json({ user });
    } catch (error) {
      const errorMessage = (error as Error).message;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    }
  });
  
  export default router;

// router.post('/signup', async (req, res) => {
//     const newUserSignupData = req.body;

//     try {
//         const user = await signUpUser(newUserSignupData);
//         res.status(StatusCodes.CREATED).json({ user });
//     } catch (error) {
//         const errorMessage = (error as Error).message;
//         res.status(StatusCodes.BAD_REQUEST).json({  message: errorMessage });
//     }
// });

// export default router;






