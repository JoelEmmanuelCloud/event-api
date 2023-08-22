import mongoose from 'mongoose';
import UserModel from '../models/users';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from '../db/connectDB';

dotenv.config();

describe('User Schema', () => {
    beforeAll(async () => {
        const mongoUrl = process.env.MONGO_URL as string;

        await connectDB(mongoUrl);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
    });

    it('Should create a new user', async () => {
        const newUser = {
            firstName: 'John',
            lastName: 'Doe',
            birthDate: '1990-01-01',
            city: 'City Name',
            country: 'Country Name',
            email: 'john.doe@example.com',
            password: 'password123',
        };

        const savedUser = await UserModel.create(newUser);

        expect(savedUser.firstName).toBe(newUser.firstName);
        expect(savedUser.lastName).toBe(newUser.lastName);
        expect(savedUser.birthDate).toBe(newUser.birthDate);
        expect(savedUser.city).toBe(newUser.city);
        expect(savedUser.country).toBe(newUser.country);
        expect(savedUser.email).toBe(newUser.email);
        expect(savedUser.password).not.toBe(newUser.password);
    }, 90000);

    it('Should not create a user with invalid data', async () => {
        const invalidUser = {};

        await expect(UserModel.create(invalidUser)).rejects.toThrow(
            mongoose.Error.ValidationError,
        );
    }, 90000);

    it('Should compare passwords correctly', async () => {
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            firstName: 'Jane',
            lastName: 'Smith',
            birthDate: '1995-05-05',
            city: 'Another City',
            country: 'Another Country',
            email: 'jane.smith@example.com',
            password: hashedPassword,
        });

        const isMatch = await user.comparePassword(password);

        expect(isMatch).toBe(true);
    }, 90000);

    it('Should return false for incorrect password comparison', async () => {
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            firstName: 'Alice',
            lastName: 'Johnson',
            birthDate: '1985-08-15',
            city: 'Yet Another City',
            country: 'Yet Another Country',
            email: 'alice.johnson@example.com',
            password: hashedPassword,
        });

        const isMatch = await user.comparePassword('incorrectPassword');

        expect(isMatch).toBe(false);
    }, 90000);
});
