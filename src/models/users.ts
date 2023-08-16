import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import IUser from '../interfaces/userTypes';

const isEmailValidator = (value: string) => {
    return validator.isEmail(value);
};

export interface IUserDocument extends IUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUserDocument> = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please provide first name'],
            maxlength: 50,
        },
        lastName: {
            type: String,
            required: [true, 'Please provide last name'],
            maxlength: 50,
        },
        birthDate: {
            type: String,
            required: [true, 'Please provide birth date'],
        },
        city: {
            type: String,
            required: [true, 'Please provide city'],
            maxlength: 50,
        },
        country: {
            type: String,
            required: [true, 'Please provide country'],
            maxlength: 50,
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Please provide email'],
            validate: {
                validator: isEmailValidator,
                message: 'Please provide valid email',
            },
        },
        password: {
            type: String,
            required: [true, 'Please provide password'],
            minlength: 6,
        },
    },
    { timestamps: true }
);

UserSchema.pre<IUserDocument>('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);

export default UserModel;
