import * as amqp from 'amqplib';
import * as events from 'events';

class MessagingService extends events.EventEmitter {

    private readConnection;
    private writeConnection;
    private logging;

    constructor(private amqpUrl: String) {

        super();
        this.init();
    }

    public async init() {

        this.readConnection = await amqp.connect(this.amqpUrl);
        this.writeConnection = await amqp.connect(this.amqpUrl);
        this.emit('ready')
    }

    async sendMessage(message: any, exchangeName: String, routingKey: String) {

        if (this.logging) {


            console.log('\n------------------------------\n');
            console.log(`Sending to ${exchangeName}:${routingKey}`);
        }

        const channel = await this.writeConnection.createChannel();
        await channel.publish(exchangeName, routingKey, new Buffer(JSON.stringify(message)));
    }

    async subscribeToQueue(queueName, subscriber) {

        const channel = await this.writeConnection.createChannel();
        channel.consume(queueName, (message) => {

            if (this.logging) {

                const payload = JSON.parse(message.content.toString());
                console.log(`Got message at queue ${queueName} from ${message.fields.exchange} with routing key ${message.fields.routingKey}`);
                console.log(payload);
            }
            subscriber(channel, message);
        });
    }

    public setLogging(enabled: boolean) {

        this.logging = enabled;
    }
}

export default new MessagingService('amqp://qgoudwsq:vylnIAdpecjvnlHBBaq7yREurJXzIWX1@duckbill.rmq.cloudamqp.com/qgoudwsq');