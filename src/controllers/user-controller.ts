import {BadRequestError, NotFoundError, UnauthorizedError} from '../errors/api-errors';
import UserModel from '../models/users';
import { SignupData, IUserDocument, SignInData } from '../interfaces/userTypes';

async function signUpUser(signupData: SignupData): Promise<IUserDocument> {
    try {
        const existingUser = await UserModel.findOne({
            email: signupData.email,
        });
        if (existingUser) {
            throw new BadRequestError('Email already exists');
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
            throw new NotFoundError('User not found');
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid password');
        }

        return user;
    } catch (error) {
        throw error;
    }
}

export { signUpUser, signInUser };
