import Moment from "moment";
import React, {useEffect, useState} from "react";
import {Button, Col, Container, Modal, Row, Tab, Tabs} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import Breadcrumb from "../../../components/Breadcrumb";
import {
    useGetEmpToTransfer,
    useGetTimeSheetForApproval,
    useGetTimeSheetSrPmApproval,
} from "../../../query/members/allMembers/allMembersQuery";
import {useTimeSheetApproval} from "../../../query/members/updateMembers/updateMembersQuery";
import {authRoleState, authState} from "../../../recoil/authRecoil";
import {convert24Hourto12Hour, formatDate} from "../../../utilits/usefulFunctions";
import Loader from "../../widgets/loader/Loader";
import Paginations from "../pagination/Index";
import "./style.scss";
import {
    useBulkApproveTimesheets,
    useTransferTimesheets,
} from "../../../query/attendance/attendanceQuery";
const SIZE = 10;
const TimesheetApproval = () => {
    const navigate = useNavigate();
    const empDetail = useRecoilValue(authState);
    const getRole = useRecoilValue(authRoleState);
    const userRole = getRole && getRole.Role;
    const [viewTimeSheetModalOpen, setViewTimeSheetModalOpen] = useState(false);
    const [id, setId] = useState();
    const [timeSheetData, setTimeSheetData] = useState([]);
    const [comment, setComment] = useState();
    const [status, setStatus] = useState("PENDING");
    const [newRmUuid, setnewRmUuid] = useState("");
    const [curPageApproved, setCurPageApproved] = useState(1);
    const [curPagePending, setCurPagePending] = useState(1);
    const [multipleSelectMode, setMultipleSelectMode] = useState("");
    const [multipleSelectFileUuids, setMultipleSelectFileUuids] = useState([]);
    const {
        data: allTimeSheets,
        isLoading: isAllTimesheetsLoading,
        refetch: refetchAllTimesheets,
    } = useGetTimeSheetForApproval({
        id: empDetail && empDetail.uuid,
        status: status,
        size: SIZE,
        page: status == "PENDING" ? curPagePending : curPageApproved,
    });
    const {data: allTimeSheetsSrPm, isLoading: isAllTimesheetSrPMLoading} =
        useGetTimeSheetSrPmApproval(empDetail && empDetail.uuid, userRole);
    // const {data: empListForTransfer} = useGetEmpToTransfer(empDetail && empDetail.uuid, userRole);
    // will be uncommented upon transfer timesheet approval

    const {mutateAsync: transferTimesheetsMutateAsync} = useTransferTimesheets();
    const {mutateAsync: bulkApprovalTimesheetsMutateAsync} = useBulkApproveTimesheets();
    const handleEmployeeDetail = (id) => {
        navigate(`/members/memberDetail/${id}`);
    };
    const handleTransferTimesheetBulkClick = (listOfUuids, isChecked) => {
        setMultipleSelectFileUuids((prev) =>
            isChecked
                ? [...prev, ...listOfUuids]
                : prev.filter((file) => listOfUuids.findIndex((i) => file == i) == -1)
        );
    };

    const handleTransferBulk = (mode) => {
        setMultipleSelectMode(mode);
    };

    const handleSubmitTransfer = () => {
        const val = {
            "rmUuid": empDetail?.uuid,
            "newRmUuid": newRmUuid,
            "timesheetUuids": multipleSelectFileUuids,
        };
        transferTimesheetsMutateAsync(val);
        setMultipleSelectMode(false);
        setMultipleSelectFileUuids([]);
    };

    const handleBulkApprovalClick = () => {
        bulkApprovalTimesheetsMutateAsync(multipleSelectFileUuids);
        setMultipleSelectMode(false);
        setMultipleSelectFileUuids([]);
        // console.log(multipleSelectFileUuids);
    };

    const handleDiscardTransfer = () => {
        setMultipleSelectFileUuids([]);
        setMultipleSelectMode(false);
    };

    const handleViewTimesheet = (data, timeSheetUUid, comment) => {
        setTimeSheetData(data);
        setComment(comment);
        setId(timeSheetUUid);
        setViewTimeSheetModalOpen(true);
    };

    useEffect(() => {
        if (
            allTimeSheetsSrPm != undefined &&
            allTimeSheets?.getTimeSheetResponseForRMAndSRMS != undefined
        ) {
            const timeSheetOfEmployee = allTimeSheets?.getTimeSheetResponseForRMAndSRMS;
            const timeSheetOfPms = allTimeSheetsSrPm;
            const addTwoArray = [...timeSheetOfEmployee, ...timeSheetOfPms];
        }
    }, [allTimeSheetsSrPm && allTimeSheets && allTimeSheets.getTimeSheetResponseForRMAndSRMS]);

    const columns = [
        {
			dataField: "sNo",
            text: "S.No.",
            style: {width: "20px"},
            formatter: (cellContent, row, index) => (
                <div className="attendanceDayCol">
                    {index +
                        1 +
                        SIZE * ((status == "PENDING" ? curPagePending : curPageApproved) - 1)}
                </div>
            ),
        },
        {
            dataField: "employeeName",
            text: "Employee Name",
            formatter: (cellContent, row) => cellContent || "N/A",
        },
        {
            dataField: "timeSheetDate",
            text: "Timesheet Date",
            formatter: (cellContent, row) =>
                cellContent ? formatDate(Moment(cellContent).format("YYYY-MM-DD")) : "N/A",
        },
        {
            dataField: "timeSheetSubmittedDate",
            text: "Submitted Date",
            formatter: (cellContent, row) =>
                cellContent
                    ? formatDate(Moment(cellContent).format("YYYY-MM-DD")) +
                      ", " +
                      convert24Hourto12Hour(Moment(cellContent).format("HH:mm"))
                    : "N/A",
        },
        // {
        // 	dataField: 'testing',
        //     text: "Total Hours",
        // 	formatter: (cellContent, row) => JSON.stringify(row),
        // },
        {
            dataField: "total_hour",
            text: "Total Hours",
            align: "center",
            headerStyle: (cellContent, row) => ({textAlign: "center"}),
            formatter: (cellContent, row) => cellContent||'N/A',
        },
        {
            dataField: "action",
            text: "Action",
            style: {width: "60px"},
            isDummyField: true,
            formatter: (cellContent, row) => (
                <div className="actionCol">
                    <Button
                        className="approveBtn btn btn-primary btn-sm"
                        onClick={(e) =>
                            handleViewTimesheet(
                                row && row.listOfTask,
                                row && row.timeSheetUuid,
                                row.comment
                            )
                        }
                    >
                        View
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Container>
                <Row className="nav mb-2">
                    <Col xs={12} sm={6}>
                        <Breadcrumb />
                    </Col>
                </Row>
            </Container>
            <div className="employeeTimesheetApproval viewCard customScroll cardShadow">
                <Tabs
                    id="controlled-tab-example"
                    className="mb-3"
                    activeKey={status}
                    onSelect={(key) => {
                        setStatus(key);
                    }}
                >
                    <Tab
                        eventKey="PENDING"
                        title={`Pending for approval ${
                            allTimeSheets && status == "PENDING"
                                ? "(" + allTimeSheets?.count + ")"
                                : ""
                        }`}
                    >
                        {/* <Row className="d-flex justify-content-end">
                                <Col sm={4} className="d-flex justify-content-end mb-3">
                                    <Button
                                        className="approveBtn btn btn-primary btn-sm"
                                        onClick={()=>handleTransferBulk('transfer')}
                                        disabled={transferMode}
                                    >
                                        Transfer Timesheets
                                    </Button>
                                </Col>
                                {transferMode ? (
                                    <Col sm={4} className="d-flex justify-content-end mb-3">
                                        <select
                                            placeholder="Gender*"
                                            className="form-control customScroll"
                                            name="gender"
                                            onChange={(e) => setnewRmUuid(e.target.value)}
                                        >
                                            <option value="">Select PM</option>
                                            {empListForTransfer.map(
                                                ({uuid, first_name, last_name}) => (
                                                    <option value={uuid}>
                                                        {first_name} {last_name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </Col>
                                ) : (
                                    ""
                                )}
                            </Row> */}
                        {allTimeSheets &&
                        allTimeSheets?.count &&
                        allTimeSheets?.count > 1 &&
                        !multipleSelectMode ? (
                            <div className="d-flex justify-content-end mb-2">
                                <Button
                                    className="approveBtn btn btn-primary btn-sm"
                                    onClick={() => handleTransferBulk("bulk")}
                                    disabled={multipleSelectMode}
                                >
                                    Bulk Approve Timesheets
                                </Button>
                            </div>
                        ) : (
                            ""
                        )}
                        {isAllTimesheetsLoading || isAllTimesheetSrPMLoading ? (
                            <Loader />
                        ) : (
                            <BootstrapTable
                                keyField="key"
                                wrapperClasses="pendingTable"
                                selectRow={{
                                    mode: "checkbox",
                                    hideSelectColumn: !multipleSelectMode,
                                    bgColor: "#276dfa20",
                                    selectColumnPosition: "right",
                                    selected: multipleSelectFileUuids,
                                    onSelect: (row, isSelect) => {
                                        handleTransferTimesheetBulkClick(
                                            [row.timeSheetUuid || ""],
                                            isSelect
                                        );
                                    },
                                    onSelectAll: (isSelect, row) => {
                                        console.log(row, isSelect);
                                        handleTransferTimesheetBulkClick(
                                            row.map((r) => r.timeSheetUuid || ""),
                                            isSelect
                                        );
                                    },
                                }}
                                data={
                                    allTimeSheets?.getTimeSheetResponseForRMAndSRMS
                                        ? allTimeSheets?.getTimeSheetResponseForRMAndSRMS
                                              .sort((a, b) => {
                                                  return (
                                                      new Date(b?.timeSheetSubmittedDate) -
                                                      new Date(a?.timeSheetSubmittedDate)
                                                  );
                                              })
                                              ?.map((t, index) => ({
                                                  ...t,
                                                  "key": index,
                                              }))
                                        : []
                                    // timeSheetForSrPm && allTimeSheets
                                    //     ? userRole == "Senior_PM" ||
                                    //       userRole == "Admin" ||
                                    //       userRole == "Super_Admin"
                                    //         ? timeSheetForSrPm.map((t, index) => ({
                                    //               ...t,
                                    //               "key": index,
                                    //           }))
                                    //         : allTimeSheets.map((t, index) => ({
                                    //               ...t,
                                    //               "key": index,
                                    //           }))
                                    //     : []
                                }
                                columns={columns}
                                noDataIndication={
                                    isAllTimesheetsLoading || isAllTimesheetSrPMLoading ? (
                                        <Loader />
                                    ) : (
                                        <span>No Records In Pending Queue.</span>
                                    )
                                }
                                condensed
                                bordered={false}
                            />
                        )}
                    </Tab>
                    <Tab
                        eventKey="APPROVED"
                        title={`Approved Timesheets ${
                            allTimeSheets && status == "APPROVED"
                                ? "(" + allTimeSheets?.count + ")"
                                : ""
                        }`}
                    >
                        {isAllTimesheetsLoading || isAllTimesheetSrPMLoading ? (
                            <Loader />
                        ) : (
                            <BootstrapTable
                                keyField="key"
                                wrapperClasses="approvalTable"
                                data={
                                    allTimeSheets && allTimeSheets?.getTimeSheetResponseForRMAndSRMS
                                        ? allTimeSheets?.getTimeSheetResponseForRMAndSRMS
                                              .sort((a, b) => {
                                                  return (
                                                      new Date(b?.timeSheetSubmittedDate) -
                                                      new Date(a?.timeSheetSubmittedDate)
                                                  );
                                              })
                                              ?.map((t, index) => ({
                                                  ...t,
                                                  "key": index,
                                              }))
                                        : []
                                }
                                columns={columns}
                                noDataIndication={
                                    isAllTimesheetsLoading || isAllTimesheetSrPMLoading ? (
                                        <Loader />
                                    ) : (
                                        <span>No Records In Approval Queue.</span>
                                    )
                                }
                                condensed
                                bordered={false}
                            />
                        )}
                    </Tab>
                </Tabs>
                <div className="d-flex py-1 justify-content-end">
                    <Paginations
                        itemsCount={allTimeSheets?.count ?? 0}
                        itemsPerPage={SIZE}
                        currentPage={status == "PENDING" ? curPagePending : curPageApproved}
                        setCurrentPage={(e) => {
                            status == "PENDING" ? setCurPagePending(e) : setCurPageApproved(e);
                        }}
                    />
                </div>
                {multipleSelectMode && status == "PENDING" ? (
                    <div className="buttonSection mt-0">
                        {multipleSelectMode === "transfer" ? (
                            <Button
                                className="approveBtn btn btn-primary btn-sm mb-3 me-2"
                                onClick={handleSubmitTransfer}
                                disabled={!multipleSelectFileUuids.length || !newRmUuid}
                            >
                                Transfer Timesheets
                            </Button>
                        ) : (
                            <Button
                                className="approveBtn btn btn-primary btn-sm me-2"
                                onClick={handleBulkApprovalClick}
                                disabled={!multipleSelectFileUuids.length}
                            >
                                Bulk Approve
                            </Button>
                        )}

                        <Button
                            className="approveBtn btn btn-danger btn-sm"
                            onClick={handleDiscardTransfer}
                        >
                            Discard
                        </Button>
                    </div>
                ) : (
                    ""
                )}
                <ViewTimeSheetModal
                    viewTimeSheetModalOpen={viewTimeSheetModalOpen}
                    timeSheetData={timeSheetData}
                    id={id}
                    status={status}
                    comm={comment}
                    uuid={empDetail?.uuid}
                    refetchAllTimesheets
                    removeCurTimesheet={(uuid) =>
                        setMultipleSelectFileUuids((prev) => prev.filter((p) => p != uuid))
                    }
                    viewTimeSheetModalClose={() => setViewTimeSheetModalOpen(false)}
                />
            </div>
        </>
    );
};

export const ViewTimeSheetModal = (props) => {
    const {
        viewTimeSheetModalOpen,
        viewTimeSheetModalClose,
        timeSheetData,
        id,
        uuid,
        status,
        comm,
        removeCurTimesheet,
        refetchAllTimesheets,
    } = props;
    const [comment, setComment] = useState();
    const {mutateAsync} = useTimeSheetApproval();
    const {
        reset,
        register,
        handleSubmit,
        formState: {errors, isValid},
    } = useForm({
        mode: "onTouched",
    });

    const changeStatus = (data) => {
        viewTimeSheetModalClose();
        const dataToSend = {
            timesheetUuid: id,
            status: data,
            approverUuid: uuid,
            comment: comment,
        };
        mutateAsync(dataToSend);
        removeCurTimesheet(id);
        refetchAllTimesheets();
    };

    const handleValueChange = (e) => {
        setComment(e.target.value);
    };

    const columns = [
        {
            dataField: "projectName",
            text: "Project Name",
        },
        {
            dataField: "taskName",
            text: "Task/ Activity",
        },
        {
            dataField: "description",
            text: "Description/ Comments",
        },
        {
            dataField: "ticketNumber",
            text: "Ticket ID",
            style: {width: "15%"},
            formatter: (cellContent, row) => row && row.ticketNumber,
        },
        {
            dataField: "totalTime",
            text: "Hours",
            style: {textAlign: "center"},
            headerStyle: {textAlign: "center"},
        },
    ];

    return (
        <>
            <Modal
                size="xl"
                className="commonModal"
                show={viewTimeSheetModalOpen}
                onHide={viewTimeSheetModalClose}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Timesheet</Modal.Title>
                </Modal.Header>
                <Modal.Body className="container">
                    <Row className="employeeTimesheetModal">
                        <Col sm={12}>
                            <BootstrapTable
                                keyField="taskUuid"
                                data={timeSheetData ? timeSheetData : []}
                                columns={columns}
                                condensed
                                bordered={false}
                            />
                        </Col>
                    </Row>
                    <form className="formEditBankDetails">
                        <Row className="d-flex justify-content-center">
                            {status == "PENDING" ? (
                                <Col sm={8} className=" mt-3">
                                    <textarea
                                        type="text"
                                        id="text-edit"
                                        onChange={handleValueChange}
                                        placeholder="Add Comment"
                                        className="form-control"
                                        name="comment"
                                        rows={1}
                                        ref={register({})}
                                    />
                                </Col>
                            ) : comm ? (
                                <span className="mb-2">
                                    <strong>Comment: </strong> {comm}
                                </span>
                            ) : (
                                ""
                            )}
                        </Row>
                        {status == "PENDING" ? (
                            <Row>
                                <Col sm={12} className="buttonSection">
                                    <Button
                                        variant="primary"
                                        type="button"
                                        onClick={() => {
                                            changeStatus("approved");
                                        }}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        type="button"
                                        onClick={() => {
                                            changeStatus("rejected");
                                        }}
                                    >
                                        Reject
                                    </Button>
                                </Col>
                            </Row>
                        ) : (
                            ""
                        )}
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TimesheetApproval;
