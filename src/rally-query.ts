import * as lodash from "lodash";

const COLON_SEPARATOR: string = "%3A";          // ':'
const SEMI_COLON_SEPARATOR: string = "%3B";     // ';'
const COMMA_SEPARATOR: string = "%2C";          // ','
const BRACKET_SEPARATOR: string = "%5D";        // ']'
const SPACE_SEPARATOR: string = "%20";          // ' '

export interface RallyRelease
{
    OID: number;
}

export class RallyReleaseImpl implements RallyRelease
{
    OID: number;

    constructor()
    {

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
        this.Release = new RallyReleaseImpl();
    }

    public buildQueryString(): string
    {
        let strQuery = "(TypeDefOid = " + this.TypeDefOid + " AND ";
        strQuery += "(" + lodash(lodash(this.ScheduleState).map((state) => "ScheduleState = " + state).value()).join(" OR ") + ")";
        strQuery += " AND (";
        strQuery += " DirectChildrenCount = " + this.DirectChildrenCount;
        strQuery += " OR ";
        strQuery += " Release = " + this.Release.OID + "))";
        strQuery = strQuery.replace(/\s/g, SPACE_SEPARATOR);
        return strQuery;
    }
}

export interface RallyFetchBase
{
    initiator: string;      // %3A (':')
    separator: string;      // %2C (','), %3B (';")
    terminator: string;     // %5D {']')
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
}

export interface RallyDefectsFetch extends RallyTasksFetch
{
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
    terminator: string;

    constructor(separator: string, terminator: string, initiator: string)
    {
        this.separator = separator;
        this.terminator = terminator;
        this.initiator = initiator;
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
                strDiscussion += this.Discussion.separator;
            }

            listFetchFields.push(strDiscussion);
        }
        if(this.LatestDiscussionAgeInMinutes)
        {
            listFetchFields.push("LatestDiscussionAgeInMinutes");
        }
        if(this.Tasks)
        {
            let strTasks: string = "Tasks";
            strTasks += this.Tasks.initiator;
            if(this.Tasks.summary)
            {
                strTasks += "summary";
                strTasks += this.Tasks.separator;
            }

            if(this.Tasks.State)
            {
                strTasks += "State";
                strTasks += this.Tasks.separator;
            }

            if(this.Tasks.ToDo)
            {
                strTasks += "ToDo";
                strTasks += this.Tasks.separator;
            }

            if(this.Tasks.Owner)
            {
                strTasks += "Owner";
                strTasks += this.Tasks.separator;
            }

            if(this.Tasks.Blocked)
            {
                strTasks += "Blocked";
                strTasks += this.Tasks.separator;
            }
            listFetchFields.push(strTasks);
        }
        if(this.TaskStatus)
        {
            listFetchFields.push("TaskStatus");
        }
        if(this.Defects)
        {
            let strDefects: string = "Defects";
            strDefects += this.Defects.initiator;
            if(this.Defects.summary)
            {
                strDefects += "summary";
                strDefects += this.Defects.separator;
            }

            if(this.Defects.State)
            {
                strDefects += "State";
                strDefects += this.Defects.separator;
            }

            if(this.Defects.ToDo)
            {
                strDefects += "ToDo";
                strDefects += this.Defects.separator;
            }

            if(this.Defects.Owner)
            {
                strDefects += "Owner";
                strDefects += this.Defects.separator;
            }

            if(this.Defects.Blocked)
            {
                strDefects += "Blocked";
                strDefects += this.Defects.separator;
            }
            listFetchFields.push(strDefects);
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
        listFetchFields = lodash(listFetchFields).concat(this.otherFields).value();

        return lodash(listFetchFields).join(this.separator);
    }
}

export interface RallyIssueRequest
{
    types: string;
    start: number;
    pagesize: number;
    order: string;
    query: RallyQuery;
    fetch: RallyIssueFetch;
    includePermissions: boolean;
    compact: boolean;
    project: string;
    projectScopeUp: boolean;
    projectScopeDown: boolean;
    _slug: string;

    buildRequestString(): string;
}

export class RallyIssueRequestImpl implements RallyIssueRequest
{
    types: string;
    start: number;
    pagesize: number;
    order: string;
    query: RallyQuery;
    fetch: RallyIssueFetch;
    includePermissions: boolean;
    compact: boolean;
    project: string;
    projectScopeUp: boolean;
    projectScopeDown: boolean;
    _slug: string;

    constructor()
    {
        this.types = "hierarchicalrequirement%2Cdefect";
        this.start = 1;
        this.pagesize = 40;
        this.order = "DragAndDropRank%20ASC%2CObjectID";
        this.fetch = new RallyIssueFetchImpl(COLON_SEPARATOR, SEMI_COLON_SEPARATOR, BRACKET_SEPARATOR);
        this.query = new RallyQueryImpl();
        this.includePermissions = true;;
        this.compact = true;
        this.project = "%2Fproject%2F42581744832";
        this.projectScopeUp = true;
        this.projectScopeDown = true;
        this._slug = "";
    }

    public buildRequestString(): string
    {
        let listRequests: string[] = [];
        listRequests.push("types=" + this.types);
        listRequests.push("start=" + this.start);
        listRequests.push("pagesize=" + this.pagesize);
        listRequests.push("query=" + this.query.buildQueryString());
        listRequests.push("fetch=" + this.fetch.buildFetchString());
        listRequests.push("includePermissions=" + this.includePermissions);
        listRequests.push("compact=" + this.compact);
        listRequests.push("project=" + this.project);
        listRequests.push("projectScopeUp=" + this.projectScopeUp);
        listRequests.push("projectScopeDown=" + this.projectScopeDown);
        listRequests.push("_slug=" + this._slug);

        return lodash(listRequests).join("&");
    }
}


