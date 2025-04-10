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
        await this.channel.assertQueue('account',{durable:true});
        this.listenForCustomerEvents();
        this.listenForOrderEvents();
        this.listenForAccountEvents();
    }
    async listenForAccountEvents(){
        await this.channel.consume('account',async (msg) =>{
            if (msg !== null) {
                console.log('Received:', msg.content.toString());
                await this.updateAccount(msg.content.toString());
                this.channel.ack(msg);
              } else {
                console.log('Consumer cancelled by server');
              }
        });
    }
    async listenForCustomerEvents(){
        await this.channel.consume('user',async (msg) =>{
            if (msg !== null) {
                console.log('Received:', msg.content.toString());
                await this.updateAccount(msg.content.toString());
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
    async updateAccount(msg){
        const message = JSON.parse(msg);
        switch (message.type) {
            case 'user.created':
                await this.pg.insert('demo.invoice_account',{
                    user_id:message.data.id,
                    email:message.data.email,
                    name:message.data.name
                });
                break;
            case 'account.created':
                await this.pg.updateInvoiceAccount('demo.invoice_account',message.data.user_id,{
                    shipping_address:{
                        address1:message.data.address1,
                        state:message.data.state,
                        city:message.data.city,
                        zip:message.data.zip,
                    }
                });
                break;
        
            default:
                break;
        }
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
            const user = await this.pg.retrieveInvoiceAccount('demo.invoice_account',{user_id: data.user_id});
            console.log(user);
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
                    shipping_address: `${user[0].shipping_address.address1}
${user[0].shipping_address.city}, ${user[0].shipping_address.state}
${user[0].shipping_address.zip}`,
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