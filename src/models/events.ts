import mongoose, { Schema, Model } from 'mongoose';
import { IEventDocument } from '../interfaces/eventTypes';

const EventSchema: Schema<IEventDocument> = new Schema(
    {
        description: {
            type: String,
            required: [true, 'Please provide a description'],
        },
        dayOfWeek: {
            type: String,
            required: [true, 'Please provide the day of the week'],
        },
        userId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export interface IEventModel extends Model<IEventDocument> {}

export const EventModel: IEventModel = mongoose.model<
    IEventDocument,
    IEventModel
>('Event', EventSchema);
