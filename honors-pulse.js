/* Honors Pulse — Static demo dashboard
   - No backend
   - No real authentication
   - No real integrations
   This simulates a thin operational layer on top of Navigate + Canvas/WebCampus + PeopleSoft/MyNEVADA + DocuSign.
*/

(function () {
  "use strict";

  /** @type {ReturnType<typeof createDemoState>} */
  let state = createDemoState();

  const els = {
    pageTitle: document.getElementById("page-title"),
    lastUpdated: document.getElementById("last-updated"),
    navItems: Array.from(document.querySelectorAll(".hp-nav__item[data-view]")),
    views: Array.from(document.querySelectorAll(".hp-view")),
    kpis: document.getElementById("kpi-row"),
    tabs: Array.from(document.querySelectorAll(".hp-tab")),
    queueMeta: document.getElementById("queue-meta"),
    studentList: document.getElementById("student-list"),
    allStudentList: document.getElementById("all-student-list"),
    queues: document.getElementById("queues"),
    chartRisk: document.getElementById("chart-risk"),
    chartReasons: document.getElementById("chart-reasons"),
    insightsList: document.getElementById("insights-list"),

    search: document.getElementById("global-search"),
    onlyUrgent: document.getElementById("only-urgent"),
    filterBtn: document.getElementById("filter-btn"),
    exportBtn: document.getElementById("export-btn"),
    createTaskBtn: document.getElementById("create-task-btn"),
    refreshBtn: document.getElementById("refresh-btn"),

    drawerBackdrop: document.getElementById("drawer-backdrop"),
    drawer: document.getElementById("student-drawer"),
    drawerBody: document.getElementById("drawer-body"),
    drawerTitle: document.getElementById("drawer-title"),
    drawerClose: document.getElementById("drawer-close"),

    filtersBackdrop: document.getElementById("filters-backdrop"),
    filters: document.getElementById("filters"),
    filtersBody: document.getElementById("filters-body"),
    filtersClose: document.getElementById("filters-close"),
    applyFilters: document.getElementById("apply-filters"),
    resetFilters: document.getElementById("reset-filters"),

    outreachModal: document.getElementById("outreach-modal"),
    outreachBody: document.getElementById("outreach-body"),
    outreachClose: document.getElementById("outreach-close"),
    outreachCancel: document.getElementById("outreach-cancel"),
    outreachSave: document.getElementById("outreach-save"),
    outreachSent: document.getElementById("outreach-sent"),
  };

  // ---------- init ----------
  wireEvents();
  renderAll();

  // ---------- state ----------
  function createDemoState() {
    const now = new Date();
    return {
      activeView: "dashboard",
      activeBucket: "Urgent",
      searchQuery: "",
      onlyUrgent: false,
      selectedStudentId: null,
      outreachDraftFor: null,
      lastUpdatedAt: now,
      filters: {
        classYear: new Set(),
        major: new Set(),
        advisor: new Set(),
        pathway: new Set(),
        tags: new Set(),

        orientationIncomplete: false,
        lifeCheckOverdue: false,
        gradCheckDue: false,
        progressBelow60: false,

        navigateInactiveDays: null, // number
        canvasInactiveDays: null, // number
        facultyAlert: false,
        noResponseDays: null, // number
        multipleNoShows: false,

        workflowStatus: new Set(),
      },
      students: seedStudents(now),
    };
  }

  function seedStudents(now) {
    const d = (daysAgo) => isoDate(daysAgo);
    const days = (n) => n;

    /**
     * All timeline dates are relative to today for a believable “last updated”.
     * IDs are mock; do not represent real students.
     */
    return [
      {
        id: "92018431",
        profile: {
          fullName: "Marisol Vega",
          preferredName: "Mari",
          email: "mvega@unr.edu",
          major: "Biology",
          minor: "Chemistry",
          classYear: "First-year",
          honorsPathway: "Honors Thesis",
          expectedGradTerm: "Spring 2029",
          advisor: "Dr. Hailey S. Rodis",
          tags: ["First-gen"],
        },
        academics: { gpa: 3.21, gpaTrend: -0.18, highCourseLoad: true },
        milestones: {
          orientation: { status: "complete", date: d(180) },
          lifeCheck1: { status: "overdue", due: d(14) },
          lifeCheckAnnual: { status: "not_started" },
          gradCheck: { status: "not_required" },
          honorsRecord: { status: "needs_review", note: "Honors Record accessed once" },
          pathwayProgressPct: 22,
          signatureExperience: { status: "not_started" },
        },
        signals: {
          lastNavigateActiveDays: days(26),
          lastApptBookedDays: days(44),
          lastApptAttendedDays: days(60),
          noShows: 0,
          facultyAlerts: [],
          canvasInactivityDays: days(4),
          assignmentGapDays: days(0),
          outreachNoResponseDays: days(12),
          lastResponseDays: days(35),
          holds: false,
        },
        notesIntel: {
          lastMeetingDate: d(62),
          theme: "Transition + workload management",
          highlights: [
            "Discussed how to plan the first semester honors experience without overloading credits.",
            "Student expressed uncertainty about time management and asked about tutoring.",
            "Action item: schedule first-semester Life Check.",
          ],
          openLoops: [{ label: "Life Check not scheduled", status: "open" }],
          softSignals: ["workload_overwhelm", "confidence_low"],
          advisorConfidence: "Medium",
          sentimentTrend: "Declining",
        },
        workflow: { status: "Needs review", owner: "Dr. Hailey S. Rodis", due: d(1) },
        outreachHistory: [
          { date: d(12), type: "email", subject: "Life Check reminder", status: "sent" },
        ],
        recommendedAction: {
          title: "Send Life Check scheduling reminder",
          why: "Required first-semester Life Check is overdue and there’s no recent Navigate activity.",
          owner: "Dr. Hailey S. Rodis",
          channel: "Email",
          dueBy: d(-3),
          confidence: "High",
          template: "life_check",
        },
        timeline: [
          { date: d(180), type: "Orientation", desc: "Honors Orientation completed" },
          { date: d(62), type: "Advising", desc: "Meeting: transition planning + workload" },
          { date: d(12), type: "Outreach", desc: "Email sent: Life Check scheduling reminder" },
        ],
      },
      {
        id: "92019007",
        profile: {
          fullName: "Ethan Park",
          preferredName: null,
          email: "epark@unr.edu",
          major: "Computer Science & Engineering",
          minor: null,
          classYear: "Junior",
          honorsPathway: "Honors Coursework",
          expectedGradTerm: "Spring 2027",
          advisor: "Dr. Hailey S. Rodis",
          tags: ["International"],
        },
        academics: { gpa: 3.56, gpaTrend: -0.05, highCourseLoad: false },
        milestones: {
          orientation: { status: "complete", date: d(780) },
          lifeCheck1: { status: "complete", date: d(680) },
          lifeCheckAnnual: { status: "due_soon", due: d(-6) },
          gradCheck: { status: "not_required" },
          honorsRecord: { status: "ok", note: "Honors Record up to date" },
          pathwayProgressPct: 58,
          signatureExperience: { status: "in_progress" },
        },
        signals: {
          lastNavigateActiveDays: days(9),
          lastApptBookedDays: days(21),
          lastApptAttendedDays: days(21),
          noShows: 0,
          facultyAlerts: [
            { date: d(2), reason: "No Canvas login in 2 weeks", source: "Navigate alert" },
          ],
          canvasInactivityDays: days(16),
          assignmentGapDays: days(13),
          outreachNoResponseDays: days(0),
          lastResponseDays: days(2),
          holds: false,
        },
        notesIntel: {
          lastMeetingDate: d(21),
          theme: "Research planning",
          highlights: [
            "Student is exploring faculty labs for a signature experience.",
            "Action item: follow up on Canvas engagement alerts with faculty.",
          ],
          openLoops: [{ label: "Confirm re-engagement plan", status: "open" }],
          softSignals: ["workload_overwhelm"],
          advisorConfidence: "Medium",
          sentimentTrend: "Flat",
        },
        workflow: { status: "Contact today", owner: "Dr. Hailey S. Rodis", due: d(0) },
        outreachHistory: [
          { date: d(2), type: "call note", subject: "Faculty alert follow-up", status: "draft" },
        ],
        recommendedAction: {
          title: "Faculty alert follow-up",
          why: "Navigate alert indicates 2-week Canvas inactivity. Verify context and connect to support resources.",
          owner: "Dr. Hailey S. Rodis",
          channel: "Call note",
          dueBy: d(-1),
          confidence: "High",
          template: "faculty_alert",
        },
        timeline: [
          { date: d(21), type: "Advising", desc: "Meeting: research planning" },
          { date: d(2), type: "Alert", desc: "Navigate alert: no Canvas login in 2 weeks" },
        ],
      },
      {
        id: "92017712",
        profile: {
          fullName: "Aaliyah Johnson",
          preferredName: null,
          email: "ajohnson@unr.edu",
          major: "Psychology",
          minor: "Human Development",
          classYear: "Senior",
          honorsPathway: "Honors Thesis",
          expectedGradTerm: "Fall 2026",
          advisor: "Dr. Hailey S. Rodis",
          tags: ["Transfer"],
        },
        academics: { gpa: 3.74, gpaTrend: 0.02, highCourseLoad: false },
        milestones: {
          orientation: { status: "complete", date: d(900) },
          lifeCheck1: { status: "complete", date: d(830) },
          lifeCheckAnnual: { status: "complete", date: d(40) },
          gradCheck: { status: "overdue", due: d(7) },
          honorsRecord: { status: "needs_review", note: "Honors thesis plan missing committee info" },
          pathwayProgressPct: 84,
          signatureExperience: { status: "in_progress" },
        },
        signals: {
          lastNavigateActiveDays: days(15),
          lastApptBookedDays: days(33),
          lastApptAttendedDays: days(33),
          noShows: 1,
          facultyAlerts: [],
          canvasInactivityDays: days(3),
          assignmentGapDays: days(0),
          outreachNoResponseDays: days(9),
          lastResponseDays: days(9),
          holds: false,
        },
        notesIntel: {
          lastMeetingDate: d(33),
          theme: "Graduation planning",
          highlights: [
            "Reviewed timeline for graduation check and thesis defense milestones.",
            "Action item: complete Graduation Check prior to semester census date.",
          ],
          openLoops: [{ label: "Graduation Check", status: "open" }],
          softSignals: ["requirement_confusion", "graduate_school_interest"],
          advisorConfidence: "High",
          sentimentTrend: "Stable",
        },
        workflow: { status: "Needs review", owner: "Dr. Hailey S. Rodis", due: d(1) },
        outreachHistory: [
          { date: d(9), type: "email", subject: "Graduation Check due", status: "sent" },
        ],
        recommendedAction: {
          title: "Confirm Graduation Check within 7 days",
          why: "Expected graduation term is near and Graduation Check is overdue.",
          owner: "Dr. Hailey S. Rodis",
          channel: "Email",
          dueBy: d(-2),
          confidence: "High",
          template: "grad_check",
        },
        timeline: [
          { date: d(40), type: "Milestone", desc: "Annual Life Check completed" },
          { date: d(33), type: "Advising", desc: "Meeting: graduation planning" },
          { date: d(9), type: "Outreach", desc: "Email sent: Graduation Check reminder" },
        ],
      },
      {
        id: "92019992",
        profile: {
          fullName: "Noah Kim",
          preferredName: null,
          email: "nkim@unr.edu",
          major: "Business Administration",
          minor: "Data Analytics",
          classYear: "Sophomore",
          honorsPathway: "Honors Coursework",
          expectedGradTerm: "Spring 2028",
          advisor: "Dr. Hailey S. Rodis",
          tags: ["First-gen"],
        },
        academics: { gpa: 2.88, gpaTrend: -0.42, highCourseLoad: true },
        milestones: {
          orientation: { status: "complete", date: d(520) },
          lifeCheck1: { status: "complete", date: d(410) },
          lifeCheckAnnual: { status: "overdue", due: d(20) },
          gradCheck: { status: "not_required" },
          honorsRecord: { status: "needs_review", note: "Honors Record not accessed this term" },
          pathwayProgressPct: 39,
          signatureExperience: { status: "not_started" },
        },
        signals: {
          lastNavigateActiveDays: days(34),
          lastApptBookedDays: days(48),
          lastApptAttendedDays: days(80),
          noShows: 2,
          facultyAlerts: [
            { date: d(6), reason: "Missing assignments for 2 weeks", source: "Navigate alert" },
          ],
          canvasInactivityDays: days(12),
          assignmentGapDays: days(15),
          outreachNoResponseDays: days(15),
          lastResponseDays: days(30),
          holds: true,
        },
        notesIntel: {
          lastMeetingDate: d(80),
          theme: "Academic standing + resources",
          highlights: [
            "Discussed GPA concerns and options for tutoring and study groups.",
            "Student agreed to schedule annual Life Check and to respond to weekly check-in.",
          ],
          openLoops: [
            { label: "Annual Life Check overdue", status: "open" },
            { label: "Respond to weekly check-in", status: "open" },
          ],
          softSignals: ["financial_pressure", "workload_overwhelm", "belonging_concern"],
          advisorConfidence: "Low",
          sentimentTrend: "Declining",
        },
        workflow: { status: "Contact today", owner: "Dr. Hailey S. Rodis", due: d(0) },
        outreachHistory: [
          { date: d(15), type: "text", subject: "Check-in", status: "sent" },
          { date: d(8), type: "email", subject: "Life Check scheduling", status: "sent" },
        ],
        recommendedAction: {
          title: "Escalate to Honors advisor review",
          why: "Multiple signals: GPA drop, holds, faculty alert, annual Life Check overdue, and no response to outreach.",
          owner: "Dr. Hailey S. Rodis",
          channel: "Email",
          dueBy: d(-1),
          confidence: "Medium",
          template: "wellbeing",
        },
        timeline: [
          { date: d(80), type: "Advising", desc: "Meeting: academic standing + resources" },
          { date: d(20), type: "Milestone", desc: "Annual Life Check became overdue" },
          { date: d(6), type: "Alert", desc: "Navigate alert: missing assignments for 2 weeks" },
          { date: d(8), type: "Outreach", desc: "Email sent: Life Check scheduling" },
        ],
      },
      {
        id: "92016344",
        profile: {
          fullName: "Sofia Hernandez",
          preferredName: "Sofi",
          email: "shernandez@unr.edu",
          major: "Mechanical Engineering",
          minor: null,
          classYear: "Senior",
          honorsPathway: "Honors Coursework",
          expectedGradTerm: "Spring 2026",
          advisor: "Dr. Hailey S. Rodis",
          tags: ["Transfer"],
        },
        academics: { gpa: 3.12, gpaTrend: -0.22, highCourseLoad: true },
        milestones: {
          orientation: { status: "complete", date: d(1000) },
          lifeCheck1: { status: "complete", date: d(880) },
          lifeCheckAnnual: { status: "complete", date: d(120) },
          gradCheck: { status: "due_soon", due: d(-10) },
          honorsRecord: { status: "ok", note: "Honors Record up to date" },
          pathwayProgressPct: 76,
          signatureExperience: { status: "complete" },
        },
        signals: {
          lastNavigateActiveDays: days(27),
          lastApptBookedDays: days(42),
          lastApptAttendedDays: days(70),
          noShows: 1,
          facultyAlerts: [],
          canvasInactivityDays: days(8),
          assignmentGapDays: days(8),
          outreachNoResponseDays: days(11),
          lastResponseDays: days(11),
          holds: false,
        },
        notesIntel: {
          lastMeetingDate: d(70),
          theme: "Graduation check readiness",
          highlights: [
            "Student balancing capstone + work hours; asked for deadline clarity.",
            "Action item: schedule Graduation Check appointment.",
          ],
          openLoops: [{ label: "Graduation Check appointment not booked", status: "open" }],
          softSignals: ["workload_overwhelm", "requirement_confusion"],
          advisorConfidence: "Medium",
          sentimentTrend: "Declining",
        },
        workflow: { status: "Waiting for student reply", owner: "Dr. Hailey S. Rodis", due: d(2) },
        outreachHistory: [
          { date: d(11), type: "email", subject: "Graduation Check scheduling", status: "sent" },
        ],
        recommendedAction: {
          title: "Request advisor follow-up meeting",
          why: "Graduation Check due soon and outreach has not been acknowledged.",
          owner: "Dr. Hailey S. Rodis",
          channel: "Email",
          dueBy: d(-2),
          confidence: "Medium",
          template: "grad_check",
        },
        timeline: [
          { date: d(70), type: "Advising", desc: "Meeting: graduation readiness" },
          { date: d(11), type: "Outreach", desc: "Email sent: Graduation Check scheduling" },
        ],
      },
      {
        id: "92015555",
        profile: {
          fullName: "Jordan Reed",
          preferredName: null,
          email: "jreed@unr.edu",
          major: "Journalism",
          minor: "Political Science",
          classYear: "Sophomore",
          honorsPathway: "Honors Coursework",
          expectedGradTerm: "Spring 2028",
          advisor: "Dr. Hailey S. Rodis",
          tags: ["First-gen"],
        },
        academics: { gpa: 3.41, gpaTrend: -0.08, highCourseLoad: false },
        milestones: {
          orientation: { status: "complete", date: d(520) },
          lifeCheck1: { status: "complete", date: d(410) },
          lifeCheckAnnual: { status: "due_soon", due: d(-8) },
          gradCheck: { status: "not_required" },
          honorsRecord: { status: "ok", note: "Honors Record accessed this month" },
          pathwayProgressPct: 44,
          signatureExperience: { status: "not_started" },
        },
        signals: {
          lastNavigateActiveDays: days(7),
          lastApptBookedDays: days(14),
          lastApptAttendedDays: days(14),
          noShows: 3,
          facultyAlerts: [],
          canvasInactivityDays: days(2),
          assignmentGapDays: days(0),
          outreachNoResponseDays: days(0),
          lastResponseDays: days(1),
          holds: false,
        },
        notesIntel: {
          lastMeetingDate: d(14),
          theme: "Engagement + planning",
          highlights: [
            "Student interested in community engagement signature experience.",
            "Noted pattern of missing scheduled meetings.",
          ],
          openLoops: [{ label: "No-show pattern", status: "open" }],
          softSignals: ["belonging_concern"],
          advisorConfidence: "Medium",
          sentimentTrend: "Flat",
        },
        workflow: { status: "Monitor next week", owner: "Dr. Hailey S. Rodis", due: d(7) },
        outreachHistory: [],
        recommendedAction: {
          title: "Monitor only; no direct outreach yet",
          why: "Student is currently engaged but has multiple no-shows. Consider a soft reminder at next contact.",
          owner: "Dr. Hailey S. Rodis",
          channel: "—",
          dueBy: d(7),
          confidence: "Low",
          template: "wellbeing",
        },
        timeline: [
          { date: d(14), type: "Advising", desc: "Meeting: engagement + planning" },
          { date: d(3), type: "Appointment", desc: "No-show recorded" },
        ],
      },
      {
        id: "92018888",
        profile: {
          fullName: "Priya Desai",
          preferredName: null,
          email: "pdesai@unr.edu",
          major: "Neuroscience",
          minor: null,
          classYear: "Senior",
          honorsPathway: "Honors Thesis",
          expectedGradTerm: "Spring 2026",
          advisor: "Dr. Hailey S. Rodis",
          tags: ["Pre-health"],
        },
        academics: { gpa: 3.93, gpaTrend: 0.01, highCourseLoad: true },
        milestones: {
          orientation: { status: "complete", date: d(1000) },
          lifeCheck1: { status: "complete", date: d(880) },
          lifeCheckAnnual: { status: "complete", date: d(30) },
          gradCheck: { status: "due_soon", due: d(-12) },
          honorsRecord: { status: "ok", note: "Thesis progress logged" },
          pathwayProgressPct: 92,
          signatureExperience: { status: "in_progress" },
        },
        signals: {
          lastNavigateActiveDays: days(5),
          lastApptBookedDays: days(10),
          lastApptAttendedDays: days(10),
          noShows: 0,
          facultyAlerts: [],
          canvasInactivityDays: days(1),
          assignmentGapDays: days(0),
          outreachNoResponseDays: days(0),
          lastResponseDays: days(0),
          holds: false,
        },
        notesIntel: {
          lastMeetingDate: d(10),
          theme: "Graduate school + thesis timeline",
          highlights: [
            "Student seeking med school guidance; needs letters timeline.",
            "Action item: confirm Graduation Check appointment within 2 weeks.",
          ],
          openLoops: [{ label: "Graduation Check appointment", status: "open" }],
          softSignals: ["graduate_school_interest"],
          advisorConfidence: "High",
          sentimentTrend: "Stable",
        },
        workflow: { status: "Appointment booked", owner: "Dr. Hailey S. Rodis", due: d(12) },
        outreachHistory: [
          { date: d(9), type: "email", subject: "Confirm Grad Check slot", status: "sent" },
        ],
        recommendedAction: {
          title: "Confirm Graduation Check within 7 days",
          why: "Graduation Check due soon; student is responsive and progressing well.",
          owner: "Dr. Hailey S. Rodis",
          channel: "Email",
          dueBy: d(-4),
          confidence: "Medium",
          template: "grad_check",
        },
        timeline: [
          { date: d(30), type: "Milestone", desc: "Annual Life Check completed" },
          { date: d(10), type: "Advising", desc: "Meeting: grad school + thesis timeline" },
        ],
      },
      {
        id: "92017001",
        profile: {
          fullName: "Kai Thompson",
          preferredName: null,
          email: "kthompson@unr.edu",
          major: "Environmental Science",
          minor: "Geography",
          classYear: "Junior",
          honorsPathway: "Signature Experience",
          expectedGradTerm: "Spring 2027",
          advisor: "Dr. Hailey S. Rodis",
          tags: ["Transfer"],
        },
        academics: { gpa: 3.02, gpaTrend: -0.25, highCourseLoad: false },
        milestones: {
          orientation: { status: "complete", date: d(780) },
          lifeCheck1: { status: "complete", date: d(680) },
          lifeCheckAnnual: { status: "overdue", due: d(5) },
          gradCheck: { status: "not_required" },
          honorsRecord: { status: "needs_review", note: "Signature Experience plan not submitted" },
          pathwayProgressPct: 41,
          signatureExperience: { status: "not_started" },
        },
        signals: {
          lastNavigateActiveDays: days(23),
          lastApptBookedDays: days(60),
          lastApptAttendedDays: days(60),
          noShows: 1,
          facultyAlerts: [],
          canvasInactivityDays: days(6),
          assignmentGapDays: days(0),
          outreachNoResponseDays: days(14),
          lastResponseDays: days(20),
          holds: false,
        },
        notesIntel: {
          lastMeetingDate: d(60),
          theme: "Signature Experience planning",
          highlights: [
            "Student interested in conservation internship but hasn’t reached out to partners.",
            "Action item: draft Signature Experience plan in Honors Record.",
          ],
          openLoops: [{ label: "Signature Experience plan not drafted", status: "open" }],
          softSignals: ["career_uncertainty"],
          advisorConfidence: "Medium",
          sentimentTrend: "Declining",
        },
        workflow: { status: "Waiting for student reply", owner: "Dr. Hailey S. Rodis", due: d(2) },
        outreachHistory: [
          { date: d(14), type: "email", subject: "Life Check + plan check-in", status: "sent" },
        ],
        recommendedAction: {
          title: "Request advisor follow-up meeting",
          why: "Annual Life Check is overdue and Signature Experience planning is stalled.",
          owner: "Dr. Hailey S. Rodis",
          channel: "Email",
          dueBy: d(-2),
          confidence: "Medium",
          template: "wellbeing",
        },
        timeline: [
          { date: d(60), type: "Advising", desc: "Meeting: signature experience planning" },
          { date: d(14), type: "Outreach", desc: "Email sent: Life Check + plan check-in" },
        ],
      },
      {
        id: "92014010",
        profile: {
          fullName: "Hannah Lee",
          preferredName: null,
          email: "hlee@unr.edu",
          major: "Nursing",
          minor: null,
          classYear: "First-year",
          honorsPathway: "Honors Coursework",
          expectedGradTerm: "Spring 2029",
          advisor: "Dr. Hailey S. Rodis",
          tags: ["Pre-health"],
        },
        academics: { gpa: 3.48, gpaTrend: 0.1, highCourseLoad: true },
        milestones: {
          orientation: { status: "incomplete", due: d(2) },
          lifeCheck1: { status: "not_started" },
          lifeCheckAnnual: { status: "not_started" },
          gradCheck: { status: "not_required" },
          honorsRecord: { status: "needs_review", note: "Honors Record not opened" },
          pathwayProgressPct: 10,
          signatureExperience: { status: "not_started" },
        },
        signals: {
          lastNavigateActiveDays: days(18),
          lastApptBookedDays: days(0),
          lastApptAttendedDays: days(0),
          noShows: 0,
          facultyAlerts: [],
          canvasInactivityDays: days(7),
          assignmentGapDays: days(0),
          outreachNoResponseDays: days(0),
          lastResponseDays: days(0),
          holds: false,
        },
        notesIntel: {
          lastMeetingDate: null,
          theme: "—",
          highlights: ["No prior advising meeting recorded."],
          openLoops: [{ label: "Complete Honors Orientation", status: "open" }],
          softSignals: ["requirement_confusion"],
          advisorConfidence: "Low",
          sentimentTrend: "Unknown",
        },
        workflow: { status: "Needs review", owner: "Dr. Hailey S. Rodis", due: d(2) },
        outreachHistory: [],
        recommendedAction: {
          title: "Send Orientation completion reminder",
          why: "Orientation milestone is incomplete; early intervention prevents downstream Life Check delays.",
          owner: "Dr. Hailey S. Rodis",
          channel: "Email",
          dueBy: d(-3),
          confidence: "High",
          template: "life_check",
        },
        timeline: [
          { date: d(2), type: "Milestone", desc: "Orientation deadline passed (incomplete)" },
        ],
      },
      {
        id: "92013337",
        profile: {
          fullName: "Caleb Miller",
          preferredName: null,
          email: "cmiller@unr.edu",
          major: "Mathematics",
          minor: "Computer Science",
          classYear: "Junior",
          honorsPathway: "Honors Coursework",
          expectedGradTerm: "Spring 2027",
          advisor: "Dr. Hailey S. Rodis",
          tags: [],
        },
        academics: { gpa: 3.91, gpaTrend: 0.0, highCourseLoad: false },
        milestones: {
          orientation: { status: "complete", date: d(780) },
          lifeCheck1: { status: "complete", date: d(680) },
          lifeCheckAnnual: { status: "complete", date: d(20) },
          gradCheck: { status: "not_required" },
          honorsRecord: { status: "ok", note: "Progress documented" },
          pathwayProgressPct: 72,
          signatureExperience: { status: "in_progress" },
        },
        signals: {
          lastNavigateActiveDays: days(4),
          lastApptBookedDays: days(20),
          lastApptAttendedDays: days(20),
          noShows: 0,
          facultyAlerts: [],
          canvasInactivityDays: days(1),
          assignmentGapDays: days(0),
          outreachNoResponseDays: days(0),
          lastResponseDays: days(0),
          holds: false,
        },
        notesIntel: {
          lastMeetingDate: d(20),
          theme: "Signature Experience refinement",
          highlights: [
            "Student has strong academics; needs help selecting a signature project scope.",
            "Action item: confirm faculty mentor by next month.",
          ],
          openLoops: [{ label: "Confirm faculty mentor", status: "open" }],
          softSignals: ["internship_seeking"],
          advisorConfidence: "High",
          sentimentTrend: "Stable",
        },
        workflow: { status: "Monitor next week", owner: "Dr. Hailey S. Rodis", due: d(7) },
        outreachHistory: [],
        recommendedAction: {
          title: "Monitor only; no direct outreach yet",
          why: "Student is stable; keep an eye on mentor selection timeline.",
          owner: "Dr. Hailey S. Rodis",
          channel: "—",
          dueBy: d(14),
          confidence: "Low",
          template: "wellbeing",
        },
        timeline: [
          { date: d(20), type: "Advising", desc: "Meeting: signature experience refinement" },
        ],
      },
      {
        id: "92012220",
        profile: {
          fullName: "Liam O'Connor",
          preferredName: null,
          email: "loconnor@unr.edu",
          major: "Economics",
          minor: null,
          classYear: "Senior",
          honorsPathway: "Honors Coursework",
          expectedGradTerm: "Spring 2026",
          advisor: "Dr. Hailey S. Rodis",
          tags: ["Veteran"],
        },
        academics: { gpa: 3.18, gpaTrend: -0.12, highCourseLoad: false },
        milestones: {
          orientation: { status: "complete", date: d(1000) },
          lifeCheck1: { status: "complete", date: d(880) },
          lifeCheckAnnual: { status: "complete", date: d(70) },
          gradCheck: { status: "overdue", due: d(3) },
          honorsRecord: { status: "ok", note: "Honors Record updated" },
          pathwayProgressPct: 79,
          signatureExperience: { status: "complete" },
        },
        signals: {
          lastNavigateActiveDays: days(41),
          lastApptBookedDays: days(78),
          lastApptAttendedDays: days(98),
          noShows: 0,
          facultyAlerts: [],
          canvasInactivityDays: days(9),
          assignmentGapDays: days(0),
          outreachNoResponseDays: days(13),
          lastResponseDays: days(13),
          holds: false,
        },
        notesIntel: {
          lastMeetingDate: d(98),
          theme: "Graduation logistics",
          highlights: [
            "Student asked about graduation check steps and required documentation.",
            "Action item: complete Graduation Check before final term.",
          ],
          openLoops: [{ label: "Graduation Check overdue", status: "open" }],
          softSignals: ["requirement_confusion"],
          advisorConfidence: "Medium",
          sentimentTrend: "Declining",
        },
        workflow: { status: "Waiting for student reply", owner: "Dr. Hailey S. Rodis", due: d(1) },
        outreachHistory: [
          { date: d(13), type: "email", subject: "Graduation Check overdue", status: "sent" },
        ],
        recommendedAction: {
          title: "Request advisor follow-up meeting",
          why: "Graduation Check is overdue and student has not been active in Navigate recently.",
          owner: "Dr. Hailey S. Rodis",
          channel: "Email",
          dueBy: d(-2),
          confidence: "High",
          template: "grad_check",
        },
        timeline: [
          { date: d(98), type: "Advising", desc: "Meeting: graduation logistics" },
          { date: d(13), type: "Outreach", desc: "Email sent: Graduation Check overdue" },
        ],
      },
      {
        id: "92011119",
        profile: {
          fullName: "Grace Nguyen",
          preferredName: null,
          email: "gnguyen@unr.edu",
          major: "English",
          minor: "Philosophy",
          classYear: "Senior",
          honorsPathway: "Honors Thesis",
          expectedGradTerm: "Fall 2026",
          advisor: "Dr. Hailey S. Rodis",
          tags: ["International"],
        },
        academics: { gpa: 3.6, gpaTrend: -0.1, highCourseLoad: false },
        milestones: {
          orientation: { status: "complete", date: d(1000) },
          lifeCheck1: { status: "complete", date: d(880) },
          lifeCheckAnnual: { status: "complete", date: d(110) },
          gradCheck: { status: "not_started", due: d(-60) },
          honorsRecord: { status: "needs_review", note: "Thesis action items not updated" },
          pathwayProgressPct: 70,
          signatureExperience: { status: "in_progress" },
        },
        signals: {
          lastNavigateActiveDays: days(19),
          lastApptBookedDays: days(110),
          lastApptAttendedDays: days(140),
          noShows: 0,
          facultyAlerts: [
            { date: d(5), reason: "Stopped attending discussion section", source: "Navigate alert" },
          ],
          canvasInactivityDays: days(5),
          assignmentGapDays: days(10),
          outreachNoResponseDays: days(0),
          lastResponseDays: days(5),
          holds: false,
        },
        notesIntel: {
          lastMeetingDate: d(140),
          theme: "Belonging + academic confidence",
          highlights: [
            "Student reported feeling disconnected from cohort.",
            "Action item: connect to campus support and peer community.",
          ],
          openLoops: [{ label: "Connect to support resources", status: "open" }],
          softSignals: ["belonging_concern", "confidence_low"],
          advisorConfidence: "Low",
          sentimentTrend: "Declining",
        },
        workflow: { status: "Needs review", owner: "Dr. Hailey S. Rodis", due: d(1) },
        outreachHistory: [],
        recommendedAction: {
          title: "Refer to tutoring / support services",
          why: "Soft signals (belonging/confidence) plus a recent faculty alert indicate early intervention is helpful.",
          owner: "Dr. Hailey S. Rodis",
          channel: "Email",
          dueBy: d(-3),
          confidence: "Medium",
          template: "wellbeing",
        },
        timeline: [
          { date: d(140), type: "Advising", desc: "Meeting: belonging + academic confidence" },
          { date: d(5), type: "Alert", desc: "Navigate alert: stopped attending discussion section" },
        ],
      },
      {
        id: "92010101",
        profile: {
          fullName: "Miguel Santos",
          preferredName: null,
          email: "msantos@unr.edu",
          major: "Public Health",
          minor: null,
          classYear: "Sophomore",
          honorsPathway: "Signature Experience",
          expectedGradTerm: "Spring 2028",
          advisor: "Dr. Hailey S. Rodis",
          tags: ["First-gen", "Transfer"],
        },
        academics: { gpa: 3.09, gpaTrend: 0.06, highCourseLoad: false },
        milestones: {
          orientation: { status: "complete", date: d(520) },
          lifeCheck1: { status: "complete", date: d(410) },
          lifeCheckAnnual: { status: "complete", date: d(12) },
          gradCheck: { status: "not_required" },
          honorsRecord: { status: "ok", note: "Signature Experience plan drafted" },
          pathwayProgressPct: 48,
          signatureExperience: { status: "in_progress" },
        },
        signals: {
          lastNavigateActiveDays: days(2),
          lastApptBookedDays: days(20),
          lastApptAttendedDays: days(12),
          noShows: 0,
          facultyAlerts: [],
          canvasInactivityDays: days(0),
          assignmentGapDays: days(0),
          outreachNoResponseDays: days(0),
          lastResponseDays: days(0),
          holds: false,
        },
        notesIntel: {
          lastMeetingDate: d(12),
          theme: "Improvement after intervention",
          highlights: [
            "Student improved follow-through after last term check-in.",
            "Action item resolved: annual Life Check completed.",
          ],
          openLoops: [],
          softSignals: [],
          advisorConfidence: "High",
          sentimentTrend: "Improving",
        },
        workflow: { status: "Resolved", owner: "Dr. Hailey S. Rodis", due: d(0) },
        outreachHistory: [
          { date: d(28), type: "email", subject: "Check-in", status: "sent" },
          { date: d(12), type: "email", subject: "Thanks + next steps", status: "sent" },
        ],
        recommendedAction: {
          title: "Monitor only; no direct outreach yet",
          why: "Recent Life Check completed and engagement is strong.",
          owner: "Dr. Hailey S. Rodis",
          channel: "—",
          dueBy: d(14),
          confidence: "High",
          template: "wellbeing",
        },
        timeline: [
          { date: d(28), type: "Outreach", desc: "Email sent: check-in" },
          { date: d(12), type: "Milestone", desc: "Annual Life Check completed" },
        ],
      },
    ];

    function isoDate(offsetDaysFromToday) {
      // offsetDaysFromToday: positive means past; negative means future
      const dt = new Date(now);
      dt.setDate(dt.getDate() - offsetDaysFromToday);
      return dt.toISOString().slice(0, 10);
    }
  }

  // ---------- risk engine ----------
  function calculateRisk(student) {
    let score = 0;
    const reasons = [];

    const ms = student.milestones;
    const sig = student.signals;
    const notes = student.notesIntel;
    const acad = student.academics;

    // Milestones
    if (ms.orientation?.status === "incomplete") {
      score += 10;
      reasons.push("Orientation incomplete.");
    }

    if (ms.lifeCheck1?.status === "overdue") {
      score += 25;
      reasons.push("Overdue for required first-semester Life Check.");
    }
    if (ms.lifeCheckAnnual?.status === "overdue") {
      score += 25;
      reasons.push("Annual Life Check is overdue.");
    }

    // Graduation Check
    if (ms.gradCheck?.status === "overdue") {
      score += 25;
      reasons.push("Graduation Check is overdue.");
    }
    if (ms.gradCheck?.status === "due_soon") {
      score += 10;
      reasons.push("Graduation Check due soon.");
    }

    // Signals
    if (sig.lastNavigateActiveDays > 21) {
      score += 10;
      reasons.push(`No Navigate activity in ${sig.lastNavigateActiveDays} days.`);
    }
    if ((sig.facultyAlerts || []).length > 0) {
      score += 20;
      const last = sig.facultyAlerts[sig.facultyAlerts.length - 1];
      reasons.push(`Faculty alert: ${last.reason}.`);
    }
    if (sig.canvasInactivityDays > 14) {
      score += 20;
      reasons.push(`Canvas/WebCampus inactivity: ${sig.canvasInactivityDays} days.`);
    }
    if (sig.outreachNoResponseDays > 10) {
      score += 10;
      reasons.push(`No response to outreach for ${sig.outreachNoResponseDays} days.`);
    }
    if (sig.noShows >= 2) {
      score += 10;
      reasons.push("Multiple appointment no-shows.");
    }
    if (acad.gpaTrend <= -0.25) {
      score += 10;
      reasons.push("GPA drop trend.");
    }

    // Past follow-through (notes)
    if ((notes?.openLoops || []).some((l) => l.status === "open")) {
      score += 10;
      reasons.push("Missed follow-through from prior advising conversation.");
    }

    const tier = riskTier(score);
    const topReasons = uniq(reasons).slice(0, 6);
    return { score, tier, reasons: topReasons };
  }

  function riskTier(score) {
    if (score >= 75) return "Urgent";
    if (score >= 50) return "High";
    if (score >= 25) return "Watch";
    return "Stable";
  }

  function categorizeReasons(reasonLines) {
    // Very lightweight categorization for insights.
    const cats = {
      "Milestones": 0,
      "Engagement alerts": 0,
      "Outreach responsiveness": 0,
      "Follow-through": 0,
      "Academic risk": 0,
    };

    for (const r of reasonLines) {
      if (/Life Check|Graduation Check|Orientation/i.test(r)) cats["Milestones"]++;
      else if (/Canvas|Faculty alert|Navigate activity/i.test(r)) cats["Engagement alerts"]++;
      else if (/No response to outreach/i.test(r)) cats["Outreach responsiveness"]++;
      else if (/follow-through/i.test(r)) cats["Follow-through"]++;
      else if (/GPA/i.test(r)) cats["Academic risk"]++;
    }
    return cats;
  }

  // ---------- rendering ----------
  function renderAll() {
    // Enrich each student with risk info (computed each render)
    for (const s of state.students) {
      s._risk = calculateRisk(s);
    }

    els.lastUpdated.textContent = `Last updated: ${formatDateTime(state.lastUpdatedAt)}`;
    renderNav();
    renderKpis();
    renderBucketTabs();
    renderDashboardQueue();
    renderStudentsView();
    renderQueueView();
    renderInsights();
    renderFiltersForm();
  }

  function renderNav() {
    els.navItems.forEach((btn) => {
      const v = btn.getAttribute("data-view");
      btn.classList.toggle("is-active", v === state.activeView);
    });
    els.views.forEach((view) => {
      view.hidden = view.getAttribute("data-view") !== state.activeView;
    });
    const titles = {
      dashboard: "Dashboard",
      students: "Students",
      queue: "Queue",
      insights: "Insights",
      settings: "Settings",
    };
    els.pageTitle.textContent = titles[state.activeView] || "Dashboard";
  }

  function renderKpis() {
    const all = state.students;
    const urgent = all.filter((s) => s._risk.tier === "Urgent").length;
    const high = all.filter((s) => s._risk.tier === "High").length;
    const lifeOverdue = all.filter((s) => s.milestones.lifeCheck1?.status === "overdue" || s.milestones.lifeCheckAnnual?.status === "overdue").length;
    const gradDueSoon = all.filter((s) => ["due_soon", "overdue"].includes(s.milestones.gradCheck?.status)).length;
    const alerts = all.filter((s) => (s.signals.facultyAlerts || []).length > 0).length;
    const outreachPending = all.filter((s) => s.signals.outreachNoResponseDays > 10).length;

    const cards = [
      kpi("Urgent students", urgent, "Needs same-day triage", "var(--urgent)"),
      kpi("High-risk students", high, "Prioritize this week", "var(--high)"),
      kpi("Life Checks overdue", lifeOverdue, "Required milestones", "var(--watch)"),
      kpi("Grad Checks due", gradDueSoon, "Next-term readiness", "var(--accent)"),
      kpi("Unresolved alerts", alerts, "Navigate / faculty signals", "var(--accent-2)"),
      kpi("Outreach pending", outreachPending, "Awaiting response", "var(--watch)"),
    ];

    els.kpis.innerHTML = cards.join("\n");

    function kpi(label, value, note, color) {
      return `
        <div class="hp-kpi">
          <div class="hp-kpi__label">${escapeHtml(label)}</div>
          <div class="hp-kpi__value">${value}</div>
          <div class="hp-kpi__note">${escapeHtml(note)}</div>
          <div class="hp-kpi__accent" style="background:${color}"></div>
        </div>
      `;
    }
  }

  function renderBucketTabs() {
    els.tabs.forEach((t) => {
      const b = t.getAttribute("data-bucket");
      t.classList.toggle("is-active", b === state.activeBucket);
      t.setAttribute("aria-selected", String(b === state.activeBucket));
    });
  }

  function getVisibleStudents() {
    const query = state.searchQuery.trim().toLowerCase();

    let list = [...state.students];

    // bucket
    if (state.activeView === "dashboard") {
      list = list.filter((s) => s._risk.tier === state.activeBucket);
    }

    // urgent toggle
    if (state.onlyUrgent) {
      list = list.filter((s) => s._risk.tier === "Urgent");
    }

    // filters
    list = list.filter((s) => passesFilters(s, state.filters));

    // search
    if (query) {
      list = list.filter((s) => searchStudent(s, query));
    }

    // sort: risk desc then due date asc
    list.sort((a, b) => b._risk.score - a._risk.score);
    return list;
  }

  function renderDashboardQueue() {
    const list = getVisibleStudents();
    const meta = {
      Stable: "Low concern. Keep momentum on Honors pathway planning.",
      Watch: "Some concern. Review context and make next step explicit.",
      High: "Time-sensitive. Outreach and follow-through should be prioritized.",
      Urgent: "Immediate attention. Multiple cross-system signals indicate intervention now.",
    };
    els.queueMeta.textContent = `${list.length} students • ${meta[state.activeBucket] || ""}`;
    els.studentList.innerHTML = list.length ? list.map(renderStudentCard).join("\n") : emptyState("No students match the current bucket + filters.");
    wireStudentCardEvents(els.studentList);
  }

  function renderStudentsView() {
    const list = [...state.students]
      .filter((s) => (state.onlyUrgent ? s._risk.tier === "Urgent" : true))
      .filter((s) => passesFilters(s, state.filters))
      .filter((s) => (state.searchQuery ? searchStudent(s, state.searchQuery.toLowerCase()) : true))
      .sort((a, b) => b._risk.score - a._risk.score);

    els.allStudentList.innerHTML = list.length ? list.map(renderStudentCard).join("\n") : emptyState("No students match current filters.");
    wireStudentCardEvents(els.allStudentList);
  }

  function renderQueueView() {
    const groups = [
      { key: "Needs review", hint: "New or unreviewed items" },
      { key: "Contact today", hint: "Time-sensitive outreach" },
      { key: "Waiting for student reply", hint: "Pending student response" },
      { key: "Appointment booked", hint: "Navigate appointment in place" },
      { key: "Monitor next week", hint: "Check back soon" },
      { key: "Resolved", hint: "Closed loop" },
    ];

    els.queues.innerHTML = groups
      .map((g) => {
        const items = state.students
          .filter((s) => s.workflow.status === g.key)
          .sort((a, b) => b._risk.score - a._risk.score)
          .map((s) => renderQueueItem(s))
          .join("\n");

        return `
          <div class="hp-queuecol">
            <div class="hp-queuecol__title">${escapeHtml(g.key)}</div>
            <div class="hp-queuecol__hint">${escapeHtml(g.hint)}</div>
            ${items || `<div class="hp-section__muted">No items</div>`}
          </div>
        `;
      })
      .join("\n");

    wireQueueEvents();
  }

  function renderInsights() {
    // Bar chart: risk tier counts
    const counts = countBy(state.students, (s) => s._risk.tier);
    const tiers = [
      { t: "Urgent", color: "var(--urgent)" },
      { t: "High", color: "var(--high)" },
      { t: "Watch", color: "var(--watch)" },
      { t: "Stable", color: "var(--stable)" },
    ];
    const max = Math.max(1, ...tiers.map((x) => counts[x.t] || 0));
    els.chartRisk.innerHTML = `
      <div class="hp-bars">
        ${tiers
          .map((x) => {
            const v = counts[x.t] || 0;
            const pct = Math.round((v / max) * 100);
            return `
              <div class="hp-bar">
                <div class="hp-bar__label">${x.t}</div>
                <div class="hp-bar__track"><div class="hp-bar__fill" style="width:${pct}%;background:${x.color}"></div></div>
                <div class="hp-bar__value">${v}</div>
              </div>
            `;
          })
          .join("\n")}
      </div>
    `;

    // Donut: reason category totals (aggregate top reasons)
    const allReasons = state.students.flatMap((s) => s._risk.reasons);
    const catCounts = categorizeReasons(allReasons);
    const entries = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
    const total = Math.max(1, entries.reduce((sum, [, v]) => sum + v, 0));
    const palette = [
      { key: "Milestones", color: "rgba(15,118,110,0.92)" },
      { key: "Engagement alerts", color: "rgba(15,61,94,0.92)" },
      { key: "Outreach responsiveness", color: "rgba(180,83,9,0.92)" },
      { key: "Follow-through", color: "rgba(88,28,135,0.80)" },
      { key: "Academic risk", color: "rgba(194,65,12,0.92)" },
    ];
    const segments = [];
    let cur = 0;
    for (const [k, v] of entries) {
      const deg = (v / total) * 360;
      const color = palette.find((p) => p.key === k)?.color || "rgba(11,18,32,0.35)";
      segments.push(`${color} ${cur}deg ${cur + deg}deg`);
      cur += deg;
    }
    const ringStyle = `background: conic-gradient(from 0deg, ${segments.join(", ")});`;
    els.chartReasons.innerHTML = `
      <div class="hp-donut">
        <div class="hp-donut__ring" style="${ringStyle}"></div>
        <div class="hp-legend">
          ${entries
            .map(([k, v]) => {
              const color = palette.find((p) => p.key === k)?.color || "rgba(11,18,32,0.35)";
              return `
                <div class="hp-legend__item">
                  <span class="hp-swatch" style="background:${color}"></span>
                  <span>${escapeHtml(k)}</span>
                  <span style="margin-left:auto;font-weight:650;">${v}</span>
                </div>
              `;
            })
            .join("\n")}
        </div>
      </div>
    `;

    // Watchlist
    const watchlist = [...state.students]
      .filter((s) => s._risk.score >= 50 || (s.signals.facultyAlerts || []).length > 0)
      .sort((a, b) => b._risk.score - a._risk.score)
      .slice(0, 6);

    els.insightsList.innerHTML = watchlist.map(renderStudentCard).join("\n");
    wireStudentCardEvents(els.insightsList);
  }

  function renderStudentCard(s) {
    const ms = s.milestones;
    const nextMilestone = nextMilestoneText(ms);
    const lastActivity = `Navigate ${s.signals.lastNavigateActiveDays}d • Canvas ${s.signals.canvasInactivityDays}d`;
    const reasons = s._risk.reasons.slice(0, 2);

    return `
      <article class="hp-student" data-student-id="${escapeAttr(s.id)}" tabindex="0" role="button" aria-label="Open student ${escapeAttr(s.profile.fullName)}">
        <div>
          <div class="hp-student__name">${escapeHtml(s.profile.fullName)}</div>
          <div class="hp-student__line">
            <strong>${escapeHtml(s.id)}</strong> • ${escapeHtml(s.profile.major)} • ${escapeHtml(s.profile.classYear)}
          </div>

          <div class="hp-student__line hp-student__line--muted">
            Queue: <strong>${escapeHtml(s.workflow.status)}</strong> • Next: <strong>${escapeHtml(nextMilestone)}</strong> • ${escapeHtml(lastActivity)}
          </div>

          <div class="hp-student__reasons">
            ${reasons.map((r) => `<span class="hp-flag">${escapeHtml(r)}</span>`).join("\n")}
          </div>
        </div>

        <div class="hp-student__right">
          <div class="hp-student__score">
            <span class="hp-badge" data-tier="${escapeAttr(s._risk.tier)}">${escapeHtml(s._risk.tier)}</span>
            <span>Score: <strong>${s._risk.score}</strong></span>
          </div>
          <div class="hp-actions">
            <button class="hp-action hp-action--primary" data-action="view" type="button">View</button>
            <button class="hp-action hp-action--accent" data-action="outreach" type="button">Draft outreach</button>
            <button class="hp-action" data-action="reviewed" type="button">Reviewed</button>
            <button class="hp-action is-danger" data-action="snooze" type="button">Snooze</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderQueueItem(s) {
    const topReason = s._risk.reasons[0] || "—";
    return `
      <div class="hp-queueitem" data-student-id="${escapeAttr(s.id)}">
        <div class="hp-queueitem__top">
          <div>
            <div class="hp-queueitem__name">${escapeHtml(s.profile.fullName)}</div>
            <div class="hp-queueitem__meta">${escapeHtml(topReason)}</div>
          </div>
          <div>
            <span class="hp-badge" data-tier="${escapeAttr(s._risk.tier)}">${escapeHtml(s._risk.tier)}</span>
          </div>
        </div>
        <div class="hp-queueitem__meta" style="margin-top:6px;">Owner: <strong>${escapeHtml(s.workflow.owner)}</strong> • Due: <strong>${escapeHtml(s.workflow.due)}</strong></div>
        <div class="hp-queueitem__actions">
          <button class="hp-action" data-action="open" type="button">Open</button>
          <button class="hp-action" data-action="reassign" type="button">Reassign</button>
          <button class="hp-action" data-action="status" type="button">Change status</button>
          <button class="hp-action" data-action="snooze" type="button">Snooze</button>
        </div>
      </div>
    `;
  }

  function renderStudentDrawer(studentId) {
    const s = state.students.find((x) => x.id === studentId);
    if (!s) return;
    const { score, tier, reasons } = s._risk;

    els.drawerTitle.textContent = s.profile.fullName;
    els.drawerBody.innerHTML = `
      <div class="hp-profile">
        <div class="hp-section">
          <div class="hp-profile__top">
            <div>
              <div class="hp-profile__name">${escapeHtml(s.profile.fullName)}${s.profile.preferredName ? ` <span class="hp-pill">prefers ${escapeHtml(s.profile.preferredName)}</span>` : ""}</div>
              <div class="hp-profile__sub">${escapeHtml(s.id)} • ${escapeHtml(s.profile.major)}${s.profile.minor ? `, Minor: ${escapeHtml(s.profile.minor)}` : ""}</div>
              <div class="hp-profile__sub">${escapeHtml(s.profile.classYear)} • ${escapeHtml(s.profile.honorsPathway)} • Expected grad: ${escapeHtml(s.profile.expectedGradTerm)}</div>
              <div class="hp-profile__sub">Advisor: <strong>${escapeHtml(s.profile.advisor)}</strong> • Email: <a href="mailto:${escapeAttr(s.profile.email)}">${escapeHtml(s.profile.email)}</a></div>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end;">
              <span class="hp-badge" data-tier="${escapeAttr(tier)}">${escapeHtml(tier)} • ${score}</span>
              <div class="hp-tagrow">
                ${(s.profile.tags || []).map((t) => `<span class="hp-pill">${escapeHtml(t)}</span>`).join("\n")}
              </div>
            </div>
          </div>

          <div class="hp-actions" style="margin-top:10px;justify-content:flex-start;">
            <button class="hp-action" data-drawer-action="outreach" type="button">Draft outreach</button>
            <button class="hp-action" data-drawer-action="contacted" type="button">Mark contacted</button>
            <button class="hp-action" data-drawer-action="schedule" type="button" title="Placeholder">Schedule follow-up</button>
            <button class="hp-action" data-drawer-action="assign" type="button">Assign owner</button>
            <button class="hp-action is-danger" data-drawer-action="snooze" type="button">Snooze 7 days</button>
          </div>
        </div>

        <div class="hp-section">
          <div class="hp-section__title">Risk summary</div>
          <div class="hp-section__muted"><strong>Why this student is flagged</strong></div>
          <div style="margin-top:8px; display:grid; gap:6px;">
            ${reasons.map((r) => `<div class="hp-pill" style="justify-content:flex-start;">${escapeHtml(r)}</div>`).join("\n")}
          </div>
        </div>

        <div class="hp-section">
          <div class="hp-section__title">Honors milestones</div>
          ${renderMilestones(s)}
        </div>

        <div class="hp-section">
          <div class="hp-section__title">Mixed signals</div>
          ${renderSignals(s)}
        </div>

        <div class="hp-section">
          <div class="hp-section__title">Advising notes intelligence</div>
          ${renderNotesIntel(s)}
        </div>

        <div class="hp-section">
          <div class="hp-section__title">Timeline</div>
          ${renderTimeline(s)}
        </div>

        <div class="hp-section">
          <div class="hp-section__title">Recommended next action</div>
          ${renderRecommendedAction(s)}
        </div>
      </div>
    `;

    // Wire drawer buttons
    const root = els.drawerBody;
    root.querySelectorAll("[data-drawer-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-drawer-action");
        if (action === "outreach") openOutreachModal(s.id);
        if (action === "contacted") {
          updateWorkflow(s.id, { status: "Waiting for student reply" });
          toast(`Marked contacted: ${s.profile.fullName}`);
        }
        if (action === "assign") {
          const name = prompt("Assign owner (demo):", s.workflow.owner);
          if (name) {
            updateWorkflow(s.id, { owner: name });
            toast(`Owner updated to ${name}`);
          }
        }
        if (action === "schedule") {
          toast("Placeholder: scheduling remains in Navigate.");
        }
        if (action === "snooze") {
          snoozeStudent(s.id, 7);
          toast("Snoozed for 7 days.");
        }
        renderAll();
        renderStudentDrawer(s.id);
      });
    });

    // Wire recommended action panel buttons
    root.querySelectorAll("[data-reco-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-reco-action");
        if (action === "draft") {
          openOutreachModal(s.id);
          return;
        }
        if (action === "created") {
          // Demo: reflect that a task has been created in the workflow layer.
          updateWorkflow(s.id, { status: "Contact today", due: todayIso() });
          toast("Task created (demo): moved to Contact today.");
        }
        if (action === "assign") {
          const name = prompt("Assign owner (demo):", s.workflow.owner);
          if (name) {
            updateWorkflow(s.id, { owner: name });
            toast(`Owner updated to ${name}`);
          }
        }
        if (action === "snooze") {
          snoozeStudent(s.id, 7);
          toast("Snoozed for 7 days.");
        }

        renderAll();
        renderStudentDrawer(s.id);
      });
    });
  }

  function renderMilestones(s) {
    const ms = s.milestones;
    const items = [
      milestoneRow("Orientation", ms.orientation),
      milestoneRow("First-semester Life Check", ms.lifeCheck1),
      milestoneRow("Annual Life Check", ms.lifeCheckAnnual),
      milestoneRow("Graduation Check", ms.gradCheck),
      milestoneRow("Honors Record", ms.honorsRecord),
      {
        label: "Pathway progress",
        status: ms.pathwayProgressPct >= 70 ? "complete" : ms.pathwayProgressPct >= 50 ? "due_soon" : "overdue",
        right: `${ms.pathwayProgressPct}%`,
      },
      milestoneRow("Signature experience", ms.signatureExperience),
    ];
    return `
      <div class="hp-checklist">
        ${items
          .map((i) => {
            const status = normalizeMilestoneStatus(i.status);
            return `
              <div class="hp-check">
                <span class="hp-dot ${status.dotClass}" aria-hidden="true"></span>
                <div>
                  <div style="font-weight:650;">${escapeHtml(i.label)}</div>
                  <div class="hp-section__muted">${escapeHtml(status.label)}</div>
                </div>
                <div style="font-weight:650; color: rgba(11,18,32,0.78);">${escapeHtml(i.right || "")}</div>
              </div>
            `;
          })
          .join("\n")}
      </div>
    `;

    function milestoneRow(label, obj) {
      if (!obj) return { label, status: "not_started", right: "" };
      if (obj.status === "complete") return { label, status: "complete", right: obj.date || "" };
      if (obj.status === "due_soon") return { label, status: "due_soon", right: obj.due || "" };
      if (obj.status === "overdue") return { label, status: "overdue", right: obj.due || "" };
      if (obj.status === "incomplete") return { label, status: "overdue", right: obj.due || "" };
      if (obj.status === "needs_review") return { label, status: "due_soon", right: obj.note || "" };
      if (obj.status === "ok") return { label, status: "complete", right: obj.note || "" };
      if (obj.status === "not_required") return { label, status: "complete", right: "Not required" };
      if (obj.status === "not_started") return { label, status: "not_started", right: obj.due || "" };
      return { label, status: "not_started", right: obj.note || "" };
    }
  }

  function normalizeMilestoneStatus(status) {
    if (status === "complete") return { label: "Complete", dotClass: "is-ok" };
    if (status === "due_soon") return { label: "Due soon", dotClass: "is-due" };
    if (status === "overdue") return { label: "Overdue", dotClass: "is-overdue" };
    return { label: "Not started", dotClass: "" };
  }

  function renderSignals(s) {
    const sig = s.signals;
    const rows = [
      kv("Last active in Navigate", `${sig.lastNavigateActiveDays} days ago`, severity(sig.lastNavigateActiveDays > 21 ? "high" : sig.lastNavigateActiveDays > 14 ? "warn" : "ok")),
      kv("Last appointment booked", sig.lastApptBookedDays ? `${sig.lastApptBookedDays} days ago` : "—", severity(sig.lastApptBookedDays > 45 ? "warn" : "ok")),
      kv("Last appointment attended", sig.lastApptAttendedDays ? `${sig.lastApptAttendedDays} days ago` : "—", severity(sig.lastApptAttendedDays > 45 ? "warn" : "ok")),
      kv("Appointment no-shows", String(sig.noShows), severity(sig.noShows >= 2 ? "high" : sig.noShows === 1 ? "warn" : "ok")),
      kv("Faculty alerts", String((sig.facultyAlerts || []).length), severity((sig.facultyAlerts || []).length ? "high" : "ok")),
      kv("Last faculty alert", (sig.facultyAlerts || []).slice(-1)[0]?.reason || "—", severity((sig.facultyAlerts || []).length ? "warn" : "ok")),
      kv("Canvas inactivity", `${sig.canvasInactivityDays} days`, severity(sig.canvasInactivityDays > 14 ? "high" : sig.canvasInactivityDays > 7 ? "warn" : "ok")),
      kv("Assignment submission gap", sig.assignmentGapDays ? `${sig.assignmentGapDays} days` : "0", severity(sig.assignmentGapDays > 14 ? "high" : sig.assignmentGapDays > 7 ? "warn" : "ok")),
      kv("Outreach unanswered", sig.outreachNoResponseDays ? `${sig.outreachNoResponseDays} days` : "0", severity(sig.outreachNoResponseDays > 10 ? "warn" : "ok")),
      kv("Holds flag", sig.holds ? "Yes" : "No", severity(sig.holds ? "warn" : "ok")),
      kv("High course load", s.academics.highCourseLoad ? "Yes" : "No", severity(s.academics.highCourseLoad ? "warn" : "ok")),
    ];
    return rows.join("\n");

    function kv(k, v, cls) {
      return `
        <div class="hp-kv">
          <div class="hp-kv__k">${escapeHtml(k)}</div>
          <div class="hp-kv__v ${cls}">${escapeHtml(v)}</div>
        </div>
      `;
    }
    function severity(level) {
      if (level === "high") return "is-urgent";
      if (level === "warn") return "is-warn";
      return "";
    }
  }

  function renderNotesIntel(s) {
    const n = s.notesIntel;
    const openCount = (n.openLoops || []).filter((x) => x.status === "open").length;
    return `
      <div class="hp-reco">
        <div class="hp-section__muted">Last conversation highlights</div>
        <div style="margin-top:8px;">
          <div class="hp-kv"><div class="hp-kv__k">Last meeting date</div><div class="hp-kv__v">${escapeHtml(n.lastMeetingDate || "—")}</div></div>
          <div class="hp-kv"><div class="hp-kv__k">Theme</div><div class="hp-kv__v">${escapeHtml(n.theme || "—")}</div></div>
          <div class="hp-kv"><div class="hp-kv__k">Advisor confidence</div><div class="hp-kv__v">${escapeHtml(n.advisorConfidence || "—")}</div></div>
          <div class="hp-kv"><div class="hp-kv__k">Sentiment trend</div><div class="hp-kv__v">${escapeHtml(n.sentimentTrend || "—")}</div></div>
        </div>
        <ul style="margin:10px 0 0 18px; color: rgba(11,18,32,0.78);">
          ${(n.highlights || []).slice(0, 5).map((h) => `<li>${escapeHtml(h)}</li>`).join("\n")}
        </ul>
        <div style="margin-top:10px; display:flex; flex-wrap:wrap; gap:6px;">
          ${(n.softSignals || []).map((x) => `<span class="hp-pill">${escapeHtml(x)}</span>`).join("\n")}
          ${openCount ? `<span class="hp-pill" style="border-color: rgba(185,28,28,0.25);">Open loops: <strong>${openCount}</strong></span>` : ""}
        </div>
      </div>
    `;
  }

  function renderTimeline(s) {
    const events = [...(s.timeline || [])].sort((a, b) => (a.date < b.date ? 1 : -1));
    return `
      <div class="hp-timeline">
        ${events
          .map((e) => {
            return `
              <div class="hp-event">
                <div class="hp-event__date">${escapeHtml(e.date)}</div>
                <div>
                  <div class="hp-event__desc">${escapeHtml(e.desc)}</div>
                  <div class="hp-event__type">${escapeHtml(e.type)}</div>
                </div>
              </div>
            `;
          })
          .join("\n")}
      </div>
    `;
  }

  function renderRecommendedAction(s) {
    const a = s.recommendedAction;
    return `
      <div class="hp-reco">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap;">
          <div>
            <div style="font-weight:750;">${escapeHtml(a.title)}</div>
            <div class="hp-section__muted" style="margin-top:4px;">${escapeHtml(a.why)}</div>
          </div>
          <span class="hp-pill">Confidence: <strong>${escapeHtml(a.confidence)}</strong></span>
        </div>
        <div style="margin-top:10px;">
          <div class="hp-kv"><div class="hp-kv__k">Suggested owner</div><div class="hp-kv__v">${escapeHtml(a.owner)}</div></div>
          <div class="hp-kv"><div class="hp-kv__k">Suggested channel</div><div class="hp-kv__v">${escapeHtml(a.channel)}</div></div>
          <div class="hp-kv"><div class="hp-kv__k">Due-by</div><div class="hp-kv__v">${escapeHtml(a.dueBy)}</div></div>
        </div>
        <div class="hp-actions" style="margin-top:10px;justify-content:flex-start;">
          <button class="hp-action" data-reco-action="draft" type="button">Draft message</button>
          <button class="hp-action" data-reco-action="created" type="button">Mark task created</button>
          <button class="hp-action" data-reco-action="assign" type="button">Assign owner</button>
          <button class="hp-action is-danger" data-reco-action="snooze" type="button">Snooze 7 days</button>
        </div>
      </div>
    `;
  }

  function renderFiltersForm() {
    const majors = uniq(state.students.map((s) => s.profile.major)).sort();
    const years = uniq(state.students.map((s) => s.profile.classYear)).sort();
    const pathways = uniq(state.students.map((s) => s.profile.honorsPathway)).sort();
    const tags = uniq(state.students.flatMap((s) => s.profile.tags || [])).sort();
    const statuses = uniq(state.students.map((s) => s.workflow.status)).sort();

    els.filtersBody.innerHTML = `
      <div class="hp-filter-group">
        <div class="hp-filter-group__title">Quick filters</div>
        <div class="hp-filter-group__hint">Start here. Use Advanced only when you need it.</div>

        <div class="hp-field" style="margin-top:0;">
          <label>Milestones</label>
          <div class="hp-checkrow">
            ${toggle("Orientation incomplete", "orientationIncomplete", state.filters.orientationIncomplete)}
            ${toggle("Life Check overdue", "lifeCheckOverdue", state.filters.lifeCheckOverdue)}
            ${toggle("Graduation Check due", "gradCheckDue", state.filters.gradCheckDue)}
          </div>
        </div>

        <div class="hp-field">
          <label>Signals</label>
          <div class="hp-checkrow">
            ${toggle("Faculty alert", "facultyAlert", state.filters.facultyAlert)}
            ${toggle("Multiple no-shows", "multipleNoShows", state.filters.multipleNoShows)}
          </div>
        </div>

        <details class="hp-details">
          <summary>Thresholds (optional)</summary>
          <div class="hp-details__body">
            <div class="hp-field" style="margin-top:0;">
              <label for="f-nav">Navigate inactive &gt; X days</label>
              <input id="f-nav" type="number" min="0" placeholder="e.g., 21" value="${state.filters.navigateInactiveDays ?? ""}" />
            </div>
            <div class="hp-field">
              <label for="f-canvas">Canvas inactivity &gt; X days</label>
              <input id="f-canvas" type="number" min="0" placeholder="e.g., 14" value="${state.filters.canvasInactiveDays ?? ""}" />
            </div>
            <div class="hp-field">
              <label for="f-noresp">No response to outreach &gt; X days</label>
              <input id="f-noresp" type="number" min="0" placeholder="e.g., 10" value="${state.filters.noResponseDays ?? ""}" />
            </div>
            <div class="hp-field">
              <label>Pathway progress</label>
              <div class="hp-checkrow">
                ${toggle("Progress < 60%", "progressBelow60", state.filters.progressBelow60)}
              </div>
            </div>
          </div>
        </details>
      </div>

      <div class="hp-filter-group">
        <div class="hp-filter-group__title">Workflow</div>
        ${multiCheckGroup("Status", "workflowStatus", statuses)}
      </div>

      <details class="hp-details hp-details--advanced">
        <summary>Advanced student attributes</summary>
        <div class="hp-details__body">
          ${multiCheckGroup("Class year", "classYear", years)}
          ${multiCheckGroup("Major", "major", majors)}
          ${multiCheckGroup("Honors pathway", "pathway", pathways)}
          ${multiCheckGroup("Tags", "tags", tags)}
        </div>
      </details>
    `;

    function multiCheckGroup(title, key, values) {
      const selected = state.filters[key];
      return `
        <div class="hp-field">
          <label>${escapeHtml(title)}</label>
          <div class="hp-checkrow">
            ${values
              .map((v) => {
                const checked = selected instanceof Set && selected.has(v);
                return `
                  <label>
                    <input type="checkbox" data-filter-multi="${escapeAttr(key)}" value="${escapeAttr(v)}" ${checked ? "checked" : ""} />
                    <span>${escapeHtml(v)}</span>
                  </label>
                `;
              })
              .join("\n")}
          </div>
        </div>
      `;
    }
    function toggle(label, key, checked) {
      return `
        <label>
          <input type="checkbox" data-filter-toggle="${escapeAttr(key)}" ${checked ? "checked" : ""} />
          <span>${escapeHtml(label)}</span>
        </label>
      `;
    }
  }

  // ---------- events ----------
  function wireEvents() {
    els.navItems.forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-view");
        if (!v) return;
        state.activeView = v;
        renderAll();
      });
    });

    els.tabs.forEach((t) => {
      t.addEventListener("click", () => {
        state.activeBucket = t.getAttribute("data-bucket") || "Urgent";
        renderBucketTabs();
        renderDashboardQueue();
      });
    });

    els.search.addEventListener("input", () => {
      state.searchQuery = els.search.value;
      renderDashboardQueue();
      renderStudentsView();
      if (state.activeView === "insights") renderInsights();
    });

    els.onlyUrgent.addEventListener("change", () => {
      state.onlyUrgent = els.onlyUrgent.checked;
      renderAll();
    });

    els.filterBtn.addEventListener("click", openFilters);
    els.filtersClose.addEventListener("click", closeFilters);
    els.filtersBackdrop.addEventListener("click", closeFilters);
    els.applyFilters.addEventListener("click", () => {
      // Parse filter inputs from form
      const root = els.filtersBody;
      root.querySelectorAll("[data-filter-multi]").forEach((el) => {
        const key = el.getAttribute("data-filter-multi");
        if (!key) return;
        if (!(state.filters[key] instanceof Set)) state.filters[key] = new Set();
      });

      // reset sets
      for (const k of ["classYear", "major", "advisor", "pathway", "tags", "workflowStatus"]) {
        state.filters[k] = new Set();
      }

      root.querySelectorAll("input[type=checkbox][data-filter-multi]").forEach((cb) => {
        const key = cb.getAttribute("data-filter-multi");
        if (!key) return;
        if (cb.checked) state.filters[key].add(cb.value);
      });

      root.querySelectorAll("input[type=checkbox][data-filter-toggle]").forEach((cb) => {
        const key = cb.getAttribute("data-filter-toggle");
        if (!key) return;
        state.filters[key] = cb.checked;
      });

      const nav = root.querySelector("#f-nav");
      const canvas = root.querySelector("#f-canvas");
      const noresp = root.querySelector("#f-noresp");

      state.filters.navigateInactiveDays = nav && nav.value !== "" ? Number(nav.value) : null;
      state.filters.canvasInactiveDays = canvas && canvas.value !== "" ? Number(canvas.value) : null;
      state.filters.noResponseDays = noresp && noresp.value !== "" ? Number(noresp.value) : null;

      closeFilters();
      renderAll();
    });

    els.resetFilters.addEventListener("click", () => {
      const fresh = createDemoState();
      state.filters = fresh.filters;
      renderFiltersForm();
      toast("Filters reset.");
    });

    els.refreshBtn.addEventListener("click", () => {
      randomizeSignalsSlightly();
      state.lastUpdatedAt = new Date();
      renderAll();
      toast("Demo data refreshed.");
    });

    els.exportBtn.addEventListener("click", () => {
      const list =
        state.activeView === "dashboard" ? getVisibleStudents() : state.students.filter((s) => passesFilters(s, state.filters));
      downloadCsv(list);
    });

    els.createTaskBtn.addEventListener("click", () => {
      // For demo, open outreach modal for highest-risk visible student
      const visible = getVisibleStudents();
      const target = visible[0] || state.students.sort((a, b) => b._risk.score - a._risk.score)[0];
      if (!target) return;
      openOutreachModal(target.id);
    });

    // Drawer
    els.drawerClose.addEventListener("click", closeDrawer);
    els.drawerBackdrop.addEventListener("click", closeDrawer);

    // Outreach modal
    els.outreachClose.addEventListener("click", closeOutreachModal);
    els.outreachCancel.addEventListener("click", closeOutreachModal);
    els.outreachModal.addEventListener("click", (evt) => {
      if (evt.target === els.outreachModal) closeOutreachModal();
    });
    document.addEventListener("keydown", (evt) => {
      if (evt.key === "Escape") {
        closeDrawer();
        closeFilters();
        closeOutreachModal();
      }
    });

    els.outreachSave.addEventListener("click", () => saveOutreach("draft"));
    els.outreachSent.addEventListener("click", () => saveOutreach("sent"));
  }

  function wireStudentCardEvents(container) {
    container.querySelectorAll(".hp-student").forEach((card) => {
      const id = card.getAttribute("data-student-id");
      if (!id) return;

      // Open on card click (but not when clicking buttons)
      card.addEventListener("click", (evt) => {
        const t = /** @type {HTMLElement} */ (evt.target);
        if (t.closest("button")) return;
        openDrawer(id);
      });
      card.addEventListener("keydown", (evt) => {
        if (evt.key === "Enter" || evt.key === " ") {
          evt.preventDefault();
          openDrawer(id);
        }
      });

      card.querySelectorAll("button[data-action]").forEach((btn) => {
        btn.addEventListener("click", (evt) => {
          evt.stopPropagation();
          const action = btn.getAttribute("data-action");
          if (action === "view") openDrawer(id);
          if (action === "outreach") openOutreachModal(id);
          if (action === "reviewed") {
            // For demo: “reviewed” means it’s been looked at and can be monitored.
            snoozeStudent(id, 7);
            toast("Marked reviewed → Monitor next week (7-day snooze).");
          }
          if (action === "snooze") {
            snoozeStudent(id, 7);
            toast("Snoozed for 7 days.");
          }
          renderAll();
        });
      });
    });
  }

  function wireQueueEvents() {
    els.queues.querySelectorAll(".hp-queueitem").forEach((item) => {
      const id = item.getAttribute("data-student-id");
      if (!id) return;

      item.querySelectorAll("button[data-action]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.getAttribute("data-action");
          if (action === "open") openDrawer(id);
          if (action === "reassign") {
            const s = state.students.find((x) => x.id === id);
            const name = prompt("Reassign owner (demo):", s?.workflow.owner || "");
            if (name) updateWorkflow(id, { owner: name });
          }
          if (action === "status") {
            const s = state.students.find((x) => x.id === id);
            const next = prompt(
              "Change status (demo):\nNeeds review | Contact today | Waiting for student reply | Appointment booked | Monitor next week | Resolved",
              s?.workflow.status || "Needs review"
            );
            if (next) updateWorkflow(id, { status: next });
          }
          if (action === "snooze") snoozeStudent(id, 7);

          renderAll();
        });
      });
    });
  }

  // ---------- drawer/modals ----------
  function openDrawer(studentId) {
    state.selectedStudentId = studentId;
    els.drawerBackdrop.hidden = false;
    els.drawer.classList.add("is-open");
    els.drawer.setAttribute("aria-hidden", "false");
    renderStudentDrawer(studentId);
  }

  function closeDrawer() {
    state.selectedStudentId = null;
    els.drawerBackdrop.hidden = true;
    els.drawer.classList.remove("is-open");
    els.drawer.setAttribute("aria-hidden", "true");
  }

  function openFilters() {
    els.filtersBackdrop.hidden = false;
    els.filters.classList.add("is-open");
    els.filters.setAttribute("aria-hidden", "false");
  }

  function closeFilters() {
    els.filtersBackdrop.hidden = true;
    els.filters.classList.remove("is-open");
    els.filters.setAttribute("aria-hidden", "true");
  }

  function openOutreachModal(studentId) {
    const s = state.students.find((x) => x.id === studentId);
    if (!s) return;
    state.outreachDraftFor = studentId;

    const templateKey = s.recommendedAction?.template || "wellbeing";
    const tpl = outreachTemplates(s)[templateKey] || outreachTemplates(s).wellbeing;
    const reasonSummary = s._risk.reasons.slice(0, 3).join(" ");

    els.outreachBody.innerHTML = `
      <div class="hp-field">
        <label>Outreach type</label>
        <select id="o-type">
          <option value="email">Email</option>
          <option value="text">Text</option>
          <option value="call note">Call note</option>
        </select>
      </div>
      <div class="hp-field">
        <label>Subject</label>
        <input id="o-subject" type="text" value="${escapeAttr(tpl.subject)}" />
      </div>
      <div class="hp-field">
        <label>Message body</label>
        <textarea id="o-body">${escapeHtml(tpl.body)}</textarea>
      </div>
      <div class="hp-grid-2" style="grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 10px 0 0;">
        <div class="hp-field">
          <label>Suggested tone</label>
          <input id="o-tone" type="text" value="${escapeAttr(tpl.tone)}" />
        </div>
        <div class="hp-field">
          <label>Owner</label>
          <input id="o-owner" type="text" value="${escapeAttr(s.workflow.owner)}" />
        </div>
      </div>
      <div class="hp-grid-2" style="grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 10px 0 0;">
        <div class="hp-field">
          <label>Due date</label>
          <input id="o-due" type="date" value="${escapeAttr(s.recommendedAction?.dueBy || todayIso())}" />
        </div>
        <div class="hp-field">
          <label>Status</label>
          <select id="o-status">
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
          </select>
        </div>
      </div>
      <div class="hp-section" style="margin-top:10px; background:#fff;">
        <div class="hp-section__title">Reason summary</div>
        <div class="hp-section__muted">${escapeHtml(reasonSummary || "—")}</div>
        <div class="hp-section__muted" style="margin-top:8px;">
          Reminder: Outreach is recorded here for triage only. Scheduling remains in <strong>Navigate</strong>.
        </div>
      </div>
    `;

    els.outreachModal.hidden = false;
    els.outreachModal.setAttribute("aria-hidden", "false");
  }

  function closeOutreachModal() {
    state.outreachDraftFor = null;
    els.outreachModal.hidden = true;
    els.outreachModal.setAttribute("aria-hidden", "true");
  }

  function saveOutreach(status) {
    const id = state.outreachDraftFor;
    if (!id) return;
    const s = state.students.find((x) => x.id === id);
    if (!s) return;

    const type = /** @type {HTMLSelectElement} */ (document.getElementById("o-type"))?.value || "email";
    const subject = /** @type {HTMLInputElement} */ (document.getElementById("o-subject"))?.value || "";
    const body = /** @type {HTMLTextAreaElement} */ (document.getElementById("o-body"))?.value || "";
    const owner = /** @type {HTMLInputElement} */ (document.getElementById("o-owner"))?.value || s.workflow.owner;
    const due = /** @type {HTMLInputElement} */ (document.getElementById("o-due"))?.value || s.workflow.due;

    s.outreachHistory = s.outreachHistory || [];
    s.outreachHistory.unshift({ date: todayIso(), type, subject, status });

    if (status === "sent") {
      s.signals.outreachNoResponseDays = 1;
      updateWorkflow(id, { status: "Waiting for student reply", owner, due });
      s.timeline.unshift({ date: todayIso(), type: "Outreach", desc: `${type} sent: ${subject || "Outreach"}` });
      toast("Outreach marked sent.");
    } else {
      updateWorkflow(id, { status: "Needs review", owner, due });
      toast("Draft saved.");
    }

    closeOutreachModal();
    renderAll();
  }

  // ---------- filters/search ----------
  function passesFilters(s, f) {
    const p = s.profile;
    const ms = s.milestones;
    const sig = s.signals;

    if (f.classYear.size && !f.classYear.has(p.classYear)) return false;
    if (f.major.size && !f.major.has(p.major)) return false;
    if (f.advisor.size && !f.advisor.has(p.advisor)) return false;
    if (f.pathway.size && !f.pathway.has(p.honorsPathway)) return false;
    if (f.tags.size) {
      const st = new Set(p.tags || []);
      let ok = false;
      for (const t of f.tags) if (st.has(t)) ok = true;
      if (!ok) return false;
    }

    if (f.orientationIncomplete && ms.orientation?.status !== "incomplete") return false;
    if (f.lifeCheckOverdue && !(ms.lifeCheck1?.status === "overdue" || ms.lifeCheckAnnual?.status === "overdue")) return false;
    if (f.gradCheckDue && !["due_soon", "overdue"].includes(ms.gradCheck?.status)) return false;
    if (f.progressBelow60 && (ms.pathwayProgressPct ?? 100) >= 60) return false;

    if (f.facultyAlert && (sig.facultyAlerts || []).length === 0) return false;
    if (f.multipleNoShows && sig.noShows < 2) return false;

    if (typeof f.navigateInactiveDays === "number" && !(sig.lastNavigateActiveDays > f.navigateInactiveDays)) return false;
    if (typeof f.canvasInactiveDays === "number" && !(sig.canvasInactivityDays > f.canvasInactiveDays)) return false;
    if (typeof f.noResponseDays === "number" && !(sig.outreachNoResponseDays > f.noResponseDays)) return false;

    if (f.workflowStatus.size && !f.workflowStatus.has(s.workflow.status)) return false;

    return true;
  }

  function searchStudent(s, query) {
    const p = s.profile;
    const risk = s._risk;
    const hay = [
      p.fullName,
      p.preferredName,
      s.id,
      p.major,
      p.minor,
      p.classYear,
      p.advisor,
      p.honorsPathway,
      (risk.reasons || []).join(" "),
      (s.notesIntel?.highlights || []).join(" "),
      (s.signals.facultyAlerts || []).map((a) => a.reason).join(" "),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return hay.includes(query);
  }

  // ---------- helpers ----------
  function updateWorkflow(studentId, patch) {
    const s = state.students.find((x) => x.id === studentId);
    if (!s) return;
    s.workflow = { ...s.workflow, ...patch };
  }

  function snoozeStudent(studentId, days) {
    const s = state.students.find((x) => x.id === studentId);
    if (!s) return;
    // Snooze is simulated by moving to Monitor next week and extending due date
    s.workflow.status = "Monitor next week";
    s.workflow.due = addDaysIso(todayIso(), days);
  }

  function outreachTemplates(student) {
    const name = student.profile.preferredName || student.profile.fullName.split(" ")[0];
    return {
      life_check: {
        subject: "Honors Life Check — quick scheduling reminder",
        tone: "Warm + concise",
        body: `Hi ${name},\n\nI’m reaching out from the Honors College Student Actualization & Engagement team. Your next Life Check is due, and we want to make sure you have a plan for the semester and your Honors experience.\n\nNext step: please schedule a Life Check appointment in Navigate when you have a moment. If you’re not sure which option to pick, reply here and I can help.\n\nBest,\n${student.workflow.owner}`,
      },
      grad_check: {
        subject: "Honors Graduation Check — please confirm this week",
        tone: "Direct + supportive",
        body: `Hi ${name},\n\nA reminder that your Honors Graduation Check is due soon. This helps ensure your Honors requirements and graduation timeline are aligned.\n\nNext step: please book a Graduation Check appointment in Navigate. If you’ve already done this, reply with the date/time so I can update our records.\n\nThank you,\n${student.workflow.owner}`,
      },
      faculty_alert: {
        subject: "Quick check-in after a course engagement alert",
        tone: "Supportive + non-judgmental",
        body: `Hi ${name},\n\nI saw an engagement alert and wanted to check in. Sometimes Canvas activity drops for totally understandable reasons (illness, workload, tech issues).\n\nIf you’re comfortable sharing, what’s getting in the way right now? We can talk through a plan and connect you with campus resources if helpful.\n\nBest,\n${student.workflow.owner}`,
      },
      wellbeing: {
        subject: "Honors check-in",
        tone: "Supportive",
        body: `Hi ${name},\n\nJust a quick Honors check-in. We’re here to help you stay on track with your Honors milestones and connect you to resources that support your goals.\n\nIf you can, reply with (1) how the semester is going and (2) whether you’d like to meet in Navigate this week.\n\nBest,\n${student.workflow.owner}`,
      },
    };
  }

  function nextMilestoneText(ms) {
    const candidates = [];
    if (ms.orientation?.status === "incomplete") candidates.push({ label: "Orientation", due: ms.orientation.due || "" });
    if (ms.lifeCheck1?.status === "overdue") candidates.push({ label: "Life Check (required)", due: ms.lifeCheck1.due || "" });
    if (ms.lifeCheckAnnual?.status === "overdue") candidates.push({ label: "Annual Life Check", due: ms.lifeCheckAnnual.due || "" });
    if (ms.gradCheck?.status === "overdue") candidates.push({ label: "Graduation Check", due: ms.gradCheck.due || "" });
    if (ms.gradCheck?.status === "due_soon") candidates.push({ label: "Graduation Check", due: ms.gradCheck.due || "" });
    if (ms.lifeCheckAnnual?.status === "due_soon") candidates.push({ label: "Annual Life Check", due: ms.lifeCheckAnnual.due || "" });
    if (candidates.length === 0) return "—";
    const c = candidates[0];
    return c.due ? `${c.label} (${c.due})` : c.label;
  }

  function randomizeSignalsSlightly() {
    // Keep it calm: small, believable changes.
    for (const s of state.students) {
      const bump = (x, min, max) => clamp(x + randInt(-2, 3), min, max);
      s.signals.lastNavigateActiveDays = bump(s.signals.lastNavigateActiveDays, 0, 70);
      s.signals.canvasInactivityDays = bump(s.signals.canvasInactivityDays, 0, 30);
      if (s.signals.outreachNoResponseDays) s.signals.outreachNoResponseDays = bump(s.signals.outreachNoResponseDays, 0, 40);
    }
  }

  function downloadCsv(list) {
    const rows = [
      ["student_id", "name", "major", "class_year", "advisor", "risk_tier", "risk_score", "top_reasons", "workflow_status", "owner", "due"],
      ...list.map((s) => [
        s.id,
        s.profile.fullName,
        s.profile.major,
        s.profile.classYear,
        s.profile.advisor,
        s._risk.tier,
        String(s._risk.score),
        s._risk.reasons.slice(0, 2).join(" | "),
        s.workflow.status,
        s.workflow.owner,
        s.workflow.due,
      ]),
    ];
    const csv = rows.map((r) => r.map(csvCell).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `honors-pulse-export-${todayIso()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function openRecoButtonWiring() {
    // (intentionally left minimal; reco buttons are in drawer HTML)
  }

  function emptyState(text) {
    return `
      <div class="hp-section" style="background:#fff;">
        <div class="hp-section__muted">${escapeHtml(text)}</div>
      </div>
    `;
  }

  function toast(message) {
    // Minimal, calm toast using native alert-like pattern (but non-blocking)
    const el = document.createElement("div");
    el.textContent = message;
    Object.assign(el.style, {
      position: "fixed",
      bottom: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(11, 18, 32, 0.92)",
      color: "#fff",
      padding: "10px 12px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.12)",
      zIndex: 200,
      boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
      fontSize: "0.9rem",
      maxWidth: "92vw",
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1700);
  }

  function csvCell(v) {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
    return s;
  }

  function countBy(arr, fn) {
    /** @type {Record<string, number>} */
    const out = {};
    for (const x of arr) {
      const k = fn(x);
      out[k] = (out[k] || 0) + 1;
    }
    return out;
  }

  function uniq(arr) {
    return Array.from(new Set(arr.filter(Boolean)));
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  function escapeAttr(str) {
    return escapeHtml(str).replaceAll("`", "&#096;");
  }

  function formatDateTime(dt) {
    const d = new Date(dt);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function todayIso() {
    return new Date().toISOString().slice(0, 10);
  }

  function addDaysIso(iso, days) {
    const dt = new Date(iso + "T00:00:00");
    dt.setDate(dt.getDate() + days);
    return dt.toISOString().slice(0, 10);
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function randInt(min, maxExclusive) {
    return Math.floor(Math.random() * (maxExclusive - min)) + min;
  }
})();
