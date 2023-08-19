import { Document} from 'mongoose';

export interface Event {
    _id: string;
    description: string;
    dayOfWeek: string;
    userId: string;
}

export interface IEventDocument extends Document {
    description: string;
    dayOfWeek: string;
    userId: string;
}


