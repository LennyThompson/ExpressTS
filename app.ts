import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as errorHandler from "errorhandler";
import * as nodeSassMiddleware from "node-sass-middleware";

import {IndexRoute} from "./routes/index";
import { ApiRouter } from "./src/api";

export interface ServerConfig
{
    port: number;
}

export class Server
{

    private _appServer: express.Application;

    public static bootstrap(config: ServerConfig): Server
    {
        console.log("configuration: ", JSON.stringify(config));
        return new Server(config);
    }

    constructor(config: ServerConfig)
    {
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

    public get app(): express.Application
    {
        return this._appServer;
    }

    public api()
    {
        console.log("create api route");
        ApiRouter.registerApi(this._appServer);
    }

    public config()
    {
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
        this._appServer.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction)
        {
            err.status = 404;
            next(err);
        });

        //error handling
        this._appServer.use(errorHandler());
    }

    private routes()
    {
        let router: express.Router;
        router = express.Router();

        //IndexRoute
        IndexRoute.create(router);

        //use router middleware
        this._appServer.use(router);
    }

}