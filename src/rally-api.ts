import * as express from "express";
import * as when from "when";
import * as path from "path";
import * as superAgent from "superagent";

const RALLY_URL: string = "https://rally1.rallydev.com";
const RALLY_WEB_SERVICE_PATH: string = "/slm/webservice/v2.0";
const RALLY_AUTH_PATH: string = "/security/authorize";
const RALLY_TASK_PATH: string = "/task";

interface SecurityToken {
    _rallyAPIMajor: number;
    _rallyAPIMinor: number;
    Errors: string[];
    Warnings: string[];
    SecurityToken: string;
}

export class RallyApi
{
    private _securityToken: SecurityToken;
    private _agent: any;

    constructor()
    {

    }

    public static registerApi(router: express.Router): void
    {
        let apiRallyRouter: RallyApi = new RallyApi();
        apiRallyRouter.create(router);
    }

    create(router: express.Router)
    {
        router.get("/rally",
            (request, response, next) =>
            {
                this.getRallyItems()
                    .then(
                        items => response.send(items)
                    )
                    .catch(error => response.send(error));
            }
        );
    }

    public getRallyItems()
    {
        return when.promise<any>(
            (resolve, reject) =>
            {
                let strPath = RALLY_URL + RALLY_WEB_SERVICE_PATH + RALLY_TASK_PATH;
                this.getSecurityToken()
                    .then(
                        () => {
                            console.log("token: ", this._securityToken.SecurityToken);
                            this._agent.get(strPath)
                                .query({ key: this._securityToken.SecurityToken })
                                .end(
                                    (error: any, response: any) =>
                                    {
                                        if(error)
                                        {
                                            console.log("error: ", JSON.stringify(error));
                                            reject(error);
                                        }
                                        else
                                        {
                                            console.log("items: ", JSON.stringify(response.body));
                                            resolve(response.body);
                                        }
                                    }
                                )
                        }
                    )
                    .catch(
                        error =>
                        {
                            console.log("error: ", JSON.stringify(error));
                            reject(error);
                        }
                    );
            }
        );

    }

    private getSecurityToken(): when.Promise<SecurityToken>
    {
        return when.promise<SecurityToken>(
            (resolve, reject) =>
            {
                if(this._securityToken)
                {
                    resolve(this._securityToken);
                }
                else
                {
                    let strPath = RALLY_URL + RALLY_WEB_SERVICE_PATH + RALLY_AUTH_PATH;
                    console.log("rally path: ", strPath);
                    this._agent = superAgent.agent();
                    this._agent.get(strPath)
                        .auth("marc.thompson@tattsgroup.com", "_Geheim01Secret")
                        .end(
                            (error: any, response: any) =>
                            {
                                if(error)
                                {
                                    console.log(JSON.stringify(error));
                                    reject(error);
                                }
                                else
                                {
                                    console.log(response.body);
                                    this._securityToken = response.body.OperationResult;
                                    resolve(this._securityToken);
                                }
                            }
                        );
                }
            }
        );
    }
}