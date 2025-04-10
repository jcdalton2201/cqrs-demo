import { RabbitMq } from "../databases/rabbitmq.js"

export class UserEvents {
    constructor() {
        this.rabbitMq = new RabbitMq();
    }
    publishUserCreated(user) {
        const channel = this.rabbitMq.channel;
        const event = {
            type: 'user.created',
            data: user
        }
        channel.sendToQueue('user',Buffer.from(JSON.stringify(event)));
        // channel.publish(
        //     'cqrs-exchange',    // name of an exchange you’ll use 
        //     'user.created',     // routing key
        //     Buffer.from(JSON.stringify(event))
        // );
    }
    async  publishUserUpdated(user) {
        const channel = this.rabbitMq.channel;
        const event = {
          type: 'user.updated',
          data: user
        };
        channel.sendToQueue('user',Buffer.from(JSON.stringify(event)));
      }
    async publishAccountCreated(account){
        const channel = this.rabbitMq.channel;
        const event = {
          type: 'account.created',
          data: account
        };
        channel.sendToQueue('account',Buffer.from(JSON.stringify(event)));
    }
}