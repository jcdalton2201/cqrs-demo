export default class AuthUtil {
    constructor() {}
    async isLoginIn(req) {
        return req.isAuthenticated();
    }
    setUserToBody(req) {
        req.body.requester = req.session.passport.user.name;
        req.body.requesterEmail = req.session.passport.user.email;
        return req.body;
    }
}
