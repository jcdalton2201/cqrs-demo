import amqp from 'amqplib';

export class RabbitMq {
    constructor() {
        this.getChannel();    
    }
    async getChannel(){
        const connection = await amqp.connect('amqp://cqrs:cqrs@localhost');
        this.channel = await connection.createChannel();
    }
}