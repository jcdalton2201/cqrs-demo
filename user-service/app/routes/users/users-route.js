import { BaseRoute } from '../baseRoute.js';
export class UsersRoutes extends BaseRoute {
    constructor(server) {
        super(server);
        this.bindMethods(['getUsers','createUsers']);
        this.createRoutes();
    }
    createGets() {
        this.server.get(`${this.baseRoute}/users`, this.getUsers);
    }
    createPost() {
        this.server.post(`${this.baseRoute}/users`, this.createUsers);
    }
    createPuts() {}
    createDel() {}
    async createUsers(req, res) {
        const body = req.body;
        await this.pg.insert('demo.users',body);
        await this.userEvents.publishUserCreated(body);
        res.json(body);
    }
    async getUsers(req, res) {
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
            const results = await this.pg.retrieve('demo.users',query,limit,offset,order_by);
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