import React from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import AddClient from "../assets/icons/addClient.svg";
import AddMember from "../assets/icons/addMember.svg";
import AddProject from "../assets/icons/addProject.svg";
import Admin from "../assets/icons/admin.svg";
import AllClient from "../assets/icons/allClient.png";
import AllProject from "../assets/icons/allProject.svg";
import Department from "../assets/icons/department.svg";
import Directory from "../assets/icons/directory.svg";
import Employee from "../assets/icons/employee.svg";
import Hr from "../assets/icons/hr.svg";
import MemberList from "../assets/icons/memberList.svg";
import Pm from "../assets/icons/pm.svg";
import SelfService from "../assets/icons/selfService.svg";
import { authRoleState, authState } from "../recoil/authRecoil";
import { powerBiPagesState } from "../recoil/powerBi";
import RoleAccess from "../utilits/RoleAccess";
import { useSetRecoilState } from "recoil";

const handleDashboardDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector(".nav-group-items").classList.toggle("show");
};

const handleDropdownClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector(".nav-group-lists").classList.toggle("show");
};

export const SidebarNav = () => {
    const getRole = useRecoilValue(authRoleState);
    const empDetail = useRecoilValue(authState);
    const accessList = empDetail && empDetail.module_names;
    const authRoles = getRole && getRole?.Role;
    const [params] = useSearchParams();
    const reportType = params.get("reportType");
    const pages = useRecoilValue(powerBiPagesState);
    const setPowerBiPages = useSetRecoilState(powerBiPagesState); 
    const handlePageClick = (pageName) => {
        const page = pages.find((page) => page.displayName === pageName);
        if (page) {
            setPowerBiPages([page]); // Set the selected page to Recoil state to load the report
        }
    };
    return (
        <>
            {RoleAccess(authRoles, "adminDashboard") ? (
                <>
                <li className="nav-item" style={{ marginBottom: '6px'}}>
                    <NavLink className="nav-link" to="/dashboard/adminDashboard">
                        <img src={Admin} className="nav-icon" />
                        Dashboard
                    </NavLink>
                </li>
                {pages.map((page, index) => {
                    console.log("page", page);
                        return (
                            <li className="nav-item" style={{ paddingLeft: "49px" }} key={index}>
                                <NavLink
                                    className="nav-link"
                                    style={{
                                        backgroundColor: reportType === page.name ? '#276ffa' : '#fff',
                                        color: reportType === page.name ? '#fff' : '#000',
                                        whiteSpace: "nowrap",
                                    }}
                                    to={`/dashboard/adminDashboard?reportType=${page.name}`}
                                >
                                    {page.displayName}
                                </NavLink>
                            </li>
                        );
                    })}
                </>
            ) : (
                ""
            )}
            {RoleAccess(authRoles, "hrDashboard") ? (
                <li className="nav-item">
                    <NavLink className="nav-link" to="/dashboard/hrDashboard">
                        <img src={Hr} className="nav-icon" />
                        Dashboard
                    </NavLink>
                </li>
            ) : (
                ""
            )}
            {RoleAccess(authRoles, "hrAccess") ? (
                <li className="nav-item">
                    <NavLink className="nav-link" to="/hrAccess">
                        <img src={Hr} className="nav-icon" />
                        Hr Access
                    </NavLink>
                </li>
            ) : (
                ""
            )}
            {RoleAccess(authRoles, "EmployeeDashboard") ? (
                <li className="nav-item">
                    <NavLink className="nav-link" to="/dashboard/employeeDashboard">
                        <img src={Employee} className="nav-icon" />
                        Dashboard
                    </NavLink>
                </li>
            ) : (
                ""
            )}
            {RoleAccess(authRoles, "pmDashboard") ? (
                <li className="nav-item">
                    <NavLink className="nav-link" to="/dashboard/pmDashboard">
                        <img src={Pm} className="nav-icon" />
                        Dashboard
                    </NavLink>
                </li>
            ) : (
                ""
            )}
            {/* {RoleAccess(authRoles, "pmAccess") ? (
                <li className="nav-item">
                    <NavLink className="nav-link" to="/dashboard/pmAccess">
                        <img src={Pm} className="nav-icon" />
                        PM Access
                    </NavLink>
                </li>
            ) : (
                ""
            )} */}
            {/* {!RoleAccess(authRoles, "EmployeeDashboard") ? (
                <li className="nav-item">
                    <NavLink className="nav-link" to="/selfService">
                        <img src={SelfService} className="nav-icon" />
                        Self Service
                    </NavLink>
                </li>
            ) : (
                ""
            )} */}
            {/* {!RoleAccess(authRoles, "EmployeeDashboard") ? (
                <li className="nav-group">
                    <div className="nav-link nav-group-toggle" onClick={handleDashboardDropdown}>
                        <img src={SelfService} className="nav-icon" />
                        Attendance
                    </div>
                    <ul className="nav-group-items ps-1">
                        <li className="nav-item ps-5">
                            <NavLink
                                className="nav-link subMenu"
                                to="/attendance/timesheet/listView"
                            >
                                List View
                            </NavLink>
                        </li>
                        <li className="nav-item ps-5">
                            <NavLink
                                className="nav-link subMenu"
                                to="/attendance/timesheet/tabularView"
                            > */}
                                {/* <img src={SelfService} className="nav-icon" /> */}
                                {/* Tabular View
                            </NavLink>
                        </li>
                        <li className="nav-item ps-5">
                            <NavLink
                                className="nav-link subMenu"
                                to="/attendance/timesheet/calendarView"
                            > */}
                                {/* <img src={SelfService} className="nav-icon" /> */}
                                {/* Calendar View
                            </NavLink>
                        </li>
                    </ul>
                </li>
            ) : (
                ""
            )} */}
            {/* <li className="nav-item">
                <NavLink className="nav-link" to="/employeeTimesheet">
                    <img src={SelfService} className="nav-icon" />
                    Timesheet
                </NavLink>
            </li>  */}
            {(accessList && accessList.includes("Timesheet Submit")) ||
            (accessList && accessList.includes("Timesheet Approval")) ? (
                <li className="nav-group">
                    <div className="nav-link nav-group-toggle" onClick={handleDropdownClick}>
                        <img src={SelfService} className="nav-icon" />
                        Timesheet
                    </div>
                    <ul className="nav-group-lists ps-1">
                        {accessList && accessList.includes("Timesheet Submit") ? (
                            <li className="nav-item subMenu ps-5">
                                <NavLink className="nav-link " to="/employeeTimesheet">
                                    {/* <img src={SelfService} className="nav-icon" /> */}
                                    Timesheet
                                </NavLink>
                            </li>
                        ) : (
                            ""
                        )}
                        {accessList && accessList.includes("Timesheet Approval") ? (
                            <li className="nav-item subMenu ps-5">
                                <NavLink className="nav-link " to="/TimesheetApproval">
                                    {/* <img src={SelfService} className="nav-icon" /> */}
                                    Timesheet Approval
                                </NavLink>
                            </li>
                        ) : (
                            ""
                        )}
                        {accessList && accessList.includes("PROJECT MANAGEMENT") ? (
                            <li className="nav-item subMenu ps-5">
                                <NavLink className="nav-link " to="/exportTimesheetData">
                                    {/* <img src={SelfService} className="nav-icon" /> */}
                                     Timesheet Data
                                </NavLink>
                            </li>
                        ) : (
                            ""
                        )}
                    </ul>
                </li>
            ) : (
                ""
            )}
            {/* {!RoleAccess(authRoles, "EmployeeDashboard") ? (
                <li className="nav-item">
                    <NavLink className="nav-link" to="/leavetracker">
                        <img src={SelfService} className="nav-icon" />
                        Leave Tracker
                    </NavLink>
                </li>
            ) : (
                ""
            )} */}
            {accessList && accessList.includes("PROJECT MANAGEMENT") ? (
                <>
                    <li className="nav-title">Project Management</li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/exportUtilizationData">
                            <img src={AllClient} className="nav-icon imgIcons" />
                            Resource Planning
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/projectHealth">
                            <img src={AllClient} className="nav-icon imgIcons" />
                            Project Health
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className="nav-link" to="/activeProjects">
                            <img src={AllClient} className="nav-icon imgIcons" />
                            Active Projects
                        </NavLink>
                    </li>
                    {/* <li className="nav-item">
                        <NavLink className="nav-link" to="/patOnTheBack">
                            <img src={AllClient} className="nav-icon imgIcons" />
                            Add POTB Nominee
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/patOnTheBackRequests">
                            <img src={AllClient} className="nav-icon imgIcons" />
                            POTB Requests
                        </NavLink>
                    </li> */}
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/leaveApprovalList">
                            <img src={AllClient} className="nav-icon imgIcons" />
                            Leave Approval
                        </NavLink>
                    </li>
                </>
            ) : (
                ""
            )}
            {accessList &&
            accessList.includes("Add Project") &&
            (authRoles == "BU_Head" || authRoles == "Admin") ? (
                <li className="nav-item">
                    <NavLink className="nav-link" to="/projects/addProject">
                        <img src={AddProject} className="nav-icon" />
                        Import Data
                    </NavLink>
                </li>
            ) : (
                ""
            )}
            {accessList &&
            accessList.includes("All Project") &&
            (authRoles == "BU_Head" || authRoles == "Admin") ? (
                <li className="nav-item">
                    <NavLink className="nav-link" to="/projects/allProject">
                        <img src={AllProject} className="nav-icon" />
                        All Project
                    </NavLink>
                </li>
            ) : (
                ""
            )}
            
            {RoleAccess(authRoles, "itHelpDesk") ? (
                <>
                    <li className="nav-title">Help Desk</li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/helpDesk/it/itHelpDesk">
                            <img src={AllClient} className="nav-icon imgIcons" />
                            IT Help Desk
                        </NavLink>
                    </li>
                </>
            ) : (
                ""
            )}
            {RoleAccess(authRoles, "itHelpDesk") ? (
                <li className="nav-item">
                    <NavLink className="nav-link" to="/helpDesk/it/allTickets">
                        <img src={AllClient} className="nav-icon imgIcons" />
                        All Tickets
                    </NavLink>
                </li>
            ) : (
                ""
            )} */}
            {(accessList && accessList.includes("Add Member")) && (authRoles=="BU_Head" || authRoles=="Admin")? (
                <>
                    <li className="nav-title">Member</li>
                    {accessList && accessList.includes("Add Member") && (authRoles=="BU_Head" || authRoles=="Admin" )? (
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/members/addMember">
                                <img src={AddMember} className="nav-icon" />
                                Import Data
                            </NavLink>
                        </li>
                    ) : (
                        ""
                    )}
                </>
            ) : (
                ""
            )}
            {accessList &&
            accessList.includes("Member List") &&
            (authRoles == "BU_Head" || authRoles == "Admin") ? (
                <li className="nav-item">
                    <NavLink aria-current="page" className="nav-link" to="/members/memberList">
                        <img src={MemberList} className="nav-icon" />
                        Member List
                    </NavLink>
                </li>
            ) : (
                ""
            )}{" "}
            {accessList && accessList.includes("Admin Screen") ? (
                <>
                    <li className="nav-title">Access Management</li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/accessPanel">
                            <img src={Department} className="nav-icon" />
                            Access Management
                        </NavLink>
                    </li>
                </>
            ) : (
                ""
            )}
            {/* {(accessList && accessList.includes("Departments")) ||
            (accessList && accessList.includes("Business Unit")) ||
            (accessList && accessList.includes("Directory")) ? (
                <>
                    <li className="nav-title">Department</li>
                    {accessList && accessList.includes("Departments") ? (
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/department/departments">
                                <img src={Department} className="nav-icon" />
                                Departments
                            </NavLink>
                        </li>
                    ) : (
                        ""
                    )}
                </>
            ) : (
                ""
            )} */}
            {/* {accessList && accessList.includes("Business Unit") ? (
                <li className="nav-item">
                    <NavLink className="nav-link" to="/department/businessUnit">
                        <img src={Department} className="nav-icon" />
                        BusinessUnit
                    </NavLink>
                </li>
            ) : (
                ""
            )}
            {accessList && accessList.includes("Directory") ? (
                <li className="nav-item">
                    <NavLink className="nav-link" to="/department/directory">
                        <img src={Directory} className="nav-icon" />
                        Directory
                    </NavLink>
                </li>
            ) : (
                ""
            )} */}
            {/* {(accessList && accessList.includes("Add Project")) ||
            (accessList && accessList.includes("All Project")) ? (
                <>
                    <li className="nav-title">Project management</li>
                    
                </>
            ) : (
                ""
            )} */}
            {/* {!RoleAccess(authRoles, "EmployeeDashboard") ? (
                <li className="nav-item">
                    <NavLink className="nav-link" to="/projects/addUpcomingProject">
                        <img src={AllProject} className="nav-icon" />
                        Add Upcoming Project
                    </NavLink>
                </li>
            ) : (
                ""
            )} */}
           
            {(accessList && accessList.includes("All Clients")) ||
            (accessList && accessList.includes("All Clients")) ? (
                <>
                    <li className="nav-title">Client</li>
                    {accessList && accessList.includes("All Clients") ? (
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/clients/allClient">
                                <img src={AllClient} className="nav-icon imgIcons" />
                                All Clients
                            </NavLink>
                        </li>
                    ) : (
                        ""
                    )}
                </>
            ) : (
                ""
            )}
            {accessList && accessList.includes("Add Client") ? (
                <li className="nav-item">
                    <NavLink className="nav-link" to="/clients/addClient">
                        <img src={AddClient} className="nav-icon" />
                        Import Data
                    </NavLink>
                </li>
            ) : (
                ""
            )}
            {/* {RoleAccess(authRoles, "itHelpDesk") ? (
                <>
                    <li className="nav-title">HR Helpdesk</li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/helpDesk/hr/hrHelpDesk">
                            <img src={AllClient} className="nav-icon imgIcons" />
                            HR Help Desk
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/helpDesk/hr/allTickets">
                            <img src={AllClient} className="nav-icon imgIcons" />
                            HR - All Tickets
                        </NavLink>
                    </li>

                    <li className="nav-title">Finance Helpdesk</li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/helpDesk/finance/financeHelpDesk">
                            <img src={AllClient} className="nav-icon imgIcons" />
                            Finance Help Desk
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="helpDesk/finance/allTickets">
                            <img src={AllClient} className="nav-icon imgIcons" />
                            Finance - All Tickets
                        </NavLink>
                    </li>
                </>
            ) : (
                ""
            )} */}
        </>
    );
};
