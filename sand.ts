
import MessagingService from './server/api/services/messaging.service';
import * as uuid from 'uuid/v4';

MessagingService.on('ready', () => {

    MessagingService.sendMessage({
        entities: [
            {
                type: 'organization',
                id: uuid(),
                description: 'some world things',
                name: 'Hello cool!',
                time: Date.now()
            }
        ]
    }, 'search', 'search.create');
});


