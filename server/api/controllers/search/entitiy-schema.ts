import eventSchema from "./event-schema";
import campaignSchema from "./campaign-schema";
import organizationSchema from "./organization-schema";

export default {
    id: 'identity',
    type: 'object',
    properties: {
        entities: {
            type: 'array',
            items: {
                anyOf: [
                    eventSchema,
                    campaignSchema,
                    organizationSchema
                ],
                minItems: 1
            }
        }
    },
    required: ['entities']
}