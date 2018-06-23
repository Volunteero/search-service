export default {
    id: 'campaign',
    type: 'object',
    properties:{
        name: { type: 'string' },
        description: { type: 'string' },
        id: { type: 'string' },
        influencePoints: { type: 'number' },
        organizationId: { type: 'string' },
    }
};