import express from 'express';
import { StatusCodes } from 'http-status-codes';
import {
    createEvent,
    getEvents,
    deleteEventsByDay,
    getEventById,
    deleteEventById,
} from '../controllers/event-controller';
import {
    authenticateUser,
    ExtendedRequest,
} from '../middleware/authenticateUser';
import { createEventSchema } from '../validators/event-validator';

const router = express.Router();

router.post('/', authenticateUser, async (req: ExtendedRequest, res) => {
    try {
        const { error } = createEventSchema.validate(req.body);

        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join(', ');
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: errorMessage });
        }

        const createdEvent = await createEvent(req, res);
        res.status(StatusCodes.CREATED).json(createdEvent);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: errorMessage,
        });
    }
});

router.get('/', authenticateUser, async (req: ExtendedRequest, res) => {
    try {
        const events = await getEvents(req, res);

        if (
            events.length === 1 &&
            'message' in events[0] &&
            events[0].message === 'You have no events.'
        ) {
            res.status(StatusCodes.OK).json({ message: 'You have no events.' });
        } else {
            res.status(StatusCodes.OK).json(events);
        }
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: errorMessage,
        });
    }
});


router.delete(
    '/',
    authenticateUser,
    async (req: ExtendedRequest, res) => {
        try {
            const deletedEventsResponse = await deleteEventsByDay(req, res);
            res.status(StatusCodes.OK).json(deletedEventsResponse);
        } catch (error) {
            const errorMessage = (error as Error).message;
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: errorMessage,
            });
        }
    },
);


router.get('/:id', authenticateUser, async (req: ExtendedRequest, res) => {
    try {
        const event = await getEventById(req, res);

        if (!event) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: 'Event not found.' });
        }

        res.status(StatusCodes.OK).json(event);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: errorMessage,
        });
    }
});


router.delete(
    '/:id',
    authenticateUser,
    async (req: ExtendedRequest, res) => {
        try {
            const event = await deleteEventById(req, res);

            res.status(StatusCodes.OK).json(event);
        } catch (error) {
            const errorMessage = (error as Error).message;
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: errorMessage,
            });
        }
    },
);

export default router;
