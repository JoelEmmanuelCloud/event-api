import {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} from '../../errors/api-errors';
import UserModel from '../../models/users';
import { SignupData, SignInData } from '../../interfaces/userTypes';
import { signUpUser, signInUser } from '../../controllers/user-controller';
import { ObjectId } from 'mongodb';

describe('Sign Up User', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('Should sign up a new user successfully!', async () => {
        const mockSignupData: SignupData = {
            firstName: 'John',
            lastName: 'Doe',
            birthDate: '1990-01-01',
            city: 'City',
            country: 'Country',
            email: 'user@gmail.com',
            password: 'securepassword',
        };

        const mockUserDocument = {
            firstName: mockSignupData.firstName,
            lastName: mockSignupData.lastName,
            birthDate: mockSignupData.birthDate,
            city: mockSignupData.city,
            country: mockSignupData.country,
            email: mockSignupData.email,
            password: mockSignupData.password,
        };

        const findOneSpy = jest
            .spyOn(UserModel, 'findOne')
            .mockResolvedValueOnce(null);
        const saveSpy = jest
            .spyOn(UserModel.prototype, 'save')
            .mockResolvedValueOnce(mockUserDocument);

        const createdUser = await signUpUser(mockSignupData);

        expect(findOneSpy).toHaveBeenCalledWith({
            email: mockSignupData.email,
        });
        expect(saveSpy).toHaveBeenCalledWith();

        expect(createdUser.firstName).toEqual(mockUserDocument.firstName);
        expect(createdUser.lastName).toEqual(mockUserDocument.lastName);
        expect(createdUser.birthDate).toEqual(mockUserDocument.birthDate);
        expect(createdUser.city).toEqual(mockUserDocument.city);
        expect(createdUser.country).toEqual(mockUserDocument.country);
        expect(createdUser.email).toEqual(mockUserDocument.email);
        expect(createdUser.password).toEqual(mockUserDocument.password);

        findOneSpy.mockRestore();
        saveSpy.mockRestore();
    });

    it('Should return an error when email already exists', async () => {
        const mockSignupData: SignupData = {
            firstName: 'John',
            lastName: 'Doe',
            birthDate: '1990-01-01',
            city: 'City',
            country: 'Country',
            email: 'user@gmail.com',
            password: 'securepassword',
        };

        const existingUser = {
            ...mockSignupData,
            _id: new ObjectId().toHexString(),
            comparePassword: jest.fn().mockResolvedValue(true),
        };

        const findOneSpy = jest
            .spyOn(UserModel, 'findOne')
            .mockResolvedValueOnce(existingUser);

        await expect(signUpUser(mockSignupData)).rejects.toThrow(
            BadRequestError,
        );

        expect(findOneSpy).toHaveBeenCalledWith({
            email: mockSignupData.email,
        });

        findOneSpy.mockRestore();
    });

    it('Should handle errors during user signup', async () => {
        const mockSignupData: SignupData = {
            firstName: 'John',
            lastName: 'Doe',
            birthDate: '1990-01-01',
            city: 'City',
            country: 'Country',
            email: 'user@gmail.com',
            password: 'securepassword',
        };

        const findOneSpy = jest
            .spyOn(UserModel, 'findOne')
            .mockRejectedValueOnce(new Error('Database error'));

        await expect(signUpUser(mockSignupData)).rejects.toThrow(Error);

        expect(findOneSpy).toHaveBeenCalledWith({
            email: mockSignupData.email,
        });

        findOneSpy.mockRestore();
    });
});

describe('Sign In User', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('Should sign in an existing user successfully', async () => {
        const mockSignInData: SignInData = {
            email: 'user@gmail.com',
            password: 'securepassword',
        };

        const mockUserDocument = {
            _id: new ObjectId().toHexString(),
            firstName: 'John',
            lastName: 'Doe',
            birthDate: '1990-01-01',
            city: 'City',
            country: 'Country',
            email: mockSignInData.email,
            password: 'hashedPassword',
            comparePassword: jest.fn().mockResolvedValue(true),
        };

        const findOneSpy = jest
            .spyOn(UserModel, 'findOne')
            .mockResolvedValueOnce(mockUserDocument);

        const user = await signInUser(mockSignInData);

        expect(findOneSpy).toHaveBeenCalledWith({
            email: mockSignInData.email,
        });
        expect(user).toEqual(mockUserDocument);

        findOneSpy.mockRestore();
    });

    it('Should return an error when user does not exist', async () => {
        const mockSignInData: SignInData = {
            email: 'user@gmail.com',
            password: 'securepassword',
        };

        const findOneSpy = jest
            .spyOn(UserModel, 'findOne')
            .mockResolvedValueOnce(null);

        await expect(signInUser(mockSignInData)).rejects.toThrow(NotFoundError);

        expect(findOneSpy).toHaveBeenCalledWith({
            email: mockSignInData.email,
        });

        findOneSpy.mockRestore();
    });

    it('Should return an error when password is incorrect', async () => {
        const mockSignInData: SignInData = {
            email: 'user@gmail.com',
            password: 'incorrectpassword',
        };

        const mockUserDocument = {
            _id: new ObjectId().toHexString(),
            firstName: 'John',
            lastName: 'Doe',
            birthDate: '1990-01-01',
            city: 'City',
            country: 'Country',
            email: mockSignInData.email,
            password: 'hashedPassword',
            comparePassword: jest.fn().mockResolvedValue(false),
        };

        const findOneSpy = jest
            .spyOn(UserModel, 'findOne')
            .mockResolvedValueOnce(mockUserDocument);

        await expect(signInUser(mockSignInData)).rejects.toThrow(
            UnauthorizedError,
        );

        expect(findOneSpy).toHaveBeenCalledWith({
            email: mockSignInData.email,
        });

        findOneSpy.mockRestore();
    });

    it('Should handle errors during user sign-in', async () => {
        const mockSignInData: SignInData = {
            email: 'user@gmail.com',
            password: 'securepassword',
        };

        const findOneSpy = jest
            .spyOn(UserModel, 'findOne')
            .mockRejectedValueOnce(new Error('Database error'));

        await expect(signInUser(mockSignInData)).rejects.toThrow(Error);

        expect(findOneSpy).toHaveBeenCalledWith({
            email: mockSignInData.email,
        });

        findOneSpy.mockRestore();
    });
});
