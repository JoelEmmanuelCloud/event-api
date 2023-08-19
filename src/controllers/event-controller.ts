import { Request, Response } from 'express';
import { EventModel } from '../models/events';
import { Event } from '../interfaces/eventTypes';
import { ExtendedRequest } from '../middleware/authenticateUser';

export async function createEvent(req: ExtendedRequest, res: Response): Promise<Event> {
    const { description, dayOfWeek } = req.body;
    const userId = req.userId

    try {
        const newEvent = new EventModel({
            description,
            dayOfWeek,
            userId
        });

        await newEvent.save();

        const createdEvent: Event = {
            _id: newEvent._id,
            description: newEvent.description,
            dayOfWeek: newEvent.dayOfWeek,
            userId: newEvent.userId,
        };

        return createdEvent;
    } catch (error) {
        throw error;
    }
}

export async function getEvents(req: ExtendedRequest, res: Response): Promise<Event[]> {
    try {
        const userId = req.userId;
        const events = await EventModel.find({userId});
        const formattedEvents: Event[] = events.map(event => ({
            _id: event._id,
            description: event.description,
            dayOfWeek: event.dayOfWeek,
            userId: event.userId,
        }));
        return formattedEvents;
    } catch (error) {
        throw error;
    }
}
