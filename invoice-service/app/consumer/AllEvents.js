import { PostgresUtils } from "../databases/postgres-utils.js";
import { RabbitMq } from "../databases/rabbitmq.js";

export class AllEvents {
    constructor() {
        this.rabbitMq = new RabbitMq();
        this.pg = new PostgresUtils();
        this.initQueues();
        
    }

    async initQueues(){
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.channel = this.rabbitMq.channel;
        await this.channel.assertQueue('order',{durable:true});
        await this.channel.assertQueue('user',{durable:true});
        this.listenForCustomerEvents();
        this.listenForOrderEvents();
    }
    async listenForCustomerEvents(){
        await this.channel.consume('user',(msg) =>{
            if (msg !== null) {
                console.log('Received:', msg.content.toString());
                this.channel.ack(msg);
              } else {
                console.log('Consumer cancelled by server');
              }
        });

    }
    async listenForOrderEvents(){
        await this.channel.consume('order',async (msg) =>{
            if (msg !== null) {
                console.log('Received:', msg.content.toString());
                await this.updateInvoices(msg.content.toString());
                this.channel.ack(msg);
              } else {
                console.log('Consumer cancelled by server');
              }
        });
    }
    async updateInvoices(msg){
        const message = JSON.parse(msg);
        if(message.type === 'order.created'){
            const data = message.data;

            if(!data.created_at){
                data.created_at = new Date();
            } else {
                data.created_at = new Date(data.created_at);
            }
            //get users
            const user = await this.pg.retrieve('demo.users',{id: data.user_id});
            console.log(data.user_id, data.created_at.getMonth() +1,data.created_at.getFullYear());
            //check for invoice
            const invoice = await this.pg.getInvoice(data.user_id, data.created_at.getMonth() +1,data.created_at.getFullYear());
            const myUser = {
                description: data.description,
                amount: data.amount,
                purchase_dt: data.created_at
            };
            if(invoice.length < 1){
                const results = await this.pg.insert('demo.invoices',{
                    user_id: data.user_id,
                    invoice_dt:data.created_at,
                    orders:JSON.stringify([myUser]),
                    total: data.amount,
                    email:user[0].email
                });
            }else {
                const item = invoice[0];
                const newOrders = [...item.orders, myUser];
                const results = await this.pg.updateOne('demo.invoices',item.id,{
                    orders:JSON.stringify(newOrders),
                    total: parseFloat(item.total) + parseFloat(data.amount)
                });
            }
        }
    }
}