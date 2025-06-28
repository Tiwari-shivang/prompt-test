const commonAccess = [
  "leaveTracker", 
  "selfService", 
  "memberList", 
  "departments", 
  "directory",
  "allProject"
];

const SuperAdmin = [
  "adminDashboard",
  "addMember",
  "addProject",
  "addClient",
  "allClient",
  "allTicket",
  "accessToEdit",
  "accessToEdit-Admin-HR"
];

const Admin = [
  "adminDashboard",
  "addMember",
  "addProject",
  "itHelpDesk", 
  "addClient",
  "allClient",
  "allTicket",
  "accessToEdit",
  "accessToEdit-Admin-HR"
]
const HrRoles = [
    "hrDashboard",
    "hrAccess",
    "addMember",
    "addProject",
    "accessToEdit",
    "accessToEdit-HR",
    "accessToEdit-Admin-HR"
  ];
const PmRoles = [
    "pmDashboard",
    "pmAccess",
    "accessToEdit"
  ];

const Employee = [
    "EmployeeDashboard",
  ];

const ItAdmin = [
    "EmployeeDashboard",
    "allTicket",
    "adminFilter"
  ];

const rules = {
  "Super_Admin": [...SuperAdmin, ...commonAccess],
  "Admin": [...Admin, ...commonAccess],
  "BU_Head": [...Admin, ...commonAccess],
  "HR_Admin": [...HrRoles, ...commonAccess],
  "HR_User": [...HrRoles, ...commonAccess],
  "User": [...Employee, ...commonAccess],
  "Reporting_Managers": [...PmRoles, ...commonAccess],
  "Senior_PM": [...PmRoles, ...commonAccess],
  "IT_Admin": [...ItAdmin, ...commonAccess],
  "Finance_Admin": [...HrRoles, ...commonAccess],
};

export default rules;
