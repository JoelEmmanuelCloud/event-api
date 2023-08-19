import { Document } from 'mongoose';

interface IUser extends Document {
    firstName: string;
    lastName: string;
    birthDate: string;
    city: string;
    country: string;
    email: string;
    password: string;
}

interface IUserDocument extends IUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

interface Payload {
    _id: string;
}

interface SignupData {
    firstName: string;
    lastName: string;
    birthDate: string;
    city: string;
    country: string;
    email: string;
    password: string;
}

interface SigninData {
    email: string;
    password: string;
}

export { Payload, IUser, SignupData, IUserDocument, SigninData };
