export default {
    id: 'organization',
    type: 'object',
    properties: {
        id: { type: 'string' },
        user_id: { type: 'string' },
        organization_name: { type: 'string' },
        organization_description: { type: 'string' },
        influencePoints: {
            type: 'array',
            items: {
                type: 'number'
            }
        },
        campaign_ids: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
    }
};