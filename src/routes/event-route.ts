import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { createEvent, getEvents, deleteEventsByDay } from '../controllers/event-controller';
import { authenticateUser, ExtendedRequest } from '../middleware/authenticateUser';
import { createEventSchema } from '../validators/event-validator';

const router = express.Router();

router.post('/createEvent', authenticateUser, async (req: ExtendedRequest, res) => {
    try {
        const { error } = createEventSchema.validate(req.body);

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return res.status(StatusCodes.BAD_REQUEST).json({ message: errorMessage });
        }

        const createdEvent = await createEvent(req, res);
        res.status(StatusCodes.CREATED).json(createdEvent);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    }
});

router.get('/getEvents', authenticateUser, async (req: ExtendedRequest, res) => {
    try {
        const events = await getEvents(req, res);
        res.status(StatusCodes.OK).json(events);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    }
});

router.delete('/deleteEvents/:dayOfWeek', authenticateUser, async (req: ExtendedRequest, res) => {
    try {
        const deletedEventsResponse = await deleteEventsByDay(req, res);
        res.status(StatusCodes.OK).json(deletedEventsResponse);
    } catch (error) {
        const errorMessage = (error as Error).message;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: errorMessage });
    }
});

export default router;
