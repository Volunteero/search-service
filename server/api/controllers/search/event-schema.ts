export default {
    id: 'event',
    type: 'object',
    properties:{
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        start: { type: 'string' },
        end: { type: 'string' },
        location: { type: 'string' },
        category: { type: 'string' },
        organization_id: { type: 'string' },
        points: { type: 'number' },
        volunteers: { type: 'number' },
        available: { type: 'boolean' },
    }
};