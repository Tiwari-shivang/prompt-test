import {AutoComplete} from "antd";
import "antd/dist/antd.css";
import Moment from "moment";
import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {useForm} from "react-hook-form";
import {BsXCircleFill, BsCheckCircleFill} from "react-icons/bs";
import {FaDownload, FaEdit, FaTrashAlt, FaUndo} from "react-icons/fa";
import {useRecoilValue} from "recoil";
import Breadcrumb from "../../components/Breadcrumb";

import {
    useCreateUpdateDeleteProjectTeamMembers,
    useGetAllProjects,
    useGetChangeHistoryOfEmployee,
    useGetProjectResourcesByPmUuid,
    useGetProjectResourcesByProjectUuid,
    useGetProjectResourcesBySpmUuid,
    useGetResourceUtilizationReport,
    useGetRm,
    useGetSearchProjectResource,
    useGetTeamMemberProjectInfoByEmpUuid,
} from "../../query/attendance/attendanceQuery";
import {useGetEmpUuidListBySkillUuid} from "../../query/employee/allEmployeeQuery";
import {useAddMembersInProjectPhase} from "../../query/members/addMembers/addMembersQuery";
import {
    useGetMembersByEmpName,
    useGetMembersBySkillName,
} from "../../query/members/allMembers/allMembersQuery";
import {
    useGetAllProjectofMangerbyId,
    useGetEmployeeUtilizationByEmpUuid,
} from "../../query/projects/allProjects/allProjectsQuery";
import {useGetShiftTiming} from "../../query/shiftTiming/shiftTimingQuery";
import {authRoleState, authState} from "../../recoil/authRecoil";
import {convert24Hourto12Hour, formatDate} from "../../utilits/usefulFunctions";
import {requiredField} from "../../utilits/validation";
import {Input} from "../widgets/formComponents/Input";
import Loader from "../widgets/loader/Loader";
import "./style.scss";
import FeedbackModule from "./feedback/Index.js";
import {useNavigate} from "react-router-dom";
import {toaster} from "../../utilits/toast.js";

const Index = () => {
    const {
        reset,
        watch,
        register,
        handleSubmit,
        formState: {errors, isValid},
    } = useForm({
        mode: "onChanged",
    });
    const navigate = useNavigate();
    const getRole = useRecoilValue(authRoleState);
    const userRole = getRole && getRole.Role;
    const empDetails = useRecoilValue(authState);
    const accessList = empDetails && empDetails.module_names;
    const [modeOfSearch, setModeOfSearch] = useState("");
    const [modeOfSearchTemp, setModeOfSearchTemp] = useState("");
    const [shiftTimingUuid, setShiftTimingUuid] = useState(null);
    const [empNameTyped, setEmpNameTyped] = useState(""); // partial name typed in search box
    const [skillNameTyped, setSkillNameTyped] = useState(""); // partial skill typed in search box
    const [rmUuid, setRmUuid] = useState(userRole == "Reporting_Managers" ? empDetails?.uuid : ""); //uuid of RM under current senior PM. defaults to cuurent Rm's UUID
    const [reportInfo, setReportInfo] = useState({
        startDate: "",
        endDate: "",
        employeeUuid: empDetails && empDetails.uuid,
    });
    const [empBySearchUuid, setEmpBySearchUuid] = useState(""); //Employee UUID chosen after search dropdown
    const [skillBySearchUuid, setSkillBySearchUuid] = useState(""); //Employee UUID chosen after search dropdown
    const [fullEmpName, setFullEmpName] = useState(""); //full Employee Name after search from dropdown
    const [fullSkillName, setFullSkillName] = useState(""); //full Skill Name after search from dropdown
    const [empForInfoUuid, setEmpForInfoUuid] = useState(""); //Employee info UUID
    const [moreTableUuid, setMoreTableUuid] = useState(""); //state to show data in More table.
    const [projectUuidDropdown, setProjectUuidDropdown] = useState(""); //project dropdown UUID`
    const [isMoreTableVisible, setIsMoreTableVisible] = useState(false);
    const [moreTableData, setMoreTableData] = useState(false);
    const [newProjectInfoJson, setNewProjectInfoJson] = useState({
        allocation: 0,
        billable: 0,
        role: "",
    });
    const [editJson, setEditJson] = useState({});
    const [editJsonRole, setEditJsonRole] = useState({});
    const [addProjectJson, setAddProjectJson] = useState([]);
    const [addProjectJsonToDisplay, setAddProjectJsonToDisplay] = useState([]);
    const [deleteProjectJson, setDeleteProjectJson] = useState([]);
    const [comment, setComment] = useState("");
    const FeedbackModal = React.lazy(() => import("../modals/addProjectFeedback/Index.js"));

    const empNameInputChangeHandler = (value) => {
        setEmpNameTyped(value);
        setModeOfSearchTemp("search");
    };

    const skillNameInputChangeHandler = (value) => {
        setSkillNameTyped(value);
        setEmpNameTyped("");
        reset({
            rmSelectDropdown: "",
            projectDropdown: "",
        });
        setModeOfSearchTemp("skill");
    };

    const rmFromDropdownSelectHandler = (uuid) => {
        if (uuid == "") return;
        setModeOfSearchTemp("dropdown");
        setEmpForInfoUuid("");
        setEmpNameTyped("");
        setSkillNameTyped("");
        setRmUuid(uuid);
        reset({
            projectDropdown: "",
        });
    };

    const projectDropdownChangeHandler = (projectUuid) => {
        setModeOfSearchTemp("project");
        setEmpNameTyped("");
        setProjectUuidDropdown(projectUuid);
        reset({
            rmSelectDropdown: "",
            projectDropdown: projectUuid,
        });
        setSkillNameTyped("");
    };

    useEffect(() => {
        if (userRole == "Reporting_Managers") refetchProjectResourcesByPmUuidDropdown();
    }, [userRole == "Reporting_Managers"]);

    const showClickHandler = () => {
        setModeOfSearch(modeOfSearchTemp);
        if (modeOfSearchTemp === "dropdown") {
            refetchProjectResourcesByPmUuidDropdown();
            setEmpBySearchUuid("");
            setSkillNameTyped("");
            reset({
                searchEmpName: "",
                searchSkillName: "",
                projectDropdown: "",
            });
        } else if (modeOfSearchTemp === "search" && empBySearchUuid) {
            reset({
                rmSelectDropdown: "",
                searchEmpName: fullEmpName,
                projectDropdown: "",
            });
            setSkillNameTyped("");
            refetchProjectResourceByEmpSearch();
        } else if (modeOfSearchTemp === "project") {
            reset({
                rmSelectDropdown: "",
                searchEmpName: "",
                searchSkillName: "",
                projectDropdown: projectUuidDropdown,
            });
            setSkillNameTyped("");
            refetchProjectResourcesByProjectIdDropdown();
        } else if (modeOfSearchTemp === "skill" && skillBySearchUuid) {
            reset({
                rmSelectDropdown: "",
                searchEmpName: "",
                projectDropdown: "",
            });
            setEmpNameTyped("");
            refetchMembersListBySkillSearch();
        }
        setEditJson({});
        setEditJsonRole({});
        setDeleteProjectJson([]);
        setAddProjectJson([]);
        setAddProjectJsonToDisplay([]);
        removeGetEmployeeHistory();
        setEmpForInfoUuid("");
        setIsMoreTableVisible(false);
        removeTeamMemberProjectInfo();
    };

    const moreTableColumn = [
        {
            dataField: "activity",
            text: "Activity",
            sort: true,
        },
        {
            dataField: "oldValue",
            text: "Old Value",
            sort: true,
        },
        {
            dataField: "newValue",
            text: "New Value",
            sort: true,
        },
        {
            dataField: "dateOfChange",
            text: "Date and time of Change",
            formatter: (cellContent, row, index, extraData) =>
                formatDate(Moment(cellContent).format("YYYY-MM-DD")) +
                ", " +
                convert24Hourto12Hour(Moment(cellContent).format("HH:mm")),
        },
        // {
        //     text: "testing",
        //     formatter: (cellContent, row, index, extraData) => JSON.stringify(row),
        // },
        {
            dataField: "changedBy",
            text: "Changed By",
            sort: true,
        },
    ];

    const startDate = watch("startDate");
    const {
        data: projectsBySpmUuid,
        isLoading: isLoadingProjectsBySpmUuid,
    } = useGetProjectResourcesBySpmUuid(empDetails?.uuid);

    const {data: allprojectsData} = useGetAllProjects();

    const empSearchClickListener = (uuid, name) => {
        setEmpBySearchUuid(uuid);
        setFullEmpName(name);
        setEmpNameTyped(name);
        reset({
            searchEmpName: name,
            rmSelectDropdown: "",
            projectDropdown: "",
        });
    };

    const skillSearchClickListener = (uuid, name) => {
        setSkillBySearchUuid(uuid);
        setFullSkillName(name);
        setSkillNameTyped(name);
        reset({
            searchEmpName: name,
            rmSelectDropdown: "",
            projectDropdown: "",
        });
    };

    const {data: allProjectByManager} = useGetAllProjectofMangerbyId(
        userRole == "Reporting_Managers" ? empDetails?.uuid : ""
    );
    const {
        data: projectResourcesByPmUuid,
        isLoading: isLoadingProjectResourcesByPmUuid,
        refetch: refetchProjectResourcesByPmUuidDropdown,
    } = useGetProjectResourcesByPmUuid({
        pmUuid: rmUuid,
    });

    const {data: empUuidListBySkill, isLoading: isLoadingEmpBySkillUuidList} =
        useGetEmpUuidListBySkillUuid(skillBySearchUuid);

    const {
        data: membersListBySkillSearch,
        refetch: refetchMembersListBySkillSearch,
    } = useGetEmployeeUtilizationByEmpUuid(empUuidListBySkill);

    const {
        data: projectResourcesByProjectId,
        isLoading: isLoadingProjectResourcesByProjectId,
        refetch: refetchProjectResourcesByProjectIdDropdown,
    } = useGetProjectResourcesByProjectUuid(projectUuidDropdown);

    const {
        data: projectResourceByEmpName,
        isLoading: isLoadingProjectResourceByEmpUuid,
        refetch: refetchProjectResourceByEmpSearch,
    } = useGetSearchProjectResource(empBySearchUuid);

    const {
        data: projectInfoOfCurrentEmp,
        refetch: refetchProjectInfoOfCurrentEmp,
        remove: removeTeamMemberProjectInfo,
    } = useGetTeamMemberProjectInfoByEmpUuid(empForInfoUuid);

    const {
        data: getEmployeeHistory,
        isLoading: isLoadingGetEmployeeHistory,
        refetch: refetchGetEmployeeHistory,
        remove: removeGetEmployeeHistory,
    } = useGetChangeHistoryOfEmployee(moreTableUuid);

    const {
        mutateAsync: createUpdateDeleteProjectTeamMembersMutateAsync,
        isLoading: isLoadingCreateUpdateDeleteProjectTeamMembers,
    } = useCreateUpdateDeleteProjectTeamMembers(
        refetchProjectInfoOfCurrentEmp,
        refetchGetEmployeeHistory,
        modeOfSearch === "project"
            ? refetchProjectResourcesByProjectIdDropdown
            : modeOfSearch === "search"
            ? refetchProjectResourceByEmpSearch
            : modeOfSearch === "dropdown"
            ? refetchProjectResourcesByPmUuidDropdown
            : ""
    );

    const {data: report, isLoading: isLoadingReport} = useGetResourceUtilizationReport(reportInfo);

    const {mutateAsync: addTeamMemberMutateAsync, isLoading: isLoadingAddTeamMember} =
        useAddMembersInProjectPhase();
    const {
        data: searchResultByEmpName,
        isLoading: isSearchResultByEmpNameLoading,
        refetch: refetchProjectResourcesByEmpName,
        status: getMembersByEmpNameStatus,
        error: getMembersByEmpNameStatusError,
    } = useGetMembersByEmpName(empNameTyped, empDetails.uuid ?? "");

    const {
        data: searchResultBySkillName,
        isLoading: isSearchResultBySkillNameLoading,
        refetch: refetchProjectResourcesBySkillName,
        status: getMembersBySkillNameStatus,
        error: getMembersBySkillNameStatusError,
    } = useGetMembersBySkillName(skillNameTyped);

    const {data: rmList, isLoading: isLoadingRmList} = useGetRm(empDetails?.uuid);
    const {data: shiftTimingList, isLoading: isLoadingShiftTimingList} = useGetShiftTiming(
        empDetails?.uuid
    );
    useEffect(() => {
        if (empForInfoUuid) {
            refetchProjectInfoOfCurrentEmp();
            removeGetEmployeeHistory();
            setMoreTableUuid(empForInfoUuid);
            setIsMoreTableVisible(true);
        }
    }, [empForInfoUuid]);

    useEffect(() => {
        if (moreTableUuid) {
            refetchGetEmployeeHistory();
            setIsMoreTableVisible(true);
        }
    }, [moreTableUuid]);

    useEffect(() => {
        if (getEmployeeHistory && getEmployeeHistory.length > 0) {
            const recentTimesheetData = [];
            getEmployeeHistory.map((currElement, index) => {
                const objToPush = [
                    {
                        key: (recentTimesheetData.length ?? 0) * 4 + Number(1),
                        activity: "Billable %",
                        oldValue: currElement?.old_billable,
                        newValue: currElement?.new_billable,
                        dateOfChange: currElement?.billable_last_changed,
                        changedBy: currElement?.billable_changed_by,
                    },
                    {
                        key: (recentTimesheetData.length ?? 0) * 4 + Number(2),
                        activity: "Allocation %",
                        oldValue: currElement?.old_allocation,
                        newValue: currElement?.new_allocation,
                        dateOfChange: currElement?.allocation_last_changed,
                        changedBy: currElement?.allocation_changed_by,
                    },
                    {
                        key: (recentTimesheetData.length ?? 0) * 4 + Number(3),
                        activity: "Project Name",
                        oldValue: currElement?.allocation_old_project,
                        newValue: currElement?.allocation_new_project,
                        dateOfChange: currElement?.project_start_date,
                        changedBy:
                            currElement?.billable_old_pm || currElement?.allocation_changed_by,
                    },
                    {
                        key: (recentTimesheetData.length ?? 0) * 4 + Number(4),
                        activity: "Project Manager",
                        oldValue: currElement?.allocation_old_pm,
                        newValue: currElement?.allocation_new_pm,
                        dateOfChange: currElement?.project_start_date,
                        changedBy:
                            currElement?.billable_old_pm || currElement?.allocation_changed_by,
                    },
                ];

                recentTimesheetData.push(...objToPush);
            });
            setMoreTableData(recentTimesheetData);
        }
    }, [getEmployeeHistory]);

    useEffect(() => {
        if (report != undefined) {
            var mediaType =
                "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
            var userInp = report && report;
            var a = document.createElement("a");
            a.href = mediaType + userInp;
            a.download = "Resource Planning Utilization Data.xlsx";
            a.textContent = "Download file!";
            document.body.appendChild(a);
            a.click();
            setReportInfo({});
        }
    }, [report && report]);

    const exportReport = (data) => {
        setReportInfo({...data, employeeUuid: empForInfoUuid});
    };

    const editClickHandler = (uuid, presentAllocation, presentBillability, presentRole) => {
        let temp = {...editJson};
        let tempRole = {...editJsonRole};

        temp[`${uuid}`] = [presentAllocation, presentBillability];
        tempRole[`${uuid}`] = presentRole;
        setEditJson({...temp});
        setEditJsonRole({...tempRole});
    };

    const inputChangeForEditListener = (teamMemberUuid, mode, value) => {
        setEditJson((prev) => {
            if (mode == "billable") prev[`${teamMemberUuid}`][1] = Number(value);
            if (mode == "allocation") prev[`${teamMemberUuid}`][0] = Number(value);
            if (mode == "end_date") prev[`${teamMemberUuid}`][2] = value;
            return prev;
        });
        setEditJsonRole((prev) => {
            const temp = {...prev};
            if (mode == "role") temp[`${teamMemberUuid}`] = value;
            return {...temp};
        });
    };

    const inputChangeForNewRowListener = (mode, value) => {
        setNewProjectInfoJson((prev) => {
            const temp = {...prev};
            if (value == 0) temp[mode] = "0";
            else if (value == "") delete temp[mode];
            else
                temp[mode] =
                    mode === "project"
                        ? JSON.parse(value) // If project, parse the string.
                        : value;
            return temp;
        });
    };

    const crossClickHandler = (uuid) => {
        let temp = {...editJson};
        let tempRole = {...editJsonRole};
        delete temp[`${uuid}`];
        delete tempRole[`${uuid}`];
        setEditJson({...temp});
        setEditJsonRole({...tempRole});
        refetchProjectInfoOfCurrentEmp();
    };

    const membersCol = [
        {
            dataField: "employee_name",
            text: "Employee Name",
            style: {
                textAlign: "start",
            },
            sort: true,
                    },
        {
            dataField: "billability ",
            text: "Billability %",
                    },
        {
            dataField: "allocation",
            text: "Allocation %",
                    },
        {
            dataField: "utilization",
            text: "Utilization %",
                    },
        {
            dataField: "project_with_start_Date",
            text: "Projects",
            formatExtraData: modeOfSearch,
            formatter: (cellContent, row, index, extraData) =>
                extraData !== "project"
                    ? cellContent
                        ? Object.keys(cellContent)?.map(
                              (key, index) =>
                                  `${key}${
                                      Object.keys(cellContent).length - 1 != index ? ", " : ""
                                  }`
                          )
                        : ""
                    : row?.project &&
                      row?.project?.map(
                          (key, index) => `${key}${row?.project?.length - 1 != index ? ", " : ""}`
                      ),
        },
        {
            dataField: "skills",
            text: "Skills",
            formatExtraData: modeOfSearch,
            formatter: (cellContent, row, index, extraData) =>
                cellContent ? cellContent[0] : "N/A",
        },
        {
            dataField: "is_certified",
            text: `Certified for ${fullSkillName}`,
            hidden: modeOfSearch != "skill",
            formatter: (cellContent, row, index, extraData) =>
                cellContent ? (
                    <BsCheckCircleFill className="tickIcon" />
                ) : (
                    <BsXCircleFill className="crossIcon" />
                ),
        },
        // {
        //     // for testing
        //     datafield: "asdff",
        //     text: "Testing",
        //     formatter: (cellContent, row, index, extraData) => JSON.stringify(row),
        // },
        {
            dataField: "a1s2d3f4_dummy",
            text: "Allocated Since",
            formatExtraData: modeOfSearch,
            formatter: (cellContent, row, index, extraData) =>
                (row?.allocated_since && formatDate(row?.allocated_since)) ||
                (row?.project_with_start_Date &&
                    formatDate(
                        new Date(
                            Math.min(
                                ...Object.values(row?.project_with_start_Date).map(
                                    (a) => new Date(a)
                                )
                            )
                        )
                            .toISOString()
                            .slice(0, 10)
                    )) ||
                "N/A",
        },
    ];

    const removeAddedProjectClickHandler = (teamMemberUuid) => {
        setAddProjectJson((prev) => {
            const temp = prev.filter(({uuid}) => uuid !== teamMemberUuid);
            return [...temp];
        });
        setAddProjectJsonToDisplay((prev) => {
            const temp = prev.filter(({uuid}) => uuid !== teamMemberUuid);
            return [...temp];
        });
    };

    const deleteExistingProjectClickHandler = (teamMemberUuid) => {
        setDeleteProjectJson((prev) => {
            const temp = [...prev, teamMemberUuid];
            return [...temp];
        });
    };

    const undoDeleteProjectClickHandler = (teamMemberUuid) => {
        setDeleteProjectJson((prev) => {
            const temp = prev.filter((uuid) => uuid != teamMemberUuid);
            return [...temp];
        });
    };

    const addNewClickHandler = () => {
        if (newProjectInfoJson.allocation % 1 != 0) {
            toaster("error", "allocation% cannot be a decimal value");
            return;
        } else if (newProjectInfoJson.billable % 1 != 0) {
            toaster("error", "billable% cannot be a decimal value");
            return;
        }
        const val = {
            "uuid": newProjectInfoJson?.project?.uuid,
            "phase": newProjectInfoJson?.project?.current_phase_value,
            "phase_uuid": newProjectInfoJson?.project?.current_phase_uuid,
            "is_shadow": newProjectInfoJson?.is_shadow,
            "member_start_working_date":
                newProjectInfoJson.member_start_working_date ||
                new Date().toISOString().slice(0, 10),
            "end_date": newProjectInfoJson.end_date,
            "is_active": true,
            "allocation": newProjectInfoJson.allocation,
            "role": newProjectInfoJson?.role,
            "billable": newProjectInfoJson.billable,
            "employee_uuid": empForInfoUuid,
        };
        const valToDisplay = {
            "isNewProject": true,
            "uuid": newProjectInfoJson?.project?.uuid, //key
            "project_name": newProjectInfoJson?.project?.project_name,
            "member_start_working_date":
                newProjectInfoJson.member_start_working_date ||
                new Date().toISOString().slice(0, 10),
            "is_shadow": newProjectInfoJson?.is_shadow,
            "end_date": newProjectInfoJson.end_date,
            "allocation": newProjectInfoJson.allocation,
            "role": newProjectInfoJson?.role,
            "billable": newProjectInfoJson.billable,
        };

        setAddProjectJson((prev) => {
            const temp = [...prev, {...val}];
            setNewProjectInfoJson({
                allocation: 1,
                billable: 0,
            });
            return temp;
        });
        setAddProjectJsonToDisplay((prev) => {
            const temp = [...prev, {...valToDisplay}];
            return temp;
        });
        const addInputFields = document.getElementsByClassName("addNewInputFields");
        addInputFields[0].value = "";
        addInputFields[1].value = "";
        addInputFields[2].value = "";
        addInputFields[3].value = "";
        addInputFields[4].value = "";
        addInputFields[5].value = "";
    };

    const editAllocationCol = [
        {
            dataField: "project_name",
            text: `Project Name`,
            formatExtraData: editJson,
            formatter: (cellContent, row) =>
                row?.isNewRow ? (
                    <div className="projectNameCol">
                        <select
                            className="form-control addNewInputFields"
                            onChange={(e) => {
                                e.preventDefault();
                                inputChangeForNewRowListener("project", e?.target?.value);
                            }}
                        >
                            <option key="0" value="">
                                Select New Project
                            </option>
                            {allprojectsData &&
                                allprojectsData
                                    .filter(
                                        // Remove projects from the dropdown that are already present in the table
                                        ({uuid}) =>
                                            [
                                                ...projectInfoOfCurrentEmp?.map(
                                                    ({project_uuid}) => project_uuid
                                                ),
                                                ...addProjectJsonToDisplay?.map(({uuid}) => uuid),
                                            ].includes(uuid) === false
                                    )
                                    .sort((a, b) => (a.project_name < b.project_name ? -1 : 1))
                                    ?.map(
                                        ({
                                            uuid,
                                            project_name,
                                            current_phase_uuid,
                                            current_phase_value,
                                        }) => (
                                            <option
                                                key={uuid}
                                                value={JSON.stringify({
                                                    uuid,
                                                    project_name,
                                                    current_phase_uuid,
                                                    current_phase_value,
                                                })}
                                            >
                                                {project_name}
                                            </option>
                                        )
                                    )}
                        </select>
                    </div>
                ) : (
                    <>{cellContent}</>
                ),
        },
        {
            dataField: "billable_asdf",
            text: "Billability %",
            formatExtraData: editJson,
            formatter: (cellContent, row, index, extraData) =>
                (extraData && extraData[`${row?.uuid}`]) || row?.isNewRow ? (
                    <div className="inputFieldCol ">
                        <input
                            min={0}
                            max={100}
                            step={5}
                            className="form-control numberInput addNewInputFields"
                            name="newProjectAddInput1"
                            type="number"
                            defaultValue={row?.isNewRow ? "" : row?.billable}
                            onChange={({target: {value}}) => {
                                if (row?.isNewRow) inputChangeForNewRowListener("billable", value);
                                else inputChangeForEditListener(row?.uuid, "billable", value);
                            }}
                        />
                    </div>
                ) : (
                    <>{row.billable || 0}</>
                ),
        },
        {
            dataField: "allocation_asdf",
            text: "Allocation %",
            formatExtraData: editJson,
            formatter: (cellContent, row, index, extraData) =>
                (extraData && extraData[`${row?.uuid}`]) || row?.isNewRow ? (
                    <div className="inputFieldCol justify-content-left">
                        <input
                            min={0}
                            step={5}
                            className="form-control numberInput addNewInputFields"
                            name="newProjectAddInput2"
                            type="number"
                            defaultValue={row?.isNewRow ? "" : row?.allocation}
                            onChange={({target: {value}}) => {
                                if (row?.isNewRow)
                                    inputChangeForNewRowListener("allocation", value);
                                else inputChangeForEditListener(row?.uuid, "allocation", value);
                            }}
                        />
                    </div>
                ) : (
                    <>{row?.allocation}</>
                ),
        },
        {
            dataField: "role_asdf",
            text: "Role",
            formatExtraData: editJson,
            formatter: (cellContent, row, index, extraData) =>
                (extraData && extraData[`${row?.uuid}`] && row?.role != "Project Manager") ||
                row?.isNewRow ? (
                    <div className="inputFieldCol d-flex justify-content-left">
                        <select
                            className="form-control addNewInputFields"
                            onChange={({target: {value}}) =>
                                row?.isNewRow
                                    ? inputChangeForNewRowListener("role", value)
                                    : inputChangeForEditListener(row?.uuid, "role", value)
                            }
                            defaultValue={row?.role}
                        >
                            <option key="1" value="">
                                Select Role
                            </option>
                            <option key="2" value="Backend Developer">
                                Backend Developer
                            </option>
                            <option key="3" value="Backend Lead">
                                Backend Lead
                            </option>
                            <option key="4" value="Business Analyst">
                                Business Analyst
                            </option>
                            <option key="5" value="DevOps">
                                DevOps
                            </option>
                            <option key="7" value="Data Engineer">
                                Data Engineer
                            </option>
                            <option key="8" value="Frontend Developer">
                                Frontend Developer
                            </option>
                            <option key="10" value="Full Stack Developer">
                                Full Stack Developer
                            </option>
                            <option key="11" value="Project Manager">
                                Project Manager
                            </option>
                            <option key="12" value="Quality Analyst">
                                Quality Analyst
                            </option>
                            <option key="13" value="UX Designer">
                                UX Designer
                            </option>
                            <option key="14" value="Project Lead">
                                Project Lead
                            </option>
                        </select>
                    </div>
                ) : (
                    <>{row?.role || "N/A"}</>
                ),
        },
        // {
        //     text: `testing`,
        //     dataField: "isNewProject",
        //     formatter: (cellContent, row, index) => <>{row && JSON.stringify(row)}</>,
        // },
        {
            dataField: "is_shadow",
            text: `Mode`,
            formatExtraData: editJson,
            formatter: (cellContent, row) =>
                row?.isNewRow ? (
                    <div className="inputFieldCol d-flex justify-content-left">
                        <select
                            className="form-control addNewInputFields"
                            onChange={({target: {value}}) =>
                                row?.isNewRow
                                    ? inputChangeForNewRowListener("is_shadow", value)
                                    : inputChangeForEditListener(row?.uuid, "is_shadow", value)
                            }
                            defaultValue={row?.is_shadow}
                        >
                            <option key="1" value="">
                                Select Mode
                            </option>
                            <option key="2" value={"Shadow"}>
                                Shadow
                            </option>
                            <option key="3" value={"Client Side"}>
                                Client Side
                            </option>
                        </select>
                    </div>
                ) : typeof row?.is_shadow === "boolean" ? (
                    row?.is_shadow == true ? (
                        "Shadow"
                    ) : (
                        "Client Side"
                    )
                ) : (
                    row?.is_shadow || "N/A"
                ),
        },
        {
            dataField: "member_start_working_date_dummy",
            text: "Start Date",
            formatExtraData: editJson,
            formatter: (cellContent, row, index, extraData) =>
                row?.isNewRow ? (
                    <div className="inputFieldCol d-flex justify-content-center">
                        <Input
                            type="date"
                            className="form-control dateInput addNewInputFields"
                            name="newProjectAddInput3"
                            // name="startDate"
                            defaultValue={new Date().toISOString().slice(0, 10)}
                            max="9999-01-01"
                            onChangeHandler={({target: {value}}) =>
                                inputChangeForNewRowListener("member_start_working_date", value)
                            }
                            reference={register({
                                valueAsDate: false,
                            })}
                        />
                    </div>
                ) : (
                    <>
                        {row?.member_start_working_date
                            ? formatDate(row?.member_start_working_date)
                            : "N/A"}
                    </>
                ),
        },
        {
            dataField: "member_end_working_date_dummy",
            text: "End Date",
            formatExtraData: editJson,
            formatter: (cellContent, row, index, extraData) =>
                (extraData && extraData[`${row?.uuid}`]) || row?.isNewRow ? (
                    <div className="inputFieldCol d-flex justify-content-center">
                        <Input
                            type="date"
                            className="form-control dateInput addNewInputFields"
                            name="newProjectAddInput4"
                            max="9999-01-01"
                            defaultValue={row?.member_end_working_date}
                            onChangeHandler={({target: {value}}) =>
                                row?.isNewRow
                                    ? inputChangeForNewRowListener("end_date", value)
                                    : inputChangeForEditListener(row?.uuid, "end_date", value)
                            }
                            reference={register({
                                valueAsDate: false,
                            })}
                        />
                    </div>
                ) : (
                    <>
                        {row?.member_end_working_date
                            ? formatDate(row?.member_end_working_date)
                            : row?.end_date
                            ? formatDate(row?.end_date)
                            : "N/A"}
                    </>
                ),
        },
        {
            dataField: "a8shf98has9f",
            text: `Action`,
            hidden: accessList && accessList.includes("Edit Allocation") ? false : true,
            headerStyle: (colum, colIndex) => ({
                width: "30px",
            }),
            formatExtraData: {
                deleteProjectJson,
                editJson,
                empForInfoUuid,
                newAllocationBillabilityJson: newProjectInfoJson,
            },
            formatter: (
                cellContent,
                row,
                index,
                {deleteProjectJson, editJson, newAllocationBillabilityJson}
            ) => {
                return (
                    <div className="iconsCol">
                        {row?.isNewRow ? (
                            <Button
                                type="button"
                                disabled={
                                    !newAllocationBillabilityJson?.project ||
                                    !newAllocationBillabilityJson?.role ||
                                    !newAllocationBillabilityJson?.allocation ||
                                    newAllocationBillabilityJson?.billable < 0 ||
                                    newAllocationBillabilityJson?.allocation <= 0 ||
                                    newAllocationBillabilityJson?.billable > 100 ||
                                    new Date(newProjectInfoJson.end_date) < new Date()
                                }
                                className="btn btn-sm btn-primary"
                                onClick={addNewClickHandler}
                            >
                                Add New
                            </Button>
                        ) : (editJson && editJson[`${row?.uuid}`]) || row?.isNewProject ? (
                            <BsXCircleFill
                                className="me-1 crossIcon"
                                onClick={() =>
                                    row?.isNewProject
                                        ? removeAddedProjectClickHandler(row?.uuid)
                                        : crossClickHandler(row?.uuid)
                                }
                            />
                        ) : deleteProjectJson.includes(row?.uuid) ? (
                            <FaUndo
                                className="me-1 delIcon"
                                onClick={() => undoDeleteProjectClickHandler(row?.uuid)}
                            />
                        ) : (
                            <>
                                <FaEdit
                                    className="me-1 editIcon"
                                    onClick={() =>
                                        editClickHandler(
                                            row?.uuid,
                                            row?.allocation,
                                            row?.billable,
                                            row?.role
                                        )
                                    }
                                />
                                <FaTrashAlt
                                    className="delIcon"
                                    onClick={() => deleteExistingProjectClickHandler(row?.uuid)}
                                />
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

    const saveEditAllocationBillibilityClickHandler = (index, projectUuid) => {
        const val = {
            "delete_project_team_members": deleteProjectJson,
            "update_project_team_members": {
                "member_uuid_with_allocation_and_billable": editJson,
                "member_uuid_with_role_name": editJsonRole,
                "shift_timing_uuid": shiftTimingUuid,
            },
            "create_project_team_members": addProjectJson.map((item) => ({
                ...item,
                "is_shadow": item.is_shadow == "Shadow" ? true : false,
            })),
            "senior_pm_uuid": empDetails?.uuid,
        };
        createUpdateDeleteProjectTeamMembersMutateAsync({payload: val, comment: encodeURI(comment)});
        setAddProjectJson([]);
        setAddProjectJsonToDisplay([]);
        setEditJson({});
        setEditJsonRole({});
        setDeleteProjectJson([]);
        setMoreTableUuid(empForInfoUuid);
    };

    const cancelEditAllocationBillibilityClickHandler = (index, projectUuid) => {
        setEditJson({});
        setEditJsonRole({});
        setDeleteProjectJson([]);
        setAddProjectJson([]);
        setAddProjectJsonToDisplay([]);
    };

    return (
        <>
            <Container>
                <Row>
                    <Col sm={12}>
                        <Breadcrumb />
                    </Col>
                </Row>
            </Container>
            <div className="util container viewCard">
                <Row className="mb-3 pe-0">
                    <Col sm={12}>
                        <div className="headerRow cardCustomTitle"> Search resources by</div>{" "}
                    </Col>
                    <Col sm={12} md={4} lg={3}>
                        <label>Project</label>
                        <form>
                            <select
                                className="form-control customScroll"
                                onChange={({target: {value}}) =>
                                    projectDropdownChangeHandler(value)
                                }
                                name="projectDropdown"
                                onClick={() => setModeOfSearchTemp("project")}
                                ref={register({})}
                            >
                                <option key="0" value="">
                                    {isLoadingProjectsBySpmUuid ? "loading..." : "Select Project"}
                                </option>
                                {userRole == "Reporting_Managers"
                                    ? allProjectByManager &&
                                      allProjectByManager
                                          ?.sort((a, b) =>
                                              a.project_name < b.project_name ? -1 : 1
                                          )
                                          .map(({uuid, project_name}) => (
                                              <option key={uuid} value={uuid}>
                                                  {project_name}
                                              </option>
                                          ))
                                    : projectsBySpmUuid &&
                                      projectsBySpmUuid
                                          ?.sort((a, b) =>
                                              a.project_name < b.project_name ? -1 : 1
                                          )
                                          .map(({uuid, project_name}) => (
                                              <option key={uuid} value={uuid}>
                                                  {project_name}
                                              </option>
                                          ))}
                            </select>
                        </form>
                    </Col>
                    {accessList && accessList.includes("Edit Allocation") ? (
                        <>
                            <Col sm={12} md={4} lg={3}>
                                <label>Reporting Manager</label>
                                <form>
                                    <select
                                        className="form-control rmSelect customScroll"
                                        onChange={({target: {value}}) =>
                                            rmFromDropdownSelectHandler(value)
                                        }
                                        ref={register({})}
                                        name="rmSelectDropdown"
                                        onClick={() => setModeOfSearchTemp("dropdown")}
                                    >
                                        <option key="1" value="">
                                            {isLoadingRmList ? "loading..." : "Select RM"}
                                        </option>
                                        {rmList &&
                                            rmList
                                                ?.sort((a, b) =>
                                                    a.full_name < b.full_name ? -1 : 1
                                                )
                                                ?.map(({pm_name, pm_uuid}) => (
                                                    <option key={pm_uuid} value={pm_uuid}>
                                                        {pm_name}
                                                    </option>
                                                ))}
                                    </select>
                                </form>
                            </Col>
                        </>
                    ) : (
                        ""
                    )}
                    <>
                        <Col sm={12} md={4} lg={3} className="searchCol">
                            <label>Employee Name</label>
                            <AutoComplete
                                options={
                                    searchResultByEmpName
                                        ? Object.keys(searchResultByEmpName)
                                              ?.sort((a, b) =>
                                                  searchResultByEmpName[a] >
                                                  searchResultByEmpName[b]
                                                      ? 1
                                                      : -1
                                              )
                                              ?.map((key) => ({
                                                  value: searchResultByEmpName[key],
                                                  key: key,
                                              }))
                                        : []
                                }
                                popupclassname="autocompletePopup"
                                bordered={true}
                                notFoundContent={
                                    !empNameTyped
                                        ? "Start typing"
                                        : isSearchResultByEmpNameLoading
                                        ? "Loading..."
                                        : "No results found."
                                }
                                value={empNameTyped}
                                className="autocompleteComponent"
                                onSelect={(name, uuid) => {
                                    empSearchClickListener(uuid.key, name);
                                }}
                                onClick={() => setModeOfSearchTemp("search")}
                                onSearch={(text) => empNameInputChangeHandler(text)}
                                placeholder="Search"
                            />
                        </Col>
                        <Col sm={12} md={4} lg={2} className="searchCol">
                            <label>Skill</label>
                            <AutoComplete
                                options={
                                    searchResultBySkillName
                                        ? Object.keys(searchResultBySkillName)?.map((key) => ({
                                              value: searchResultBySkillName[key],
                                              key: key,
                                          }))
                                        : []
                                }
                                popupclassname="autocompletePopup"
                                bordered={true}
                                notFoundContent={
                                    !skillNameTyped
                                        ? "Start typing"
                                        : isSearchResultBySkillNameLoading
                                        ? "Loading..."
                                        : "No results found."
                                }
                                value={skillNameTyped}
                                className="autocompleteComponent"
                                onSelect={(name, uuid) => {
                                    skillSearchClickListener(uuid.key, name);
                                }}
                                onClick={() => setModeOfSearchTemp("skill")}
                                onSearch={(text) => skillNameInputChangeHandler(text)}
                                placeholder="Search"
                            />
                        </Col>
                    </>
                    <Col
                        sm={12}
                        md={2}
                        lg={1}
                        className="mt-sm-3 me-0 pe-md-0 d-flex align-items-end justify-content-md-start justify-content-sm-center "
                    >
                        <Button
                            size="md"
                            variant="primary"
                            className="showBtn"
                            onClick={showClickHandler}
                            disabled={modeOfSearchTemp == "" ? false : false}
                        >
                            Show
                        </Button>
                    </Col>
                </Row>
                {/* <Row>
                    <Col sm={12}>
                        <label>Performance </label>
                        <Rate className="d-block" />
                    </Col>
                    <Col sm={12}>
                        <label>Rewards </label>
                        <Input type="input" className="form-control" />
                    </Col>
                    <Col sm={12}>
                        <label>Feedback </label>
                        <Input type="input" className="form-control" />
                    </Col>
                </Row> */}
                {/* {modeOfSearch == "project" ? (
                    <Col sm={12}>
                        <Row className="projectDetailsCard cardShadow p-3 mb-3">
                            <Col sm={12} className=" p-0 d-flex justify-content-between">
                                <div className="cardCustomTitle">About Project</div>
                                <Button
                                    variant="primary"
                                    disabled={false}
                                    size={"sm"}
                                    onClick={addFeedbackClickHandler}
                                >
                                    Add
                                </Button>
                            </Col>
                            <Col sm={12} md={5} className="mb-2 d-flex align-items-center">
                                <span className="me-3">Performance: </span> <FaStar /> <FaStar />{" "}
                                <FaStarHalf />
                            </Col>
                            <Col sm={12} md={7}>
                                <span>Rewards: </span>{" "}
                                <p>
                                    asdf , asdf asdf , asdf asdf asdfasdf , asdf asdf , asdf asdf
                                    asdfasdf , asdf asdf , asdf asdf asdfasdf , asdf asdf , asdf
                                    asdf asdfasdf , asdf asdf , asdf asdf asdfasdf , asdf asdf ,
                                    asdf asdf asdfasdf , asdf asdf , asdf asdf asdfasdf , asdf asdf
                                    , asdf asdf asdfasdf , asdf asdf , asdf asdf asdfasdf , asdf
                                    asdf , asdf asdf asdfasdf , asdf asdf , asdf asdf asdfasdf ,
                                    asdf asdf , asdf asdf asdfasdf , asdf asdf , asdf asdf asdf
                                </p>
                            </Col>
                            <Col sm={12}>
                                <span>Feedback: </span>{" "}
                                <p>
                                    asdf , asdf asdf , asdf asdf asdfasdf , asdf asdf , asdf asdf
                                    asdfasdf , asdf asdf , asdf asdf asdfasdf , asdf asdf , asdf
                                    asdf asdfasdf , asdf asdf , asdf asdf asdfasdf , asdf asdf ,
                                    asdf asdf asdfasdf , asdf asdf , asdf asdf asdfasdf , asdf asdf
                                    , asdf asdf asdfasdf , asdf asdf , asdf asdf asdfasdf , asdf
                                    asdf , asdf asdf asdfasdf , asdf asdf , asdf asdf asdfasdf ,
                                    asdf asdf , asdf asdf asdfasdf , asdf asdf , asdf asdf asdfasdf
                                    , asdf asdf , asdf asdf asdfasdf , asdf asdf , asdf asdf
                                    asdfasdf , asdf asdf , asdf asdf asdfasdf , asdf asdf , asdf
                                    asdf asdfasdf , asdf asdf , asdf asdf asdfasdf , asdf asdf ,
                                    asdf asdf asdfasdf , asdf asdf , asdf asdf asdfasdf , asdf asdf
                                    , asdf asdf asdfasdf , asdf asdf , asdf asdf asdfasdf , asdf
                                    asdf , asdf asdf asdfasdf , asdf asdf , asdf asdf asdfasdf ,
                                    asdf asdf , asdf asdf asdfasdf , asdf asdf , asdf asdf asdf
                                </p>
                            </Col>
                        </Row>
                    </Col>
                ) : (
                    ""
                )} */}
                <Row>
                    <Col sm={12} className="mb-3">
                        <div className="headerRow cardCustomTitle">
                            {modeOfSearch == "project"
                                ? "Members under project"
                                : modeOfSearch == "search"
                                ? `About ${fullEmpName}`
                                : modeOfSearch == "dropdown"
                                ? "Members under RM"
                                : "Members"}
                        </div>
                        {
                            // isLoadingProjectInfoOfCurrentEmp ||
                            // isProjectResourceLoadingByEmpUuid ||
                            // isProjectResourcesByPmUuidLoading ? (
                            //     <p className="loadingScreen">
                            //         <Loader />
                            //     </p>
                            // ) :
                            <BootstrapTable
                                keyField="employee_uuid"
                                wrapperClasses="membersTable table-center-align"
                                noDataIndication={() =>
                                    isLoadingProjectResourcesByPmUuid ||
                                    isLoadingProjectResourcesByProjectId ||
                                    isLoadingProjectResourceByEmpUuid ||
                                    isLoadingEmpBySkillUuidList ? (
                                        <Loader />
                                    ) : modeOfSearch ? (
                                        <span className="emptyListText">No Members Found.</span>
                                    ) : (
                                        ""
                                    )
                                }
                                data={
                                    modeOfSearch == "dropdown"
                                        ? projectResourcesByPmUuid || []
                                        : modeOfSearch == "project"
                                        ? projectResourcesByProjectId || []
                                        : modeOfSearch == "search"
                                        ? projectResourceByEmpName
                                            ? [
                                                  {
                                                      ...projectResourceByEmpName,
                                                      "employee_name": fullEmpName,
													  "employee_uuid": '0'
                                                  },
                                              ]
                                            : []
                                        : modeOfSearch == "skill"
                                        ? membersListBySkillSearch || []
                                        : []
                                }
                                sort={{
                                    dataField: "employee_name",
                                    order: "asc",
                                }}
                                columns={membersCol}
                                rowStyle={(row, index) => ({
                                    backgroundColor:
                                        row?.employee_uuid === empForInfoUuid ? "#276dfa19" : "",
                                })}
                                selectRow={{
                                    mode: "radio",
                                    bgColor: "#276dfa20",
                                    onSelect: (row, isSelect) => {
                                        setEmpForInfoUuid(
                                            modeOfSearch == "search"
                                                ? empBySearchUuid
                                                : row?.employee_uuid
                                        );
                                        setEditJson({});
                                        setIsMoreTableVisible(true);
                                    },
                                }}
                                condensed
                                bordered={false}
                            />
                        }
                    </Col>
                    {userRole == "Senior_PM" &&
                    isMoreTableVisible &&
                    projectInfoOfCurrentEmp &&
                    projectInfoOfCurrentEmp.length ? (
                        <>
                            <Col sm={12} className="mb-3">
                                <div className="headerRow cardCustomTitle">More</div>
                                <BootstrapTable
                                    keyField="key"
                                    wrapperClasses="moreTable"
                                    data={moreTableData.length > 0 ? moreTableData : []}
                                    noDataIndication={
                                        isLoadingGetEmployeeHistory ? <Loader /> : "Empty."
                                    }
                                    rowStyle={(row, rowIndex) => ({
                                        background: rowIndex % 8 <= 3 ? "#276dfa19" : "none",
                                    })}
                                    columns={moreTableColumn}
                                    condensed
                                    bordered={false}
                                />
                            </Col>
                        </>
                    ) : (
                        ""
                    )}
                    {empForInfoUuid && empForInfoUuid != empDetails?.uuid ? (
                        <Col sm={12} className="mb-3">
                            <div className="headerRow cardCustomTitle">Feedback</div>
                            <Button
                                className="btn btn-primary submitBtn"
                                size="sm"
                                onClick={() =>
                                    navigate("/allFeedbacks", {state: {empUuid: empForInfoUuid}})
                                }
                            >
                                View Feedbacks
                            </Button>
                        </Col>
                    ) : (
                        ""
                    )}
                    {empForInfoUuid ? (
                        <Col sm={12} className="mb-3">
                            <div className="headerRow cardCustomTitle">Export Utilization Data</div>
                            <form className="formUtil" onSubmit={handleSubmit(exportReport)}>
                                <Row>
                                    <Col sm={3}>
                                        <label>Start Date</label>
                                        <Input
                                            type="date"
                                            className="form-control"
                                            name="startDate"
                                            max="9999-01-01"
                                            reference={register({
                                                valueAsDate: false,
                                                required: requiredField(),
                                            })}
                                        />
                                        {errors.startDate && (
                                            <small className="form-text text-danger">
                                                {errors.startDate.message}
                                            </small>
                                        )}
                                    </Col>
                                    <Col sm={3}>
                                        <label>End Date</label>
                                        <Input
                                            type="date"
                                            className="form-control"
                                            name="endDate"
                                            max="9999-01-01"
                                            reference={register({
                                                valueAsDate: false,
                                                required: requiredField(),
                                                validate: {
                                                    greaterThan: (v) => {
                                                        if (
                                                            startDate &&
                                                            new Date(startDate) > new Date(v)
                                                        ) {
                                                            return "End date cannot be less than start date.";
                                                        } else return true;
                                                    },
                                                },
                                            })}
                                        />
                                        {errors.endDate && (
                                            <small className="form-text text-danger">
                                                {errors.endDate.message}
                                            </small>
                                        )}
                                    </Col>
                                    <Col
                                        sm={4}
                                        className="buttonSection d-flex align-items-start justify-content-start"
                                    >
                                        <Button
                                            size="sm"
                                            type="submit"
                                            variant="primary"
                                            className="exportButton"
                                            disabled={empForInfoUuid ? false : true}
                                        >
                                            <a download={"Utilization report"} href={report}>
                                                <FaDownload className="me-1" /> Export Data
                                            </a>
                                        </Button>
                                    </Col>
                                </Row>
                            </form>
                        </Col>
                    ) : (
                        ""
                    )}

                    <Col sm={12} className="d-flex justify-content-between">
                        {userRole == "Senior_PM" ? (
                            <div className="headerRow cardCustomTitle">Edit Allocation</div>
                        ) : (
                            <div className="headerRow cardCustomTitle">Allocation</div>
                        )}
                    </Col>
                    <Col sm={12} className="d-flex">
                        <BootstrapTable
                            keyField="project_uuid"
                            wrapperClasses="tabularTable table-center-align"
                            data={
                                projectInfoOfCurrentEmp
                                    ? accessList &&
                                      accessList.includes("Edit Allocation") &&
                                      empDetails?.uuid != empForInfoUuid
                                        ? [
                                              ...projectInfoOfCurrentEmp,
                                              ...addProjectJsonToDisplay,
                                              {
                                                  project_uuid: "abc",
                                                  isNewRow: true,
                                                  project_name: "",
                                                  allocation: 0,
                                                  billable: 0,
                                              },
                                          ]
                                        : projectInfoOfCurrentEmp
                                    : []
                            }
                            columns={editAllocationCol.slice(
                                0,
                                empDetails?.uuid === empForInfoUuid ||
                                    !empDetails?.module_names?.includes("Edit Allocation")
                                    ? editAllocationCol?.length - 1
                                    : editAllocationCol?.length
                            )}
                            condensed
                            bordered={false}
                            rowStyle={(row, index) => {
                                return {
                                    backgroundColor:
                                        editJson && editJson[`${row?.uuid}`]
                                            ? "#f7b50020"
                                            : row?.isNewProject
                                            ? "#5cb85c20"
                                            : deleteProjectJson.includes(row?.uuid)
                                            ? "#d9544f20"
                                            : "",
                                };
                            }}
                        />
                    </Col>
                    <Col sm={12}>
                        {Object.keys(editJson).length ||
                        addProjectJson?.length ||
                        deleteProjectJson?.length ? (
                            <>
                                <Row>
                                    <Col xs={12} sm={6} md={4} lg={3} className="mb-3">
                                        <label>Shift Timing</label>
                                        <select
                                            className="form-control"
                                            onChange={({target: {value}}) => {
                                                setShiftTimingUuid(value);
                                            }}
                                        >
                                            <option key={"bac"} value={null}>
                                                Select shift timing
                                            </option>
                                            {shiftTimingList?.map(
                                                ({
                                                    shift_timing_uuid,
                                                    shift_timing,
                                                    formatted_shift_timing,
                                                }) => (
                                                    <option
                                                        key={shift_timing_uuid}
                                                        value={shift_timing_uuid}
                                                    >
                                                        {formatted_shift_timing}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </Col>
                                    <Col xs={12} sm={6} md={8} lg={9} className="mb-3">
                                        <form>
                                            <label>Comments</label>
                                            <textarea
                                                rows={1}
                                                name="comment"
                                                className="form-control"
                                                onChange={({target: {value}}) => setComment(value)}
                                            />
                                        </form>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-end">
                                    {Object.values(editJson).find((arr) => {
                                        return arr[0] <= 0;
                                    }) ? (
                                        <span className="text-danger">
                                            Allocation % cannot be zero.
                                        </span>
                                    ) : Object.entries(editJson).find(([key, value]) => {
                                          const curProjTemp = projectInfoOfCurrentEmp.find(
                                              (p) => p.uuid == key
                                          );
                                          if (
                                              curProjTemp &&
                                              new Date(curProjTemp.member_start_working_date) >
                                                  new Date(value[2])
                                          )
                                              return true;
                                      }) ? (
                                        <span className="text-danger">
                                            Start date should come before the end date
                                        </span>
                                    ) : (
                                        ""
                                    )}
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        className="mt-0 mx-2"
                                        disabled={
                                            Object.values(editJson).find((arr) => {
                                                return arr[0] <= 0;
                                            }) ||
                                            Object.entries(editJson).find(([key, value]) => {
                                                const curProj = projectInfoOfCurrentEmp.find(
                                                    (p) => p.uuid == key
                                                );
                                                if (
                                                    curProj &&
                                                    new Date(curProj.member_start_working_date) >
                                                        new Date(value[2])
                                                )
                                                    return true;
                                            })
                                        }
                                        onClick={saveEditAllocationBillibilityClickHandler}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        className="mt-0"
                                        onClick={cancelEditAllocationBillibilityClickHandler}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </>
                        ) : (
                            ""
                        )}
                    </Col>
                </Row>
            </div>
            {/* <h5>empNameTyped: {JSON.stringify(empNameTyped, undefined, 4)}</h5>
            <h5>editJson: {JSON.stringify(editJson, undefined, 4)}</h5>
            <h5>
                projectInfoOfCurrentEmp: {JSON.stringify(projectInfoOfCurrentEmp, undefined, 4)}
            </h5>
            <h5>addProjectJson: {JSON.stringify(addProjectJson, undefined, 4)}</h5>
            <h5>
                addProjectJsonToDisplay: {JSON.stringify(addProjectJsonToDisplay, undefined, 4)}
            </h5>
            <h5>newProjectInfoJson: {JSON.stringify(newProjectInfoJson, undefined, 4)}</h5>
            <h5>deleteProjectJson: {JSON.stringify(deleteProjectJson, undefined, 4)}</h5> */}
            {/* <FeedbackModal
                feedbackModalVisible={feedbackModalVisible}
                setFeedbackModalVisible={setFeedbackModalVisible}
            /> */}
        </>
    );
};
export default Index;
