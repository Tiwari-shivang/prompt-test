import {Popconfirm} from "antd";
import Moment from "moment";
import React, {useEffect, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {useRecoilValue} from "recoil";
import {
    useCreateProjectTimesheet,
    useGetTimesheetSearchResult,
} from "../../../query/attendance/attendanceQuery";
import {
    useGetRecentTimeSheet,
    useGetTimeSheetByUuid,
} from "../../../query/members/allMembers/allMembersQuery";
import {useUpdateRejectedTimeSheet} from "../../../query/members/updateMembers/updateMembersQuery";
import {authState} from "../../../recoil/authRecoil";
import {toaster} from "../../../utilits/toast";
import Loader from "../../widgets/loader/Loader";
import "./style.scss";

const Table = (props) => {
    const empDetail = useRecoilValue(authState);
    const [dataSource, setDataSource] = useState([]);
    const [count, setCount] = useState(100);
    const [searchInput, setSearchInput] = useState("");
    const {data: searchResults, isLoading: isLoadingSearchResults} = useGetTimesheetSearchResult({
        "empUuid": empDetail?.uuid,
        "search": searchInput,
    });
    const {
        data: recentTimeSheet,
        status: getApiStatus,
        isLoading: isLoadingRecentTimesheet,
    } = useGetRecentTimeSheet(empDetail && empDetail.uuid);
    const {data: rejectedTimeSheetData, isLoading: isLoadingRejectedTimesheetData} =
        useGetTimeSheetByUuid(props && props.timeSheetUuid);
    const {mutateAsync: createProjectTimesheetMutateAsync, status: createApiStatus} =
        useCreateProjectTimesheet();
    const {mutateAsync: updateRejectedTimesheetMutateAsync} = useUpdateRejectedTimeSheet();

    useEffect(() => {
        if (
            recentTimeSheet &&
            recentTimeSheet.listOfTask &&
            recentTimeSheet.listOfTask.length > 0
        ) {
            const recentTimesheetData = [];
            recentTimeSheet.listOfTask.map((currElement, index) => {
                const objToPush = {
                    id: index + 1,
                    project_uuid: currElement.projectUuid == null ? "" : currElement.projectUuid,
                    project_name: currElement.projectName == null ? "" : currElement.projectName,
                    task_Name: currElement.taskName == null ? "" : currElement.taskName,
                    description: currElement.description == null ? "" : currElement.description,
                    total_time: currElement.totalTime == null ? "" : currElement.totalTime,
                    ticket_number: currElement.ticketNumber == null ? "" : currElement.ticketNumber,
                };
                recentTimesheetData.push(objToPush);
            });
            setDataSource(recentTimesheetData);
        }
    }, [
        isLoadingRecentTimesheet,
        getApiStatus == "success",
        recentTimeSheet && recentTimeSheet.listOfTask,
        createApiStatus == "error",
    ]);

    useEffect(() => {
        if (
            rejectedTimeSheetData &&
            rejectedTimeSheetData.listOfTask &&
            rejectedTimeSheetData.listOfTask.length > 0
        ) {
            const recentTimesheetData = [];
            rejectedTimeSheetData.listOfTask.map((currElement, index) => {
                const objToPush = {
                    id: index + 1,
                    project_uuid: currElement.projectUuid == null ? "" : currElement.projectUuid,
                    project_name: currElement.projectName == null ? "" : currElement.projectName,
                    task_Name: currElement.taskName == null ? "" : currElement.taskName,
                    description: currElement.description == null ? "" : currElement.description,
                    total_time: currElement.totalTime == null ? "" : currElement.totalTime,
                    ticket_number: currElement.ticketNumber == null ? "" : currElement.ticketNumber,
                };
                recentTimesheetData.push(objToPush);
            });
            setDataSource(recentTimesheetData);
        }
    }, [rejectedTimeSheetData]);

    const searchBarChangeHandler = ({target: {value: searchText}}) => {
        setSearchInput(searchText);
    };

    // const addNewColumn =()=>{
    //   setCount(count+1)
    //  const dataToPush={ id: count, name: 'John', age: 30 }
    //   setData([...data , dataToPush])
    //   console.log(data , "data")
    // }

    const handleInputChange = (e, id, field) => {
        let newValue = "";
        if (field == "total_time") {
            newValue = e.target.value.replace(/[^0-9,.]+/g, "");
        } else {
            newValue = e.target.value;
        }
        setDataSource((prevData) =>
            prevData.map((item) => (item.id === id ? {...item, [field]: newValue} : item))
        );
    };

    const taskClickHandler = ({project_name, task_Name, project_uuid}) => {
        const DataToSend = {
            id: count,
            project_uuid: project_uuid,
            project_name: project_name,
            task_Name: task_Name,
            description: "",
            total_time: "",
            ticket_number: "",
        };
        setDataSource([...dataSource, DataToSend]);
        setCount(count + 1);
        setSearchInput("");
    };

    const handleDeleteRow = (id) => {
        setDataSource((prevData) => prevData.filter((item) => item.id !== id));
    };
    //  const handleSelection = (id) =>{
    //      setSelectedRows(id)
    //  }

    const submitClickHandler = () => {
        if (dataSource && dataSource.length != 0) {
            let checkForHourEmpty = false;
            let totalTimes = 0;
            for (var i = 0; i < dataSource.length; i++) {
                if (
                    dataSource[i].total_time == undefined ||
                    dataSource[i].total_time == "" ||
                    dataSource[i].total_time == null ||
                    dataSource[i].total_time == 0
                ) {
                    checkForHourEmpty = true;
                    break;
                }
                totalTimes = totalTimes + Number(dataSource[i].total_time);
            }
			if (totalTimes <= 24) {
                if (checkForHourEmpty == false) {
                    let currentDate = Moment(Date().toLocaleString()).format("YYYY-MM-DD");
                    if (props && props.timeSheetUuid == "") {
                        const val = {
                            emp_uuid: empDetail?.uuid,
                            task_request: dataSource,
                            reporting_manager_uuid: props && props.rmUuid,
                            time_sheet_date: props.dateToShow ? props.dateToShow : currentDate,
                        };
                        createProjectTimesheetMutateAsync(val);
                    } else {
                        const val = {
                            timesheetUuid: props && props.timeSheetUuid,
                            task_request: dataSource,
                        };
                        updateRejectedTimesheetMutateAsync(val);
                    }
                    setDataSource([]);
                    props.resetForm();
                } else {
                    toaster("error", "Hour Field Cannot be Empty");
                }
            } else {
                toaster("error", "Total Hours Cannot be Greater Than 24");
            }
        } else {
            toaster("error", "Please fill atleast one task.");
        }
    };

    const setSearchValueNull = () => {
        setSearchInput("");
    };

    useEffect(() => {
        if (props.currentTab === "unanswererd") {
            setSearchInput("");
        }
    }, [props.currentTab]);

    return (
        <div className="submitTimesheet container mt-2" onClick={setSearchValueNull}>
            <Row>
                <Col xxs={12} xs={2} sm={6}>
                    {props.timesheetFilled ? (
                        <div>Timesheet for the {props.dateToShow} submitted.</div>
                    ) : (
                        ""
                    )}
                </Col>
                <Col xxs={12} xs={10} sm={6} className="pb-2">
                    <input
                        type="text"
                        disabled={props?.mode == "Disabled"}
                        className="form-control timesheetSearch"
                        placeholder="Search & Add Tasks To Board"
                        onChange={searchBarChangeHandler}
                        value={searchInput}
                    />
                    {searchInput ? (
                        <div className="searchResultBox mt-1 customScroll cardShadow">
                            {isLoadingSearchResults ? (
                                    <Loader />
                            ) : searchResults && searchResults.length === 0 ? (
                                <p className="emptyListText mt-2 mb-2">No Results</p>
                            ) : (
                                searchResults?.map(({projectName, taskName, projectUuid}) => (
                                    <div
                                        className="resultRow py-1 d-flex justify-content-center"
                                        onClick={() =>
                                            taskClickHandler({
                                                project_name: projectName,
                                                task_Name: taskName,
                                                project_uuid: projectUuid,
                                            })
                                        }
                                    >
                                        {projectName}: {taskName}
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        ""
                    )}
                </Col>
            </Row>
            <Row className="tableRow customScroll">
                <Col sm={12} className="px-0">
                    <table className="normalTable">
                        <thead>
                            <tr>
                                <th width="16%">Project Name</th>
                                <th width="20%">Task/ Activity</th>
                                <th width="30%">Description/ Comments</th>
                                <th width="18%">Ticket ID</th>
                                <th width="8%">Hours</th>
                                {props && props.mode != "Disabled" ? (
                                    <th width="8%">Action</th>
                                ) : (
                                    ""
                                )}
                            </tr>
                        </thead>
                        <tbody className="customScroll">
                            {dataSource &&
                                dataSource.map((item) => (
                                    <tr key={item.id}>
                                        <td width="16%">
                                            {/* <input
					type="text"
					value={item.project_name}
					onChange={e => handleInputChange(e, item.id, 'project_name')}
					disabled={true} // Set to true for non-editable rows
				/> */}
                                            {item.project_name}
                                        </td>
                                        <td width="20%">
                                            {/* <input
					type="text"
					value={item.task_Name}
					onChange={e => handleInputChange(e, item.id, 'task_Name')}
					disabled={true} // Set to true for non-editable rows
				/> */}
                                            {item.task_Name}
                                        </td>
                                        <td width="30%">
                                            <input
                                                type="text"
                                                // style={{border:selectedRows == item.id? '1px solid #808080' : 'none'}}
                                                maxLength="510"
                                                value={item.description}
                                                onChange={(e) =>
                                                    handleInputChange(e, item.id, "description")
                                                }
                                                disabled={props?.mode == "Disabled"}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                disabled={props?.mode == "Disabled"}
                                                //style={{border:selectedRows == item.id? '1px solid #808080' : 'none'}}
                                                maxLength="20"
                                                value={item.ticket_number}
                                                onChange={(e) =>
                                                    handleInputChange(e, item.id, "ticket_number")
                                                }
                                            />
                                        </td>
                                        <td width="8%">
                                            <input
                                                type="text"
                                                //style={{border:selectedRows == item.id? '1px solid  #808080' : 'none'}}
                                                // maxLength="3"
                                                value={item.total_time}
                                                onChange={(e) => {
                                                    const enteredValue = e.target.value;
                                                    const regex =
                                                        /^$|^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/;
                                                    if (
                                                        regex.test(enteredValue) &&
                                                        enteredValue <= 24 &&
                                                        enteredValue.length < 6
                                                    ) {
                                                        handleInputChange(e, item.id, "total_time");
                                                    }
                                                }}
                                                disabled={props?.mode == "Disabled"}
                                            />
                                        </td>
                                        {props && props.mode != "Disabled" ? (
                                            <td width="8%">
                                                {/* <button onClick={() => handleDeleteRow(item.id)}>Delete</button> */}
                                                <Popconfirm
                                                    title="Sure to delete?"
                                                    onConfirm={() => handleDeleteRow(item.id)}
                                                >
                                                    <button>Delete</button>
                                                </Popconfirm>
                                            </td>
                                        ) : (
                                            ""
                                        )}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center">
                {props && props.mode !== "Disabled" ? (
                    <Col sm={12} className="buttonSection">
                        <span>
                            Clicking submit will submit tasks for RM approval. View will be saved
                            for next time use(Tomorrow).
                        </span>
                        <Button
                            disabled={props.mode && props.mode == "Disabled"}
                            size="sm"
                            variant="btn btn-primary btn-sm"
                            onClick={submitClickHandler}
							className="mt-2"
                        >
                            {props.mode ?? "Submit"}
                        </Button>
                    </Col>
                ) : (
                    ""
                )}
            </Row>
        </div>
    );
};

export default Table;
