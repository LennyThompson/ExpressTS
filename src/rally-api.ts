import * as express from "express";
import * as when from "when";
import * as superAgent from "superagent";
import * as lodash from "lodash";
import {RallyIssueFetchImpl, RallyIssueRequest, RallyIssueRequestImpl, RallyQueryImpl} from "./rally-query";


const RALLY_URL: string = "https://rally1.rallydev.com";
const RALLY_WEB_SERVICE_PATH: string = "/slm/webservice/v2.0";
const RALLY_AUTH_PATH: string = "/security/authorize";
const RALLY_TASK_PATH: string = "/task";
const RALLY_ARTIFACT_PATH: string = "/artifact";

const RALLY_HIER_REQ_PATH: string = "/hierarchicalrequirement";
const ALLY_HIER_REQ_DEFECT_PATH: string = RALLY_HIER_REQ_PATH + "%2Cdefect";


const RALLY_PROD_BOARD_QUERY: string = "(((((TypeDefOid = 25364774197) AND (ScheduleState = \"Completed\")) AND (DirectChildrenCount = 0)) OR ((TypeDefOid = 25364774132) AND (ScheduleState = \"Completed\"))) AND (Release.OID = 90509950300))";
const RALLY_PROD_BOARD_FETCH: string[] = [
    "ScheduleState",
    "Blocked",
    "Ready",
    "ObjectID",
    "Workspace",
    "VersionId",
    "RevisionHistory",
    "CreationDate",
    "Owner",
    "FormattedID",
    "BlockedReason",
    "Name",
    "Tags",
    "DisplayColor",
    "Project",
    "Discussion%3Asummary",
    "LatestDiscussionAgeInMinutes",
    "Tasks%3Asummary%5BState%3BToDo%3BOwner%3BBlocked%5D",
    "TaskStatus",
    "Defects%3Asummary%5BState%3BOwner%5D",
    "DefectStatus",
    "C_DefectSeverity",
    "C_DefectImpact",
    "DragAndDropRank"
];

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
        router.get("/user_stories",
            (request, response, next) =>
            {
                this.getRallyUserStories()
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

    public getRallyUserStories()
    {
        return when.promise<any>(
            (resolve, reject) =>
            {
                let strPath = RALLY_URL + RALLY_WEB_SERVICE_PATH + RALLY_ARTIFACT_PATH;
                this.getSecurityToken()
                    .then(
                        () => {
                            console.log("token: ", this._securityToken.SecurityToken);
                            this._agent.get(strPath)
                                .query(this.buildRallyQuery().buildRequestString())
                                .end(
                                    (error: any, response: any) =>
                                    {
                                        console.log(JSON.stringify(this._agent.query));
                                        console.log(JSON.stringify(response));
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

    // public static serialiseRallyRequest(rallyRequest: RallyIssueQuery): string
    // {
    //     console.log("Rally request", JSON.stringify(rallyRequest));
    //     return "types=hierarchicalrequirement%2Cdefect&start=1&pagesize=15&order=DragAndDropRank%20ASC%2CObjectID&query=(((((TypeDefOid%20%3D%2025364774197)%20AND%20(ScheduleState%20%3D%20%22Backlog%22))%20AND%20(DirectChildrenCount%20%3D%200))%20OR%20((TypeDefOid%20%3D%2025364774132)%20AND%20(ScheduleState%20%3D%20%22Backlog%22)))%20AND%20(Release.OID%20%3D%2090509950300))&fetch=ScheduleState%2CBlocked%2CReady%2CScheduleStatePrefix%2CObjectID%2CWorkspace%2CVersionId%2CRevisionHistory%2CCreationDate%2COwner%2CFormattedID%2CBlockedReason%2CName%2CTags%2CDisplayColor%2CProject%2CDiscussion%3Asummary%2CLatestDiscussionAgeInMinutes%2CTasks%3Asummary%5BState%3BToDo%3BOwner%3BBlocked%5D%2CTaskStatus%2CDefects%3Asummary%5BState%3BOwner%5D%2CDefectStatus%2CC_DefectSeverity%2CC_DefectImpact%2CDragAndDropRank&includePermissions=true&compact=true&project=%2Fproject%2F42581744832&projectScopeUp=true&projectScopeDown=true&_slug=%2Fcustom%2F96741607520_1";
    // }
    //
    private buildRallyQuery(): RallyIssueRequest
    {
        let rallyQuery: RallyIssueRequest = new RallyIssueRequestImpl();
        console.log(JSON.stringify(rallyQuery.fetch));
        return rallyQuery;
    }
}
