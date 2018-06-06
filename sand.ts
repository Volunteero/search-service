
import MessagingService from './server/api/services/messaging.service';
import * as uuid from 'uuid/v4';

MessagingService.on('ready', () => {

    MessagingService.sendMessage({
        entities: [
            {
                id: uuid(),
                description: 'dsadasdasdqweqe12e12dsa',
                name: 'Hello world!',
                time: Date.now()
            }
        ]
    }, 'search', 'search.create');
});


