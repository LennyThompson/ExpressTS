"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var express = require("express");
var logger = require("morgan");
var path = require("path");
var errorHandler = require("errorhandler");
var nodeSassMiddleware = require("node-sass-middleware");
var index_1 = require("./routes/index");
var api_1 = require("./src/api");
var Server = (function () {
    function Server(config) {
        //create expressjs application
        this._appServer = express();
        this._appServer.set("port", config.port);
        //configure application
        this.config();
        //add routes
        this.routes();
        //add api
        this.api();
    }
    Server.bootstrap = function (config) {
        console.log("configuration: ", JSON.stringify(config));
        return new Server(config);
    };
    Object.defineProperty(Server.prototype, "app", {
        get: function () {
            return this._appServer;
        },
        enumerable: true,
        configurable: true
    });
    Server.prototype.api = function () {
        console.log("create api route");
        api_1.ApiRouter.registerApi(this._appServer);
    };
    Server.prototype.config = function () {
        //configure pug
        this._appServer.set("views", path.join(__dirname, "../views"));
        this._appServer.set("view engine", "pug");
        //mount logger
        this._appServer.use(logger("dev"));
        //mount json form parser
        this._appServer.use(bodyParser.json());
        //mount query string parser
        this._appServer.use(bodyParser.urlencoded({
            extended: true
        }));
        console.log("public path: ", path.join(__dirname, "../public"));
        //mount cookie parker
        this._appServer.use(cookieParser("SECRET_GOES_HERE"));
        this._appServer.use(nodeSassMiddleware({
            src: path.join(__dirname, "../public"),
            dest: path.join(__dirname, "../public"),
            response: true
        }));
        //add static paths
        this._appServer.use(express.static(path.join(__dirname, "/public")));
        // catch 404 and forward to error handler
        this._appServer.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
        //error handling
        this._appServer.use(errorHandler());
    };
    Server.prototype.routes = function () {
        var router;
        router = express.Router();
        //IndexRoute
        index_1.IndexRoute.create(router);
        //use router middleware
        this._appServer.use(router);
    };
    return Server;
}());
exports.Server = Server;
