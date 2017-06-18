"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseRoute = (function () {
    function BaseRoute() {
        //initialize variables
        this.title = "Update Incidents";
        this.scripts = [];
    }
    BaseRoute.prototype.addScript = function (src) {
        this.scripts.push(src);
        return this;
    };
    BaseRoute.prototype.render = function (req, res, view, options) {
        //add constants
        res.locals.BASE_URL = "/";
        //add scripts
        res.locals.scripts = this.scripts;
        //add title
        res.locals.title = this.title;
        //render view
        res.render(view, options);
    };
    return BaseRoute;
}());
exports.BaseRoute = BaseRoute;
