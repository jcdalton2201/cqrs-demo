import { RabbitMq } from "../databases/rabbitmq.js"

export class OrderEvents {
    constructor() {
        this.rabbitMq = new RabbitMq();
    }
    publishOrderCreated(order) {
        const channel = this.rabbitMq.channel;
        const event = {
            type: 'order.created',
            data: order
        }
        channel.sendToQueue('order',Buffer.from(JSON.stringify(event)));
        // channel.publish(
        //     'cqrs-exchange',    // name of an exchange you’ll use 
        //     'order.created',     // routing key
        //     Buffer.from(JSON.stringify(event))
        // );
    }
    async  publishOrderUpdated(order) {
        const channel = this.rabbitMq.channel;
        const event = {
          type: 'order.updated',
          data: order
        };
        channel.sendToQueue('order',Buffer.from(JSON.stringify(event)));
      }
}