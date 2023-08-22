import { ExtendedRequest } from '../middleware/authenticateUser';
import { EventModel } from '../models/events';
import { Response } from 'express';
import { createEvent, getEvents, deleteEventsByDay  } from '../controllers/event-controller';

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

