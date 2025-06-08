import React, {useState} from "react";
import {Col, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {FaUserAlt} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import LeaveHolidays from "../../../assets/images/emp/Leave-Holidays.svg";
import leave from "../../../assets/images/emp/leave.svg";
import {useGetPendingLeaves} from "../../../query/leave/allLeaves/allLeavesQuery";
import {useUpdateLeaveStatus} from "../../../query/leave/updateLeaves/updateLeavesQuery";
import {
    useGetAllEmployeeByProjectId,
    useGetAllProjectofMangerbyId,
} from "../../../query/projects/allProjects/allProjectsQuery";
import {authState} from "../../../recoil/authRecoil";
import BirthdayCard from "../../commonComponent/birthdayCard/Index";
import HexaviewBuzz from "../../commonComponent/hexaviewBuzzSlider/Index";
import LeaveApproval from "../../commonComponent/leaveApproval/Index";
import ListOfEmployee from "../../commonComponent/listOfEmployee/Index";
import ListOfMentees from "../../commonComponent/listOfMentees/Index";
import NewJoinee from "../../commonComponent/newJoinee/Index";
import PendingRequests from "../../commonComponent/pendingrequests/Index";
import QuickAccess from "../../commonComponent/quickAccess/Index";
import TodoList from "../../commonComponent/todoList/Index";
import TopPerformer from "../../commonComponent/topPerformer/Index";
import UpcomingHolidays from "../../commonComponent/upcomingHolidays/Index";
import WeatherAttendance from "../../commonComponent/weatherAttendance/Index";
import WorkAnniversary from "../../commonComponent/workAnniversary/Index";
import Attendance from "../../commonComponent/attendance/Index";
import "./style.scss";
import LeaveApply from "../../commonComponent/leaveApply/Index";
import {useGetMembersById} from "../../../query/members/allMembers/allMembersQuery";
import CommonHeading from "../commonHeading/Index";
import Loader from "../../widgets/loader/Loader";
import AssignedProjects from "../../commonComponent/assignedProjects/Index";
import CertificatesCard from "../../commonComponent/certificatesCard/Index";
const MemberDetail = () => {
    const navigate = useNavigate();
    const empDetail = useRecoilValue(authState);

    const [projectUuid, setProjectUuid] = useState("");
    const {mutateAsync: updateLeaveMutateAsync} = useUpdateLeaveStatus();
    const {
        data: getByIdDetails,
        isLoading: MemberData,
        refetch,
    } = useGetMembersById(empDetail && empDetail.uuid);
    const {data: allProjectByManager} = useGetAllProjectofMangerbyId(empDetail && empDetail.uuid);
    const {data: allEmpPerProject, isLoading: isLoadingAllEmpPerProject} =
        useGetAllEmployeeByProjectId(projectUuid);
    const {data: allPendingLeaves} = useGetPendingLeaves(empDetail?.user_uuid);

    const selectAllProjectId = (e) => {
        setProjectUuid(e.target.value);
    };
    const handleOnApprove = (id) => {
        const val = {
            "id": id,
            "status": "Approved",
        };
        updateLeaveMutateAsync(val);
    };
    const handleOnCancel = (id) => {
        const val = {
            "id": id,
            "status": "Rejected",
        };
        updateLeaveMutateAsync(val);
    };
    const listOfTeamMembersCol = [
        {
            dataField: "profile",
            text: "Name",
            headerStyle: () => ({
                textAlign: "center",
            }),
            formatter: (cellContent, row) => (
                <div className="projectManager">
                    <div
                        className="projectManagerPic ms-3"
                        onClick={() => navigate(`/members/memberDetail/${row.id}`)}
                    >
                        {row && row.profile_picture ? (
                            <img src={row.profile_picture} alt="" />
                        ) : (
                            <FaUserAlt className="userIcon" />
                        )}
                    </div>
                    <div
                        className="projectManagerName"
                        onClick={() => navigate(`/members/memberDetail/${row.id}`)}
                    >
                        <p>
                            <span>
                                {row.first_name} {row.last_name}
                            </span>{" "}
                            {row.designation_name}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            dataField: "position",
            text: "Position",
            headerStyle: () => ({
                textAlign: "center",
            }),
            formatter: (cellContent, row) => (
                <div className="position d-flex justify-content-center">
                    <OverlayTrigger
                        placement="bottom"
                        delay={{show: 250, hide: 250}}
                        overlay={<Tooltip id="button-tooltip">{row.designation_name}</Tooltip>}
                    >
                        <div className="newJoineePosition">{row.designation_short_form}</div>
                    </OverlayTrigger>
                </div>
            ),
        },
        // {
        //     dataField: "",
        //     text: "Check in Time",
        // },
        // {
        //     dataField: "",
        //     text: "Skill set",
        //     formatter: (cellContent, row) => (
        //         <div className="ActionIcon">
        //             <a className="acceptIcon">Edit</a>
        //         </div>
        //     ),
        // },
    ];

    return (
        <div className="memberDetail">
            <Row>
                <CommonHeading />
                <Col xs={12} sm={6} className="px-2 mb-3">
                    <AssignedProjects />
                </Col>
                <Col xs={12} sm={6} className="px-2 mb-3">
                    <CertificatesCard />
                </Col>

                {/* <Col xs={12} lg={8} className="px-2">
                    <div className="employee-Leave-Holiday cardShadow">
                        <div className="employeeSection">
                            <div className="img">
                                <img src={leave} alt="" />
                            </div>
                            <div className="detail">
                                <p>
                                    <span>{allProjectByManager?.length}</span>
                                </p>
                                <p>Project</p>
                            </div>
                        </div>
                        <div className="employeeSection">
                            <div className="img">
                                <img src={leave} alt="" />
                            </div>
                            <div className="detail">
                                <p>
                                    <span>37</span>
                                </p>
                                <p>Total Task</p>
                            </div>
                        </div>
                        <div className="employeeSection">
                            <div className="img">
                                <img src={LeaveHolidays} alt="" />
                            </div>
                            <div className="detail">
                                <p>
                                    <span>14</span>
                                </p>
                                <p>Progress task</p>
                            </div>
                        </div>
                    </div>
                </Col> */}
                <Col xs={12} sm={12} className="px-2 mb-3">
                    <LeaveApply />
                </Col>
                <Col sm={6} xs={12} md={6} lg={4} xl={6} className="px-2 mb-3">
                    <LeaveApproval />
                </Col>
                {/* 
                <Col xs={12} sm={4} className="px-2 mb-3 mb-lg-0">
                    <WeatherAttendance />
                </Col>
                <Col xs={12} sm={12} md={12} lg={8} xl={9} className="px-2 mb-3">
                    <HexaviewBuzz />
                </Col>
				<Col xs={12} sm={12} md={6} lg={4} xl={3} className="px-2 mb-3">
                    <ListOfEmployee />
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xl={3} className="px-2 mb-3">
                    <div className="projectSummary cardShadow">
                        <div className="titleSection">
                            <div className="cardCustomTitle">List Of Team Members</div>
                            <div className="list-of-project my-3">
                                <select
                                    placeholder="Project*"
                                    className="form-control"
                                    onChange={(e) => selectAllProjectId(e)}
                                >
                                    <option value="" >Select Project</option>
                                    {allProjectByManager &&
                                        allProjectByManager.map(({uuid, project_name}) => (
                                            <option key={uuid} value={uuid}>
                                                {project_name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <div className="summaryTable">
                            <BootstrapTable
                                keyField="uuid"
                                data={allEmpPerProject ? allEmpPerProject : []}
                                columns={listOfTeamMembersCol}
                                noDataIndication={
                                    isLoadingAllEmpPerProject ? (
                                        <p>
                                            <Loader />
                                        </p>
                                    ) : allEmpPerProject && !allEmpPerProject.length ? (
                                        "No Employees Found"
                                    ) : (
                                        ""
                                    )
                                }
                                condensed
                                bordered={false}
                            />
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xl={3} className="px-2 mb-3">
                    <LeaveApproval />
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xl={3} className="px-2 mb-3">
                    <TopPerformer />
                </Col>
                <Col xs={12} sm={6} lg={4} xl={3} className="px-2 mb-3 ">
                    <QuickAccess />
                </Col>
                <Col xs={12} sm={6} lg={4} xl={3} className="px-2 mb-3 ">
                    <NewJoinee />
                </Col>
                <Col xs={12} sm={6} lg={4} xl={3} className="px-2 mb-3 ">
                    <ListOfMentees />
                </Col>
                <Col xs={12} sm={6} lg={4} xl={3} className="px-2 mb-3 ">
                    <Attendance />
                </Col>
                <Col xs={12} sm={6} lg={4} xl={3} className="px-2 mb-3">
                    <UpcomingHolidays />
                </Col>
				<Col xs={12} sm={12} md={6} lg={4} xl={3} className="px-2 mb-3">
                    <BirthdayCard />
                </Col>
                <Col xs={12} sm={6} lg={4} xl={3} className="px-2 mb-3">
                    <WorkAnniversary />
                </Col>
                <Col xs={12} sm={6} lg={4} xl={3} className="px-2 mb-3">
                    <TodoList />
                </Col>
                <Col xs={12} sm={6} lg={4} xl={3} className="px-2 mb-3">
                    <PendingRequests />
                </Col> */}
            </Row>
        </div>
    );
};

export default MemberDetail;
