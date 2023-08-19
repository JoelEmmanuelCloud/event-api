import Joi from 'joi';

export const createEventSchema = Joi.object({
    description: Joi.string().required().max(255).label('Description'),
    dayOfWeek: Joi.string()
        .required()
        .valid(
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
        )
        .label('Day of Week'),
});
