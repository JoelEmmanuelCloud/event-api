import CustomError from '../error';
import UserModel  from '../models/users';
import { SignupData, IUserDocument } from '../interfaces/userTypes'



export async function signUpUser(signupData: SignupData): Promise<IUserDocument> {
    try {
        
        const existingUser = await UserModel.findOne({ email: signupData.email });
        if (existingUser) {
            throw new CustomError.BadRequestError('Email already exists');
        }

        
        const newUser = new UserModel(signupData);

        
        await newUser.save();

        return newUser;
    } catch (error) {
        throw error;
    }
}



