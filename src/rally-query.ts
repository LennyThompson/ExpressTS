import * as lodash from "lodash";

export const COLON_SEPARATOR: string = "%3A";          // ':'
export const SEMI_COLON_SEPARATOR: string = "%3B";     // ';'
export const COMMA_SEPARATOR: string = "%2C";          // ','
export const OPEN_BRACKET_SEPARATOR: string = "%5B";   // '['
export const CLOSE_BRACKET_SEPARATOR: string = "%5D";  // ']'
export const SPACE_SEPARATOR: string = "%20";          // ' '
export const FORWARD_SLASH_SEPARATOR: string = "%2F";  // '/'

export interface RallyRelease
{
    OID: number;
}

export class RallyReleaseImpl implements RallyRelease
{
    OID: number;

    constructor()
    {
        this.OID = 0;
    }
}

export interface RallyQuery
{
    TypeDefOid: number;
    ScheduleState: string[];
    DirectChildrenCount: number;
    Release: RallyRelease;

    buildQueryString(): string;
}

export class RallyQueryImpl implements RallyQuery
{
    TypeDefOid: number;
    ScheduleState: string[];
    DirectChildrenCount: number;
    Release: RallyRelease;
    constructor()
    {
        this.ScheduleState = [];
        this.DirectChildrenCount = 0;
        this.Release = new RallyReleaseImpl();
    }

    public buildQueryString(): string
    {
        let strQuery = "((TypeDefOid = " + this.TypeDefOid + ") AND ";
        strQuery += "(" + lodash(lodash(this.ScheduleState).map((state) => "ScheduleState = %22" + state + "%22").value()).join(" OR ") + ")";
        strQuery += " AND (";
        strQuery += " DirectChildrenCount = " + this.DirectChildrenCount;
        strQuery += " OR";
        strQuery += " Release = " + this.Release.OID + "))";
        strQuery = strQuery.replace(/\s/g, SPACE_SEPARATOR);
        return strQuery;
    }
}

export interface RallyFetchBase
{
    initiator: string;      // %3A (':')
    separator: string;      // %2C (','), %3B (';")
    open: string;           // %5B {']')
    close: string;          // %5D {']')
}

export interface RallyIssuesDiscussionFetch extends RallyFetchBase
{
    summary: boolean
}

export interface RallyTasksFetch extends RallyFetchBase
{
    summary: boolean;
    State: boolean;
    ToDo: boolean;
    Owner: boolean;
    Blocked: boolean;

    hasFetchString: boolean;

    buildFetchString(): string;
}

export interface RallyDefectsFetch extends RallyTasksFetch
{
}

export class RallyTasksFetchImpl implements RallyTasksFetch
{
    summary: boolean;
    State: boolean;
    ToDo: boolean;
    Owner: boolean;
    Blocked: boolean;
    initiator: string;
    separator: string;
    open: string;
    close: string;
    constructor(initiator: string, separator: string)
    {
        this.initiator = initiator;
        this.separator = separator;
        this.open = OPEN_BRACKET_SEPARATOR;
        this.close = CLOSE_BRACKET_SEPARATOR;
    }

    get hasFetchString(): boolean
    {
        return this.summary ? true : false;
    }

    public buildFetchString(): string
    {
        // Tasks%3Asummary%5BState%3BToDo%3BOwner%3BBlocked%5D
        if(this.summary)
        {
            let strFetch: string = "Tasks" + this.initiator + "summary" + this.open;
            let listFetchs: string[] = [];
            if(this.State)
            {
                listFetchs.push("State");
            }
            if(this.ToDo)
            {
                listFetchs.push("ToDo");
            }
            if(this.Owner)
            {
                listFetchs.push("Owner");
            }
            if(this.Blocked)
            {
                listFetchs.push("Blocked");
            }
            strFetch += lodash(listFetchs).join(this.separator);
            strFetch += this.close;
            return strFetch;

        }
    }
}

export interface RallyIssueFetch extends RallyFetchBase
{
    ScheduleState: boolean;
    Blocked: boolean;
    Ready: boolean;
    ObjectID: boolean;
    Workspace: boolean;
    VersionId: boolean;
    RevisionHistory: boolean;
    CreationDate: boolean;
    Owner: boolean;
    FormattedID: boolean;
    BlockedReason: boolean;
    Name: boolean;
    Tags: boolean;
    DisplayColor: boolean;
    Project: boolean;
    Discussion: RallyIssuesDiscussionFetch;
    LatestDiscussionAgeInMinutes: boolean;
    Tasks: RallyTasksFetch;
    TaskStatus: boolean;
    Defects: RallyDefectsFetch;
    DefectStatus: boolean;
    C_DefectSeverity: boolean;
    C_DefectImpact: boolean;
    DragAndDropRank: boolean;
    otherFields: string[];

    buildFetchString(): string;
}

export class RallyIssueFetchImpl implements RallyIssueFetch
{
    ScheduleState: boolean;
    Blocked: boolean;
    Ready: boolean;
    ObjectID: boolean;
    Workspace: boolean;
    VersionId: boolean;
    RevisionHistory: boolean;
    CreationDate: boolean;
    Owner: boolean;
    FormattedID: boolean;
    BlockedReason: boolean;
    Name: boolean;
    Tags: boolean;
    DisplayColor: boolean;
    Project: boolean;
    Discussion: RallyIssuesDiscussionFetch;
    LatestDiscussionAgeInMinutes: boolean;
    Tasks: RallyTasksFetch;
    TaskStatus: boolean;
    Defects: RallyDefectsFetch;
    DefectStatus: boolean;
    C_DefectSeverity: boolean;
    C_DefectImpact: boolean;
    DragAndDropRank: boolean;
    otherFields: string[];
    initiator: string;
    separator: string;
    close: string;
    open: string;

    constructor(separator: string)
    {
        this.separator = separator;
        this.open = OPEN_BRACKET_SEPARATOR;
        this.close = CLOSE_BRACKET_SEPARATOR;
        this.initiator = COLON_SEPARATOR;
        this.Tasks = new RallyTasksFetchImpl(COLON_SEPARATOR, SEMI_COLON_SEPARATOR);
        this.Defects = new RallyTasksFetchImpl(COLON_SEPARATOR, SEMI_COLON_SEPARATOR);
    }

    public buildFetchString(): string
    {
        let listFetchFields: string[] = [];
        if(this.ScheduleState)
        {
            listFetchFields.push("ScheduleState");
        }

        if(this.Blocked)
        {
            listFetchFields.push("Blocked");
        }

        if(this.Ready)
        {
            listFetchFields.push("Ready");
        }
        if(this.ObjectID)
        {
            listFetchFields.push("ObjectID");
        }
        if(this.Workspace)
        {
            listFetchFields.push("Workspace");
        }
        if(this.VersionId)
        {
            listFetchFields.push("VersionId");
        }
        if(this.RevisionHistory)
        {
            listFetchFields.push("RevisionHistory");
        }
        if(this.CreationDate)
        {
            listFetchFields.push("CreationDate");
        }
        if(this.Owner)
        {
            listFetchFields.push("Owner");
        }
        if(this.FormattedID)
        {
            listFetchFields.push("FormattedID");
        }
        if(this.BlockedReason)
        {
            listFetchFields.push("BlockedReason");
        }
        if(this.Name)
        {
            listFetchFields.push("Name");
        }
        if(this.Tags)
        {
            listFetchFields.push("Tags");
        }
        if(this.DisplayColor)
        {
            listFetchFields.push("DisplayColor");
        }
        if(this.Project)
        {
            listFetchFields.push("Project");
        }
        if(this.Discussion)
        {
            let strDiscussion: string = "Discussion";
            strDiscussion += this.Discussion.initiator;
            if(this.Discussion.summary)
            {
                strDiscussion += "summary";
            }

            listFetchFields.push(strDiscussion);
        }
        if(this.LatestDiscussionAgeInMinutes)
        {
            listFetchFields.push("LatestDiscussionAgeInMinutes");
        }
        if(this.Tasks.hasFetchString)
        {
            listFetchFields.push(this.Tasks.buildFetchString());
        }
        if(this.TaskStatus)
        {
            listFetchFields.push("TaskStatus");
        }
        if(this.Defects.hasFetchString)
        {
            listFetchFields.push(this.Defects.buildFetchString());
        }
        if(this.DefectStatus)
        {
            listFetchFields.push("DefectStatus");
        }
        if(this.C_DefectSeverity)
        {
            listFetchFields.push("C_DefectSeverity");
        }
        if(this.C_DefectImpact)
        {
            listFetchFields.push("C_DefectImpact");
        }
        if(this.DragAndDropRank)
        {
            listFetchFields.push("DragAndDropRank");
        }

        if(this.otherFields && this.otherFields.length > 0)
        {
            listFetchFields = lodash(listFetchFields).concat(this.otherFields).value();
        }

        return lodash(listFetchFields).join(this.separator);
    }
}

export interface RallyIssueRequest
{
    types: string[];
    start: number;
    pagesize: number;
    order: string;
    query: RallyQuery;
    fetch: RallyIssueFetch;
    includePermissions: boolean;
    compact: boolean;
    project: number;
    projectScopeUp: boolean;
    projectScopeDown: boolean;
    _slug: string[];

    buildRequestString(): string;
}

export class RallyIssueRequestImpl implements RallyIssueRequest
{
    types: string[];
    start: number;
    pagesize: number;
    order: string;
    query: RallyQuery;
    fetch: RallyIssueFetch;
    includePermissions: boolean;
    compact: boolean;
    project: number;
    projectScopeUp: boolean;
    projectScopeDown: boolean;
    _slug: string[];

    constructor()
    {
        this.types = [ "hierarchicalrequirement", "defect" ];
        this.start = 1;
        this.pagesize = 40;
        this.order = "DragAndDropRank%20ASC%2CObjectID";
        this.fetch = new RallyIssueFetchImpl(COLON_SEPARATOR);
        this.query = new RallyQueryImpl();
        this.includePermissions = true;
        this.compact = true;
        this.project = 42581744832;
        this.projectScopeUp = true;
        this.projectScopeDown = true;
        this._slug = ["custom", "96741607520_1"];
    }

    public buildRequestString(): string
    {
        let listRequests: string[] = [];
        listRequests.push("types=" + lodash(this.types).join(COMMA_SEPARATOR));
        listRequests.push("start=" + this.start);
        listRequests.push("pagesize=" + this.pagesize);
        listRequests.push("query=" + this.query.buildQueryString());
        listRequests.push("fetch=" + this.fetch.buildFetchString());
        listRequests.push("includePermissions=" + this.includePermissions);
        listRequests.push("compact=" + this.compact);
        listRequests.push("project=" + FORWARD_SLASH_SEPARATOR + "project" + FORWARD_SLASH_SEPARATOR + this.project);
        listRequests.push("projectScopeUp=" + this.projectScopeUp);
        listRequests.push("projectScopeDown=" + this.projectScopeDown);
        listRequests.push("_slug=" + FORWARD_SLASH_SEPARATOR + lodash(this._slug).join(FORWARD_SLASH_SEPARATOR));

        return lodash(listRequests).join("&");
    }
}


