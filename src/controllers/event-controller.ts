import { Response } from 'express';
import { EventModel } from '../models/events';
import { Event } from '../interfaces/eventTypes';
import { ExtendedRequest } from '../middleware/authenticateUser';

type EventOrMessage = Event | { message: string };

export async function createEvent(
    req: ExtendedRequest,
    res: Response,
): Promise<Event> {
    const { description, dayOfWeek } = req.body;
    const userId = req.userId;

    try {
        const newEvent = new EventModel({
            description,
            dayOfWeek,
            userId,
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

export async function getEvents(
    req: ExtendedRequest,
    res: Response,
): Promise<(Event | { message: string })[]> {
    try {
        const userId = req.userId;
        const events = await EventModel.find({ userId });

        if (events.length === 0) {
            return [{ message: 'You have no events.' }];
        }

        const formattedEvents: Event[] = events.map((event) => ({
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

export async function deleteEventsByDay(
    req: ExtendedRequest,
    res: Response,
): Promise<{ message: string }> {
    const userId = req.userId;
    const dayOfWeekToDelete = req.params.dayOfWeek;

    try {
        const deletedEvents = await EventModel.deleteMany({
            userId,
            dayOfWeek: dayOfWeekToDelete,
        });

        if (deletedEvents.deletedCount > 0) {
            return {
                message: `Events for ${dayOfWeekToDelete} have been deleted successfully.`,
            };
        } else {
            return { message: `No events found for ${dayOfWeekToDelete}.` };
        }
    } catch (error) {
        throw error;
    }
}

export async function getEventById(
    req: ExtendedRequest,
    res: Response,
): Promise<Event | null> {
    const userId = req.userId;
    const eventId = req.params.id;

    try {
        const event = await EventModel.findOne({ _id: eventId, userId });

        return event;
    } catch (error) {
        throw error;
    }
}

export async function deleteEventById(
    req: ExtendedRequest,
    res: Response,
): Promise<{ message: string }> {
    const userId = req.userId;
    const eventId = req.params.id;

    try {
        const deletedEvent = await EventModel.findOneAndDelete({
            _id: eventId,
            userId,
        });

        if (!deletedEvent) {
            return {
                message: `No event with ID ${eventId} found for the signed-in user.`,
            };
        }

        return {
            message: `Event with ID ${eventId} has been deleted successfully.`,
        };
    } catch (error) {
        throw error;
    }
}
