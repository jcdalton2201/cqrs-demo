import { Logs } from '../util/log.js';
import { PostgresUtils } from '../databases/postgres-utils.js';
import { UserEvents } from '../../../user-service/app/event/userEvents.js';
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
        this.baseRoute = '/user-service';
        this.pg = new PostgresUtils();
        this.userEvents = new UserEvents();
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
