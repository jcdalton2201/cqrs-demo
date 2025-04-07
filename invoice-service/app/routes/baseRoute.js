import { Logs } from '../util/log.js';
import AuthUtil from '../util/authUtil.js';
import { PostgresUtils } from '../databases/postgres-utils.js';

export class BaseRoute {
    constructor(server) {
        this.logs = new Logs();
        this.bindMethods([
            'createGets',
            'createPost',
            'createPuts',
            'createDel',
        ]);
        this.authUtil = new AuthUtil();
        this.server = server;
        this.baseRoute = '/invoice-service';
        
        this.pg = new PostgresUtils();

    }
    createRoutes() {
        this.createGets();
        this.createPost();
        this.createPuts();
        this.createDel();
    }
    bindMethod(method) {
        this[method] = this[method].bind(this);
    }
    bindMethods(methods) {
        methods.forEach((item) => this.bindMethod(item));
    }
    async updateRoute(req, res, route) {
        if (this.authUtil.isLoginIn(req)) {
            const data = await this.apix.putCall(
                `/${route}/${req.params.id}`,
                req.body,
            );
            res.json(data);
        } else {
            res.json(401);
        }
    }
    async createRoute(req, res, route) {
        try {
            const data = await this.apix.postCall(`/${route}`, req.body);
            res.json(data);
        } catch (error) {
            this.logs.error(error);
            res.json(500);
        }
    }
    async getRoute(req, res, route) {
        if (this.authUtil.isLoginIn(req)) {
            let ids = '';
            if (req.params.id) {
                ids = `/${req.params.id}`;
            }
            const data = await this.apix.getCall(`/${route}${ids}`, req.query);
            res.json(data);
        } else {
            res.json(401);
        }
    }
}
