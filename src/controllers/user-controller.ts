import CustomError from '../errors';
import UserModel from '../models/users';
import { SignupData, IUserDocument, SignInData } from '../interfaces/userTypes';

async function signUpUser(signupData: SignupData): Promise<IUserDocument> {
    try {
        const existingUser = await UserModel.findOne({
            email: signupData.email,
        });
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

async function signInUser(signInData: SignInData): Promise<IUserDocument> {
    try {
        const { email, password } = signInData;

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

export { signUpUser, signInUser };
