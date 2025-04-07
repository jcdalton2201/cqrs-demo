import { BaseRoute } from '../baseRoute.js';
export class OrdersRoutes extends BaseRoute {
    constructor(server) {
        super(server);
        this.bindMethods(['getOrders','createOrders']);
        this.createRoutes();
    }
    createGets() {
        this.server.get(`${this.baseRoute}/orders`, this.getOrders);
    }
    createPost() {
        this.server.post(`${this.baseRoute}/orders`, this.createOrders);
    }
    createPuts() {}
    createDel() {}
    async createOrders(req, res) {
        const body = req.body;
        await this.pg.insert('demo.orders',body);
        await this.orderEvents.publishOrderCreated(body);
        res.json(body);
    }
    async getOrders(req, res) {
        let query = {};
        let limit, offset, order_by;
        try {
            if(req.params.id){
                query.id = req.params.id;
            }
            if(req.query){
                if(req.query.limit){
                    limit = req.query.limit;
                    delete req.query.limit;
                }
                if(req.query.offset){
                    offset = req.query.offset;
                    delete req.query.offset;
                }
                if(req.query.order_by){
                    order_by = req.query.order_by;
                    delete req.query.order_by;
                }
                query = { ...query, ...req.query}
                
            }
            const results = await this.pg.retrieve('demo.orders',query,limit,offset,order_by);
            if(req.params.id){
                res.json(results[0]);
            } else {
                res.json(results);
            }
        } catch (error) {
            this.logs.error(error);
            res.json(500, error);
        }
    }
}