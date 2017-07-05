
import {RallyApi} from "./rally-api";
import { expect } from "chai";
import {RallyIssueRequest, RallyIssueRequestImpl, RallyQuery, RallyQueryImpl} from "./rally-query";

const RALLY_QUERY_STRING: string = "(((((TypeDefOid%20%3D%2025364774197)%20AND%20(ScheduleState%20%3D%20%22Backlog%22))%20AND%20(DirectChildrenCount%20%3D%200))%20OR%20((TypeDefOid%20%3D%2025364774132)%20AND%20(ScheduleState%20%3D%20%22Backlog%22)))%20AND%20(Release.OID%20%3D%2090509950300))";

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
            expect(rallyQuery.buildQueryString()).to.be(RALLY_QUERY_STRING);

        });

    }
);