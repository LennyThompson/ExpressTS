import {NextFunction, Request, Response, Router} from "express";
import {BaseRoute} from "./baseRoute";

export class IndexRoute extends BaseRoute
{

    public static create(router: Router)
    {
        //log
        console.log("[IndexRoute::create] Creating index route.");

        //add home page route
        router.get("/", (req: Request, res: Response, next: NextFunction) =>
        {
            new IndexRoute().index(req, res, next);
        });
    }

    constructor()
    {
        super();
    }

    public index(req: Request, res: Response, next: NextFunction)
    {
        //set custom title
        this.title = "Home | Update Incidents";

        //set message
        let options: Object = {
            "message": "Update Rally from Service Now incidents"
        };

        //render template
        this.render(req, res, "index", options);
    }
}