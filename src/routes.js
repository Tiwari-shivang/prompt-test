import React from "react";
import PotbModule from "./views/patOnTheBack/addNominee/Index";
import PotbRequests from "./views/patOnTheBack/viewRequests/Index";

const Profile = React.lazy(() => import("./views/profile/Index"));
const AdminDashboard = React.lazy(() => import("./views/dashboard/adminDashboard/Index"));
const HRDashboard = React.lazy(() => import("./views/dashboard/hrDashboard/Index"));
const EmployeeDashboard = React.lazy(() => import("./views/dashboard/employeeDashboard/Index"));
const PMDashboard = React.lazy(() => import("./views/dashboard/pmDashbaord/Index"));
const PMAccess = React.lazy(() => import("./views/dashboard/pmDashbaord/pmAccess/Index"));
const EmployeeRating = React.lazy(() =>
    import("./views/dashboard/pmDashbaord/pmAccess/emp-rating/Index")
);
const EmpRatingFeedback = React.lazy(() =>
    import("./views/dashboard/pmDashbaord/pmAccess/emp-rating/rating-feedback/Index")
);

const SkillsRating = React.lazy(() =>
    import("./views/dashboard/pmDashbaord/pmAccess/skills-rating/Index")
);
const SkillsRatingFeedback = React.lazy(() =>
    import("./views/dashboard/pmDashbaord/pmAccess/skills-rating/rating-feedback/Index")
);

const EmployeeList = React.lazy(() => import("./views/dashboard/list/employeeList/Index"));
const EmployeeTimesheet = React.lazy(() =>
    import("./views/commonComponent/employeeTimesheet/Index")
);
const ExportUtilData = React.lazy(() => import("./views/managementReporting/Index"));
const ProjectHealth = React.lazy(() => import("./views/projectHealth/index"));

const ResignationList = React.lazy(() => import("./views/dashboard/list/resignationList/Index"));
const JoineeList = React.lazy(() => import("./views/dashboard/list/newJoineeList/Index"));
const TopPerformerList = React.lazy(() => import("./views/dashboard/list/topPerformer/Index"));
const MentorList = React.lazy(() => import("./views/dashboard/list/mentorList/Index"));
const ShiftTimingList = React.lazy(() => import("./views/dashboard/list/shiftTiming/Index"));
const AddMember = React.lazy(() => import("./views/members/addMember/Index"));
const AddProject = React.lazy(() => import("./views/projects/addProject/Index"));
const AddUpcomingProject = React.lazy(() => import("./views/projects/addUpcomingProject/Index"));
const AddPhaseInProject = React.lazy(() => import("./views/projects/addPhaseInProject/Index"));
const AddTeamMember = React.lazy(() => import("./views/teamMembers/addTeamMember/Index"));
const UpdateTeamMember = React.lazy(() => import("./views/teamMembers/updateTeamMember/Index"));
const AddClient = React.lazy(() => import("./views/clients/addClient/Index"));
const AddContact = React.lazy(() => import("./views/contacts/addContact/Index"));
const UpdateContact = React.lazy(() => import("./views/contacts/updateContact/Index"));
const AddMultiContact = React.lazy(() => import("./views/contacts/addMultiContact/Index"));

const AddHexaviewBuzz = React.lazy(() => import("./views/commonComponent/hexaviewBuzz/Index"));
const DeleteHexaviewBuzz = React.lazy(() =>
    import("./views/commonComponent/hexaviewBuzz/manageHexaviewBuzz/Index")
);

const QuickAccess = React.lazy(() => import("./views/commonComponent/quickAccess/Index"));

const ClientDetail = React.lazy(() => import("./views/clients/clientDetail/Index"));
const AllClient = React.lazy(() => import("./views/clients/allClient/Index"));
const AllProject = React.lazy(() => import("./views/projects/allProject/Index"));
const ProjectDetail = React.lazy(() => import("./views/projects/projectDetail/Index"));
const Departments = React.lazy(() => import("./views/department/departments/Index"));
const BusinessUnit = React.lazy(() => import("./views/department/businessUnit/Index"));
const Directory = React.lazy(() => import("./views/department/directory/Index"));
const MemberList = React.lazy(() => import("./views/members/memberList/Index"));
const MemberDetail = React.lazy(() => import("./views/members/memberDetail/Index"));

const SelfService = React.lazy(() => import("./views/selfService/Index"));

const Resignation = React.lazy(() => import("./views/selfService/resignation/Index"));
const AddResignation = React.lazy(() =>
    import("./views/selfService/resignation/addResignation/Index")
);
const ResignationDetails = React.lazy(() =>
    import("./views/selfService/resignation/resignationDetails/Index")
);
const AllResignationHr = React.lazy(() =>
    import("./views/selfService/resignation/allResignationHr/Index")
);

const MyReferrals = React.lazy(() => import("./views/selfService/referrals/Index"));
const ReferralList = React.lazy(() => import("./views/helpDesk/hr/referrals/Index"));

const ITHelpDesk = React.lazy(() => import("./views/helpDesk/it/itHelpDesk/Index"));
const ItTickets = React.lazy(() => import("./views/helpDesk/it/allTickets/Index"));
const ItRaiseIssue = React.lazy(() => import("./views/helpDesk/it/raiseIssue/Index"));
const ItMyRequest = React.lazy(() => import("./views/helpDesk/it/myRequest/Index"));
const ItRequest = React.lazy(() => import("./views/helpDesk/it/request/Index"));

const HrHelpDesk = React.lazy(() => import("./views/helpDesk/hr/hrHelpDesk/Index"));
const HrTickets = React.lazy(() => import("./views/helpDesk/hr/allTickets/Index"));
const HrRaiseIssue = React.lazy(() => import("./views/helpDesk/hr/raiseIssue/Index"));
const HrMyRequest = React.lazy(() => import("./views/helpDesk/hr/myRequest/Index"));
const HrRequest = React.lazy(() => import("./views/helpDesk/hr/request/Index"));
const HrBugReports = React.lazy(() => import("./views/helpDesk/hr/bugReports/Index"));

const FinanceHelpDesk = React.lazy(() => import("./views/helpDesk/finance/financeHelpDesk/Index"));
const FinanceTickets = React.lazy(() => import("./views/helpDesk/finance/allTickets/Index"));
const FinanceRaiseIssue = React.lazy(() => import("./views/helpDesk/finance/raiseIssue/Index"));
const FinanceMyRequest = React.lazy(() => import("./views/helpDesk/finance/myRequest/Index"));
const FinanceRequest = React.lazy(() => import("./views/helpDesk/finance/request/Index"));

const TimesheetApproval = React.lazy(() =>
    import("./views/commonComponent/timesheetApproval/Index")
);

const AttendanceTimesheetTabular = React.lazy(() =>
    import("./views/attendance/timesheet/tabularView/Index")
);
const AttendanceTimesheetList = React.lazy(() =>
    import("./views/attendance/timesheet/listView/Index")
);
const AttendanceTimesheetCalendar = React.lazy(() =>
    import("./views/attendance/timesheet/calendarView/Index")
);

const ProjectAddTimesheet = React.lazy(() => import("./views/projects/addTimesheet/Index"));
const ProjectTimesheet = React.lazy(() => import("./views/projects/timesheet/Index"));
const ExportTimesheetData = React.lazy(() => import("./views/timesheet/exportTimesheetData/Index"));

const Leave = React.lazy(() => import("./views/leave/Index"));
const HrAccess = React.lazy(() => import("./views/dashboard/hrDashboard/hrAccess/Index"));
const Holidays = React.lazy(() => import("./views/leave/holidays/Index"));
const EditBankDetails = React.lazy(() => import("./views/commonComponent/editBankDetails/Index"));
const EditPersonalInformation = React.lazy(() =>
    import("./views/commonComponent/editPersonalInformation/Index")
);
const LeaveApplications = React.lazy(() => import("./views/leave/applications/Index"));
const MyRegularisationRequests = React.lazy(() =>
    import("./views/leave/regularisationRequests/Index")
);
const LeaveApprovalList = React.lazy(() =>
    import("./views/commonComponent/leaveApproval/leaveApprovalList/Index")
);
const PendingRequestsList = React.lazy(() =>
    import("./views/commonComponent/pendingrequests/pendingRequestsList/Index")
);
const RegularizationApproval = React.lazy(() =>
    import("./views/commonComponent/regularizationApproval/Index")
);
const HrFaqs = React.lazy(() => import("./views/commonComponent/hrFaqs/Index"));
const Faqs = React.lazy(() => import("./views/commonComponent/faqs/Index"));
const TraineeFeedback = React.lazy(() => import("./views/commonComponent/traineeFeedback/Index"));
const TraineeInfo = React.lazy(() =>
    import("./views/commonComponent/traineeFeedback/traineeInfo/Index")
);
const PlacementDriveLinedUpPage = React.lazy(() =>
    import("./views//dashboard/hrDashboard/hrAccess/placementDriveLinedUpPage/Index")
);
const RegularisationRequests = React.lazy(() =>
    import("./views/commonComponent/regularisationRequests/Index")
);
const QRCode = React.lazy(() => import("./views/authScreen/QrCode"));
const OTPVerify = React.lazy(() => import("./views/authScreen/OtpVerify"));
const AccessPanel = React.lazy(() => import("./views/accessPanel/Index"));
const AllFeedbacks = React.lazy(() => import("./views/managementReporting/feedback/Index"));
const ActiveProjects = React.lazy(() => import("./views/activeProjects/Index"));

const routes = [
    {path: "/", exact: true, name: "Home"},
    {path: "/activeProjects", name: "Home", element: ActiveProjects },
    {path: "/profile", name: "Profile", element: Profile},
    {path: "/dashboard/pmDashboard", name: "PM Dashboard", element: PMDashboard},
    {path: "/dashboard/pmAccess", name: "PM Access", element: PMAccess},
    {
        path: "/dashboard/employee-rating",
        name: "Employee Rating and Feedback",
        element: EmployeeRating,
    },
    {path: "/dashboard/ratingFeedback", name: "Rating and Feedback", element: EmpRatingFeedback},

    {path: "/dashboard/skills-rating", name: "Skills Rating and Feedback", element: SkillsRating},
    {
        path: "/dashboard/skillsRatingFeedback",
        name: "Rating and Feedback",
        element: SkillsRatingFeedback,
    },

    {path: "/dashboard/adminDashboard", name: "Admin Dashboard", element: AdminDashboard},
    {path: "/dashboard/hrDashboard", name: "HR Dashboard", element: HRDashboard},
    {path: "/dashboard/employeeDashboard", name: "Employee Dashboard", element: EmployeeDashboard},
    {path: "/dashboard/employeeList", name: "Employee List", element: EmployeeList},
    {path: "/employeeTimesheet", name: "Employee Timesheet", element: EmployeeTimesheet},
    {path: "/exportTimesheetData", name: "Export Timesheet Data", element: ExportTimesheetData},
    {path: "/exportUtilization", name: "Employee Timesheet", element: EmployeeTimesheet},
    {path: "/exportUtilizationData", name: "Resource Planning", element: ExportUtilData},
    {path: "/projectHealth", name: "Project Health", element: ProjectHealth},
    {path: "/allFeedbacks", name: "All Feedbacks", element: AllFeedbacks},
    {path: "/patOnTheBack", name: "All Pat On The Backs", element: PotbModule},
    {path: "/patOnTheBackRequests", name: "Pat On The Back Requests", element: PotbRequests},

    {path: "/dashboard/resignationList", name: "Resignation List", element: ResignationList},

    {path: "/dashboard/topPerformerList", name: "Top Performer List", element: TopPerformerList},
    {path: "/hrAccess/shifttiming", name: "Shift Timing List", element: ShiftTimingList},
    {path: "/dashboard/mentorList", name: "Mentor List", element: MentorList},
    {path: "/dashboard/joineeList", name: "Joinee List", element: JoineeList},

    {path: "/dashboard/addHexaviewBuzz", name: "Add Hexaview Buzz", element: AddHexaviewBuzz},
    {
        path: "/dashboard/manageHexaviewBuzz",
        name: "Manage Hexaview Buzz",
        element: DeleteHexaviewBuzz,
    },
    {
        path: "/dashboard/updateHexaviewBuzz/:id",
        name: "Update Hexaview Buzz",
        element: AddHexaviewBuzz,
    },

    {path: "/hrAccess/quickAccess", name: "Quick Access", element: QuickAccess},
    {path: "/hrAccess/editBankDetails", name: "Edit Bank Details", element: EditBankDetails},
    {
        path: "/hrAccess/editPersonalInformation",
        name: "EditPersonalInformation",
        element: EditPersonalInformation,
    },
    {path: "/hrAccess/faqs", name: "FAQs", element: HrFaqs},

    {
        path: "/regularizationApproval",
        name: "Regularization Approval",
        element: RegularizationApproval,
    },

    {path: "/leavetracker", name: "Leave Tracker", element: Leave},

    {path: "/TimesheetApproval", name: "Employee Timesheet", element: TimesheetApproval},

    {path: "/TimesheetApproval", name: "Employee Approval", element: TimesheetApproval},

    {path: "/attendance/timesheet/listView", name: "Timesheet", element: AttendanceTimesheetList},
    {
        path: "/attendance/timesheet/calendarView",
        name: "Timesheet",
        element: AttendanceTimesheetCalendar,
    },
    {
        path: "/attendance/timesheet/tabularView",
        name: "Timesheet",
        element: AttendanceTimesheetTabular,
    },

    {path: "/holidays", name: "Holidays", element: Holidays},
    {path: "/leaveApplications", name: "Leave Applications", element: LeaveApplications},
    {
        path: "/regularisationRequests",
        name: "Regularisation Requests",
        element: MyRegularisationRequests,
    },

    {path: "/leaveApprovalList", name: "Leave Applications", element: LeaveApprovalList},
    {path: "/pendingRequestsList", name: "Pending Requests", element: PendingRequestsList},

    {path: "/members/addMember", name: "Add Member", element: AddMember},
    {path: "/members/memberList", name: "Member List", element: MemberList},
    {path: "/members/updateMember/:id", name: "Update Member", element: AddMember},
    {path: "/members/memberDetail/:id", name: "Member Detail", element: MemberDetail},
    {path: "/clients/allClient", name: "All Client", element: AllClient},
    {path: "/clients/addClient", name: "Add Client", element: AddClient},
    {path: "/contacts/addMultiContact/:id", name: "Add Multi Contact", element: AddMultiContact},
    {path: "/contacts/addContact/:id", name: "Add Contact", element: AddContact},
    {path: "/contacts/updateContact/:id", name: "Update Contact", element: UpdateContact},
    {path: "/clients/updateClient/:id", name: "Update Client", element: AddClient},
    {path: "/clients/clientDetail/:id", name: "Client Detail", element: ClientDetail},

    {path: "/projects/addProject", name: "Add Project", element: AddProject},
    {
        path: "/projects/addUpcomingProject",
        name: "Add Upcoming Project",
        element: AddUpcomingProject,
    },
    {
        path: "/projects/addPhaseInProject/:id/:mode",
        name: "Add Phase In Project",
        element: AddPhaseInProject,
    },
    {path: "/projects/updateProject/:id", name: "UpdateProject", element: AddProject},
    {path: "/projects/allProject", name: "All Project", element: AllProject},
    {path: "/projects/projectDetail/:id", name: "Project Detail", element: ProjectDetail},
    {path: "/projects/addTimesheet", name: "Project Timesheet", element: ProjectAddTimesheet},
    {path: "/projects/timesheet", name: "Project Timesheet", element: ProjectTimesheet},
    {
        path: "/teamMember/addTeamMember/:id/:phaseId",
        name: "Add Team Member",
        element: AddTeamMember,
    },
    {
        path: "/teamMember/updateTeamMember/:id",
        name: "Update Team Member",
        element: UpdateTeamMember,
    },
    {path: "/department/departments", name: "Departments", element: Departments},
    {path: "/department/businessUnit", name: "BusinessUnit", element: BusinessUnit},
    {path: "/department/directory", name: "Directory", element: Directory},

    {path: "/selfService", name: "Self Service", element: SelfService},
    {path: "/selfService/resignation", name: "Resignation", element: Resignation},
    {
        path: "/selfService/resignation/resignationDetails",
        name: "Resignation Details",
        element: ResignationDetails,
    },
    {
        path: "/hrAccess/resignation/allResignation",
        name: "Resignation Hr",
        element: AllResignationHr,
    },

    {
        path: "/selfService/resignation/addResignation",
        name: "Add Resignation",
        element: AddResignation,
    },

    {path: "/selfService/referral/referralList", name: "Referral List", element: MyReferrals},

    {path: "/helpDesk/it/itHelpDesk", name: "IT Help Desk", element: ITHelpDesk},
    {path: "/helpDesk/it/allTickets", name: "All Tickets", element: ItTickets},
    {path: "/helpDesk/it/raiseIssue", name: "Raise Issue", element: ItRaiseIssue},
    {path: "/helpDesk/it/myRequest", name: "My Request", element: ItMyRequest},
    {path: "/helpDesk/it/request", name: "My Request", element: ItRequest},
    {path: "/helpDesk/it/request/:id", name: "My Request", element: ItRequest},

    {path: "/helpDesk/hr/hrHelpDesk", name: "HR Help Desk", element: HrHelpDesk},
    {path: "/helpDesk/hr/allTickets", name: "All Tickets", element: HrTickets},
    {path: "/helpDesk/hr/raiseIssue", name: "Raise Issue", element: HrRaiseIssue},
    {path: "/helpDesk/hr/myRequest", name: "My Request", element: HrMyRequest},
    {path: "/helpDesk/hr/request", name: "My Request", element: HrRequest},
    {path: "/helpDesk/hr/request/:id", name: "My Request", element: HrRequest},
    {path: "/helpDesk/hr/bugReports", name: "Bug Reports", element: HrBugReports},
    {path: "/helpDesk/hr/referrals", name: "Referrals", element: ReferralList},
    {path: "/helpDesk/hr/faqs", name: "FAQs", element: Faqs},

    {
        path: "/helpDesk/finance/financeHelpDesk",
        name: "Finance Help Desk",
        element: FinanceHelpDesk,
    },
    {path: "/helpDesk/finance/allTickets", name: "All Tickets", element: FinanceTickets},
    {path: "/helpDesk/finance/raiseIssue", name: "Raise Issue", element: FinanceRaiseIssue},
    {path: "/helpDesk/finance/myRequest", name: "My Request", element: FinanceMyRequest},
    {path: "/helpDesk/finance/request", name: "My Request", element: FinanceRequest},
    {path: "/helpDesk/finance/request/:id", name: "My Request", element: FinanceRequest},

    {path: "/hrAccess", name: "HR Access", element: HrAccess},
    {
        path: "/hrAccess/placementDriveLinedUp",
        name: "Placement Drive",
        element: PlacementDriveLinedUpPage,
    },
    {path: "/hrAccess/traineeFeedback", name: "Trainee Feedback", element: TraineeFeedback},
    {path: "/hrAccess/traineeInfo/:id", name: "Trainee Info", element: TraineeInfo},
    {
        path: "/pmAccess/regularisationRequests",
        name: "Regularisation Requests",
        element: MyRegularisationRequests,
    },
    {path: "/login/qrcode", name: "QR Code", element: QRCode},
    {path: "/login/otpVerify", name: "OTP Verify", element: OTPVerify},
    {path: "/accessPanel", name: "Access Panel", element: AccessPanel},
];

export default routes;
