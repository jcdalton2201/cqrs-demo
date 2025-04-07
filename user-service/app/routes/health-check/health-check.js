import { BaseRoute } from '../baseRoute.js';
export class Healthcheck extends BaseRoute {
    constructor(server) {
        super(server);
        this.bindMethods(['healthcheck']);
        this.createRoutes();
    }
    createGets() {
        this.server.get(`${this.baseRoute}/healthcheck`, this.healthcheck);
    }
    createPost() {}
    createPuts() {}
    createDel() {}
    healthcheck(req, res, next) {
        res.json({ success: true, env: process.env.ENV });
        next();
    }
}