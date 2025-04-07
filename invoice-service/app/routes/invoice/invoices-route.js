import { BaseRoute } from '../baseRoute.js';
export class InvoiceRoute extends BaseRoute {
    constructor(server) {
        super(server);
        this.bindMethods(['getInvoices']);
        this.createRoutes();
    }
    createGets() {
        this.server.get(`${this.baseRoute}/invoices`, this.getInvoices);
        this.server.get(`${this.baseRoute}/invoices/:id`, this.getInvoices);
    }
    createPost() {}
    createPuts() {}
    createDel() {}
    async getInvoices(req, res) {
        const userid = req.query.user_id;
        const month = req.query.month;
        const year = req.query.year;
        const results = await this.pg.getInvoice(userid,month,year);
        res.json(results);
    }
}