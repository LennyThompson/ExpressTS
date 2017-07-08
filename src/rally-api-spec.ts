
import {RallyApi} from "./rally-api";
import { expect } from "chai";
import {
    OPEN_BRACKET_SEPARATOR,
    COLON_SEPARATOR,
    COMMA_SEPARATOR, RallyDefectsFetch,
    RallyIssueFetch, RallyIssueFetchImpl, RallyIssueRequest, RallyIssueRequestImpl, RallyQuery,
    RallyQueryImpl, RallyTasksFetch, SEMI_COLON_SEPARATOR, CLOSE_BRACKET_SEPARATOR
} from "./rally-query";

const RALLY_QUERY_STRING: string = "(TypeDefOid%20=%20undefined%20AND%20(ScheduleState%20=%20%22Backlog%22)%20AND%20(%20DirectChildrenCount%20=%200%20OR%20Release%20=%2090509950300))";
const RALLY_FETCH_STRING: string = "ScheduleState%2CBlocked%2CCreationDate%2COwner%2CName%2CProject";
const RALLY_COMPLETE_FETCH_STRING: string = "ScheduleState%2CBlocked%2CReady%2CObjectID%2CWorkspace%2CVersionId%2CRevisionHistory%2CCreationDate%2COwner%2CFormattedID%2CBlockedReason%2CName%2CTags%2CDisplayColor%2CProject%2CDiscussion%3Asummary%2CLatestDiscussionAgeInMinutes%2CTasks%3Asummary%3BState%3BToDo%3BOwner%3BBlocked%2CTaskStatus%2CDefects%3Asummary%3BState%3BToDo%3BOwner%3BBlocked%2CDefectStatus%2CC_DefectSeverity%2CC_DefectImpact%2CDragAndDropRank";

const RALLY_QUERY: string = "types=hierarchicalrequirement%2Cdefect" +
                            "&start=1" +
                            "&pagesize=20" +
                            "&order=DragAndDropRank%20ASC%2CObjectID" +
                            "&query=(((((TypeDefOid%20%3D%2025364774197)%20AND%20(ScheduleState%20%3D%20%22Backlog%22))%20AND%20(DirectChildrenCount%20%3D%200))%20OR%20((TypeDefOid%20%3D%2025364774132)%20AND%20(ScheduleState%20%3D%20%22Backlog%22)))%20AND%20(Release.OID%20%3D%2090509950300))" +
                            "&fetch=ScheduleState%2CBlocked%2CReady%2CScheduleStatePrefix%2CObjectID%2CWorkspace%2CVersionId%2CRevisionHistory%2CCreationDate%2COwner%2CFormattedID%2CBlockedReason%2CName%2CTags%2CDisplayColor%2CProject%2CDiscussion%3Asummary%2CLatestDiscussionAgeInMinutes%2CTasks%3Asummary%5BState%3BToDo%3BOwner%3BBlocked%5D%2CTaskStatus%2CDefects%3Asummary%5BState%3BOwner%5D%2CDefectStatus%2CC_DefectSeverity%2CC_DefectImpact%2CDragAndDropRank" +
                            "&includePermissions=true" +
                            "&compact=true" +
                            "&project=%2Fproject%2F42581744832" +
                            "&projectScopeUp=true" +
                            "&projectScopeDown=true" +
                            "&_slug=%2Fcustom%2F96741607520_1";

const RALLY_QUERY_CONFIG: RallyIssueRequest = new RallyIssueRequestImpl();
// {
//     types: "hierarchicalrequirement%2Cdefect",
//     start: 1,
//     pagesize: 20,
//     order: "DragAndDropRank%20ASC%2CObjectID",
//     query: "(((((TypeDefOid%20%3D%2025364774197)%20AND%20(ScheduleState%20%3D%20%22Backlog%22))%20AND%20(DirectChildrenCount%20%3D%200))%20OR%20((TypeDefOid%20%3D%2025364774132)%20AND%20(ScheduleState%20%3D%20%22Backlog%22)))%20AND%20(Release.OID%20%3D%2090509950300))",
//     fetch: "ScheduleState%2CBlocked%2CReady%2CScheduleStatePrefix%2CObjectID%2CWorkspace%2CVersionId%2CRevisionHistory%2CCreationDate%2COwner%2CFormattedID%2CBlockedReason%2CName%2CTags%2CDisplayColor%2CProject%2CDiscussion%3Asummary%2CLatestDiscussionAgeInMinutes%2CTasks%3Asummary%5BState%3BToDo%3BOwner%3BBlocked%5D%2CTaskStatus%2CDefects%3Asummary%5BState%3BOwner%5D%2CDefectStatus%2CC_DefectSeverity%2CC_DefectImpact%2CDragAndDropRank",
//     includePermissions: true,
//     compact: true,
//     project: "%2Fproject%2F42581744832",
//     projectScopeUp: true,
//     projectScopeDown: true,
//     _slug: "%2Fcustom%2F96741607520_1"
// };

describe("Test rally query serialisation", () =>
    {
        it("should build compatible rally query", () =>
        {
            let rallyQuery: RallyQuery = new RallyQueryImpl();
            rallyQuery.ScheduleState.push("Backlog");
            rallyQuery.Release.OID = 90509950300;
            expect(rallyQuery.buildQueryString()).to.equal(RALLY_QUERY_STRING);

        });

        it("should build a compatible rally fetch", () =>
        {
            let rallyFetch: RallyIssueFetch = new RallyIssueFetchImpl(COMMA_SEPARATOR);
            rallyFetch.ScheduleState = true;
            rallyFetch.CreationDate = true;
            rallyFetch.Name = true;
            rallyFetch.Owner = true;
            rallyFetch.Blocked = true;
            rallyFetch.Project = true;

            expect(rallyFetch.buildFetchString()).to.equal(RALLY_FETCH_STRING);
        });

        it("should build a complete rally fetch", () =>
        {
            let rallyFetch: RallyIssueFetch = new RallyIssueFetchImpl(COMMA_SEPARATOR);
            rallyFetch.ScheduleState = true;
            rallyFetch.Blocked = true;
            rallyFetch.Ready = true;
            rallyFetch.ObjectID = true;
            rallyFetch.Workspace = true;
            rallyFetch.VersionId = true;
            rallyFetch.RevisionHistory = true;
            rallyFetch.CreationDate = true;
            rallyFetch.Owner = true;
            rallyFetch.FormattedID = true;
            rallyFetch.BlockedReason = true;
            rallyFetch.Name = true;
            rallyFetch.Tags = true;
            rallyFetch.DisplayColor = true;
            rallyFetch.Project = true;
            rallyFetch.Discussion = { initiator: COLON_SEPARATOR, separator: SEMI_COLON_SEPARATOR, open: OPEN_BRACKET_SEPARATOR, close: CLOSE_BRACKET_SEPARATOR, summary: true };
            rallyFetch.LatestDiscussionAgeInMinutes = true;
            rallyFetch.Tasks.summary = true;
            rallyFetch.Tasks.State = true;
            rallyFetch.Tasks.ToDo = true;
            rallyFetch.Tasks.Owner = true;
            rallyFetch.Tasks.Blocked = true;
            rallyFetch.TaskStatus = true;
            rallyFetch.Defects.summary = true;
            rallyFetch.Defects.State = true;
            rallyFetch.Defects.ToDo = true;
            rallyFetch.Defects.Owner = true;
            rallyFetch.Defects.Blocked = true;
            rallyFetch.DefectStatus = true;
            rallyFetch.C_DefectSeverity = true;
            rallyFetch.C_DefectImpact = true;
            rallyFetch.DragAndDropRank = true;

            expect(rallyFetch.buildFetchString()).to.equal(RALLY_COMPLETE_FETCH_STRING);
        });

    }
);