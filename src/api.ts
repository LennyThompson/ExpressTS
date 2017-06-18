import * as express from "express";
import * as superAgent from "superagent";
import * as when from "when";

var xmlParser = require("superagent-xml2jsparser");

export class ApiRouter
{
    constructor()
    {

    }

    public static registerApi(app: express.Application): void
    {
        let router: express.Router = express.Router();
        let apiRouter: ApiRouter = new ApiRouter();
        //IndexRoute
        apiRouter.create(app, router);
    }

    create(app: express.Application, router: express.Router)
    {
        router.get("/",
            (request, response, next) =>
            {
                this.updateIncidents()
                    .then((json) =>
                        {
                            console.log("response: ", json);
                            response.send(json);
                        }
                    )
                    .catch((error) => response.json = error);
            }
        );

        //use router middleware
        app.use("/api", router);
    }

    updateIncidents(): when.Promise<any>
    {
        console.log("updateIncidents", xmlParser);
        return when.promise<any>(
            (resolve, reject) =>
            {
                superAgent.get("http://www.news.com.au/rss")
                    .accept("xml")
                    .buffer(true)
                    .parse(xmlParser)
                    .end(
                        (error, response) =>
                        {
                            if(error)
                            {
                                console.log("error", error);
                                reject(error);
                            }
                            else
                            {
                                console.log("rss response: ", JSON.stringify(response.body));
                                resolve(response.body);
                            }
                        }
                    );
            }
        );
    }
}