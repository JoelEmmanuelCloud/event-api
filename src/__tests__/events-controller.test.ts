import { DeleteResult } from 'mongodb';
import { ExtendedRequest } from '../middleware/authenticateUser';
import { EventModel } from '../models/events';
import { Response } from 'express';
import { createEvent, getEvents, deleteEventsByDay, getEventById, deleteEventById  } from '../controllers/event-controller';

describe('Create Event', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should create a new event successfully!', async () => {
    const mockRequest = {
      body: {
        description: 'Test event description',
        dayOfWeek: 'Monday',
      },
      userId: 'mockUserId',
    } as ExtendedRequest;

    const mockResponse = {} as Response;

    const mockEventDocument = {
      description: mockRequest.body.description,
      dayOfWeek: mockRequest.body.dayOfWeek,
      userId: mockRequest.userId,
    };

    const saveSpy = jest.spyOn(EventModel.prototype, 'save').mockResolvedValueOnce(mockEventDocument);

    const createdEvent = await createEvent(mockRequest, mockResponse);

    expect(saveSpy).toHaveBeenCalledWith();

    expect(createdEvent.description).toEqual(mockEventDocument.description);
    expect(createdEvent.dayOfWeek).toEqual(mockEventDocument.dayOfWeek);
    expect(createdEvent.userId).toEqual(mockEventDocument.userId);

    saveSpy.mockRestore();
  });

  it('Should handle errors during event creation', async () => {
    const mockRequest = {
      body: {
        description: 'Test event description',
        dayOfWeek: 'Monday',
      },
      userId: 'mockUserId',
    } as ExtendedRequest;

    const mockResponse = {} as Response; 

    const saveSpy = jest.spyOn(EventModel.prototype, 'save').mockRejectedValueOnce(new Error('Mock error'));

    await expect(createEvent(mockRequest, mockResponse)).rejects.toThrow();

    saveSpy.mockRestore();
  });
});

describe('Get Events', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should retrieve events successfully!', async () => {
    const mockUserId = 'mockUserId';
    const mockRequest = {
      userId: mockUserId,
    } as ExtendedRequest;

    const mockResponse = {} as Response;

    const mockEventData = [
      {
        _id: 'event1',
        description: 'Event 1 description',
        dayOfWeek: 'Monday',
        userId: mockUserId,
      },
      {
        _id: 'event2',
        description: 'Event 2 description',
        dayOfWeek: 'Tuesday',
        userId: mockUserId,
      },
    ];

    const findSpy = jest.spyOn(EventModel, 'find').mockResolvedValueOnce(mockEventData);

    const retrievedEvents = await getEvents(mockRequest, mockResponse);

    expect(findSpy).toHaveBeenCalledWith({ userId: mockUserId });

    expect(retrievedEvents).toEqual([
      {
        _id: 'event1',
        description: 'Event 1 description',
        dayOfWeek: 'Monday',
        userId: mockUserId,
      },
      {
        _id: 'event2',
        description: 'Event 2 description',
        dayOfWeek: 'Tuesday',
        userId: mockUserId,
      },
    ]);

    findSpy.mockRestore();
  });

  it('Should handle errors during event retrieval', async () => {
    const mockUserId = 'mockUserId';
    const mockRequest = {
      userId: mockUserId,
    } as ExtendedRequest;

    const mockResponse = {} as Response;

    const findSpy = jest.spyOn(EventModel, 'find').mockRejectedValueOnce(new Error('Mock error'));

    await expect(getEvents(mockRequest, mockResponse)).rejects.toThrow();

    findSpy.mockRestore();
  });
});

describe('Get Event by ID', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should retrieve a specific event successfully!', async () => {
    const mockUserId = 'mockUserId';
    const mockEventId = 'mockEventId';

    const mockRequest = {
      userId: mockUserId,
      params: { eventId: mockEventId },
    } as unknown as ExtendedRequest;

    const mockResponse = {} as Response;

    const mockEventData = {
      _id: mockEventId,
      description: 'Mock event description',
      dayOfWeek: 'Monday',
      userId: mockUserId,
    };

    const findOneSpy = jest.spyOn(EventModel, 'findOne').mockResolvedValueOnce(mockEventData);

    const retrievedEvent = await getEventById(mockRequest, mockResponse);

    expect(findOneSpy).toHaveBeenCalledWith({ _id: mockEventId, userId: mockUserId });

    expect(retrievedEvent).toEqual(mockEventData);

    findOneSpy.mockRestore();
  });

  it('Should handle errors during event retrieval by ID', async () => {
    const mockUserId = 'mockUserId';
    const mockEventId = 'mockEventId';

    const mockRequest = {
      userId: mockUserId,
      params: { eventId: mockEventId },
    } as unknown as ExtendedRequest;

    const mockResponse = {} as Response;

    const findOneSpy = jest.spyOn(EventModel, 'findOne').mockRejectedValueOnce(new Error('Mock error'));

    await expect(getEventById(mockRequest, mockResponse)).rejects.toThrow();

    findOneSpy.mockRestore();
  });

  it('Should handle "event not found" scenario', async () => {
    const mockUserId = 'mockUserId';
    const mockEventId = 'nonExistentEventId';

    const mockRequest = {
      userId: mockUserId,
      params: { eventId: mockEventId },
    } as unknown as ExtendedRequest;

    const mockResponse = {} as Response;

    const findOneSpy = jest.spyOn(EventModel, 'findOne').mockResolvedValueOnce(null);

    const retrievedEvent = await getEventById(mockRequest, mockResponse);

    expect(findOneSpy).toHaveBeenCalledWith({ _id: mockEventId, userId: mockUserId });

    expect(retrievedEvent).toBeNull();

    findOneSpy.mockRestore();
  });
});


describe('Delete Event by ID', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should delete a specific event successfully!', async () => {
    const mockUserId = 'mockUserId';
    const mockEventId = 'mockEventId';

    const mockRequest = {
      userId: mockUserId,
      params: { eventId: mockEventId },
    } as unknown as ExtendedRequest;

    const mockResponse = {} as Response;

    const deleteSpy = jest.spyOn(EventModel, 'findOneAndDelete').mockResolvedValueOnce({
      _id: mockEventId,
      description: 'Mock event description',
      dayOfWeek: 'Monday',
      userId: mockUserId,
    });

    const result = await deleteEventById(mockRequest, mockResponse);

    expect(deleteSpy).toHaveBeenCalledWith({ _id: mockEventId, userId: mockUserId });

    expect(result).toEqual({
      message: `Event with ID ${mockEventId} has been deleted successfully.`,
    });

    deleteSpy.mockRestore();
  });

  it('Should handle "event not found" scenario', async () => {
    const mockUserId = 'mockUserId';
    const mockEventId = 'nonExistentEventId';

    const mockRequest = {
      userId: mockUserId,
      params: { eventId: mockEventId },
    } as unknown as ExtendedRequest;

    const mockResponse = {} as Response;

    const deleteSpy = jest.spyOn(EventModel, 'findOneAndDelete').mockResolvedValueOnce(null);

    const result = await deleteEventById(mockRequest, mockResponse);

    expect(deleteSpy).toHaveBeenCalledWith({ _id: mockEventId, userId: mockUserId });

    expect(result).toEqual({
      message: `No event with ID ${mockEventId} found for the signed-in user.`,
    });

    deleteSpy.mockRestore();
  });

  it('Should handle errors during event deletion by ID', async () => {
    const mockUserId = 'mockUserId';
    const mockEventId = 'mockEventId';

    const mockRequest = {
      userId: mockUserId,
      params: { eventId: mockEventId },
    } as unknown as ExtendedRequest;

    const mockResponse = {} as Response;

    const deleteSpy = jest.spyOn(EventModel, 'findOneAndDelete').mockRejectedValueOnce(new Error('Mock error'));

    await expect(deleteEventById(mockRequest, mockResponse)).rejects.toThrow();

    deleteSpy.mockRestore();
  });
});



describe('Delete Events by Day', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should delete events for a specific day successfully!', async () => {
    const mockUserId = 'mockUserId';
    const mockDayOfWeek = 'Monday';

    const mockRequest = {
      userId: mockUserId,
      params: { dayOfWeek: mockDayOfWeek },
    } as unknown as ExtendedRequest;

    const mockResponse = {} as Response;

    const deletedEvents: DeleteResult = {
      acknowledged: true,
      deletedCount: 2,
    };

    const deleteManySpy = jest.spyOn(EventModel, 'deleteMany').mockResolvedValueOnce(deletedEvents);

    const result = await deleteEventsByDay(mockRequest, mockResponse);

    expect(deleteManySpy).toHaveBeenCalledWith({ userId: mockUserId, dayOfWeek: mockDayOfWeek });

    expect(result).toEqual({
      message: `Events for ${mockDayOfWeek} have been deleted successfully.`,
    });

    deleteManySpy.mockRestore();
  });

  it('Should handle "no events found" scenario', async () => {
    const mockUserId = 'mockUserId';
    const mockDayOfWeek = 'Saturday';

    const mockRequest = {
      userId: mockUserId,
      params: { dayOfWeek: mockDayOfWeek },
    } as unknown as ExtendedRequest;

    const mockResponse = {} as Response;

    const deletedEvents: DeleteResult = {
      acknowledged: true,
      deletedCount: 0,
    };

    const deleteManySpy = jest.spyOn(EventModel, 'deleteMany').mockResolvedValueOnce(deletedEvents);

    const result = await deleteEventsByDay(mockRequest, mockResponse);

    expect(deleteManySpy).toHaveBeenCalledWith({ userId: mockUserId, dayOfWeek: mockDayOfWeek });

    expect(result).toEqual({
      message: `No events found for ${mockDayOfWeek}.`,
    });

    deleteManySpy.mockRestore();
  });

  it('Should handle errors during event deletion by day', async () => {
    const mockUserId = 'mockUserId';
    const mockDayOfWeek = 'Wednesday';

    const mockRequest = {
      userId: mockUserId,
      params: { dayOfWeek: mockDayOfWeek },
    } as unknown as ExtendedRequest;

    const mockResponse = {} as Response;

    const deleteManySpy = jest.spyOn(EventModel, 'deleteMany').mockRejectedValueOnce(new Error('Mock error'));

    await expect(deleteEventsByDay(mockRequest, mockResponse)).rejects.toThrow();

    deleteManySpy.mockRestore();
  });
});
