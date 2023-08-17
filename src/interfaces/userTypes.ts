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


interface User {
    _id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    city: string;
    country: string;
    email: string;
    password: string;
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

export {User,
    IUser, SignupData}
