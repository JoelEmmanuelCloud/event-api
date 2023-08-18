import CustomError from '../error';
import UserModel  from '../models/users';
import { SignupData, IUserDocument, SigninData } from '../interfaces/userTypes'



async function signUpUser(signupData: SignupData): Promise<IUserDocument> {
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


async function signinUser(signinData: SigninData): Promise<IUserDocument> {
    try {
        const { email, password } = signinData;

        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new CustomError.NotFoundError('User not found');
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            throw new CustomError.UnauthorizedError('Invalid password');
        }

        return user;
    } catch (error) {
        throw error;
    }
}


export {
    signUpUser,
    signinUser
}