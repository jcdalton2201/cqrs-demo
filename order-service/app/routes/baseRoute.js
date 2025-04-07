import { Logs } from '../util/log.js';
import { PostgresUtils } from '../databases/postgres-utils.js';
import { OrderEvents } from '../event/OrderEvents.js';

export class BaseRoute {
    constructor(server) {
        this.logs = new Logs();
        this.bindMethods([
            'createGets',
            'createPost',
            'createPuts',
            'createDel',
        ]);

        this.server = server;
        this.baseRoute = '/order-service';
        this.pg = new PostgresUtils();
        this.orderEvents = new OrderEvents();
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
}