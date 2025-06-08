import Moment from "moment";
import React, {useEffect, useState} from "react";
import {Button, Col, Container, Modal, Row, Tab, Tabs} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import Breadcrumb from "../../../components/Breadcrumb";
import {
    useBulkApproveTimesheets,
    useTransferTimesheets,
} from "../../../query/attendance/attendanceQuery";
import {
    useGetTimeSheetForApproval,
    useGetTimeSheetSrPmApproval,
} from "../../../query/members/allMembers/allMembersQuery";
import {useTimeSheetApproval} from "../../../query/members/updateMembers/updateMembersQuery";
import {authRoleState, authState} from "../../../recoil/authRecoil";
import {convert24Hourto12Hour, formatDate} from "../../../utilits/usefulFunctions";
import Loader from "../../widgets/loader/Loader";
import "./style.scss";
import {TextWithViewMore} from "../../modals/viewMore/Index";
const SIZE = 10;

const PotbRequests = () => {
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
			dataField:'sno',
            text: "S.No.",
            style: {width: "20px"},
            isDummyField: true,
            formatter: (cellContent, row, index) => index + 1,
        },
        {
            dataField: "name",
            text: "Name",
            formatter: (cellContent, row) => cellContent || "N/A",
        },
        {
            dataField: "repManager",
            text: "Reporting Manager",
            formatter: (cellContent, row) => cellContent || "N/A",
        },
        {
            dataField: "timeSheetSubmittedDate",
            text: "Date of Reqeust",
            formatter: (cellContent, row) =>
                formatDate(Moment(cellContent).format("YYYY-MM-DD")) +
                ", " +
                convert24Hourto12Hour(Moment(cellContent).format("HH:mm")),
        },
        // {
        // 	dataField: 'testing',
        //     text: "Total Hours",
        // 	formatter: (cellContent, row) => JSON.stringify(row),

        // },
        {
            dataField: "total_hour",
            text: "Description",
            align: "center",
            headerStyle: (cellContent, row) => ({textAlign: "center"}),
            formatter: (cellContent, row) => (
                <TextWithViewMore text={cellContent} title={"Description"} showLength={30} />
            ),
        },
        {
            dataField: "id",
            text: "Action",
            style: {width: "60px"},
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
            <div className="patOnTheBackApproval viewCard customScroll cardShadow">
                <Tabs
                    id="controlled-tab-example"
                    className="mb-3"
                    activeKey={status}
                    onSelect={(key) => {
                        setStatus(key);
                    }}
                >
                    <Tab eventKey="PENDING" title={"Pending Requests"}>
                        {isAllTimesheetsLoading || isAllTimesheetSrPMLoading ? (
                            <Loader />
                        ) : (
                            <BootstrapTable
                                keyField="timeSheetUuid"
                                wrapperClasses="pendingTable"
                                data={[]}
                                columns={columns}
                                noDataIndication={<span className="emptyListText">No Records In Pending Queue.</span>}
                                condensed
                                bordered={false}
                            />
                        )}
                    </Tab>
                    <Tab eventKey="APPROVED" title={"Approved Requests"}>
                        {isAllTimesheetsLoading || isAllTimesheetSrPMLoading ? (
                            <Loader />
                        ) : (
                            <BootstrapTable
                                keyField="id"
                                wrapperClasses="approvalTable"
                                data={[]}
                                columns={columns}
                                noDataIndication={
                                    isAllTimesheetsLoading || isAllTimesheetSrPMLoading ? (
                                        <Loader />
                                    ) : (
                                        <span className="emptyListText">No Records In Approval Queue.</span>
                                    )
                                }
                                condensed
                                bordered={false}
                            />
                        )}
                    </Tab>
                </Tabs>
                <ViewRequestModal
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

export const ViewRequestModal = (props) => {
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
                size="md"
                className="commonModal"
                show={viewTimeSheetModalOpen}
                onHide={viewTimeSheetModalClose}
                centered
            >
                <Modal.Body>
                    <p className="keyAndValueText text-start mb-1">
                        <span className="name">Name:</span>
                        <span className="value ms-1">Sample Text</span>
                    </p>
                    <p className="keyAndValueText text-start mb-1">
                        <span className="name">Reporting Manager:</span>
                        <span className="value ms-1">Sample Text</span>
                    </p>
                    <p className="keyAndValueText text-start mb-1">
                        <span className="name">Date Reported:</span>
                        <span className="value ms-1">Sample Text</span>
                    </p>
                    <p className="keyAndValueText text-start mb-1">
                        <span className="name">Description:</span>
                        <span className="value ms-1">
                            <TextWithViewMore
                                text={
                                    "as asdf asdf as asdf asdf as asdf asdf as asdf asdf as asdf asdf as asdf asdf as asdf asdf as asdf asdf as asdf asdf as asdf asdf as asdf asdf as asdf asdf as asdf asdf as asdf asdf as asdf asdf as asdf asdf "
                                }
                                showLength={50}
                                title={"Description"}
                            />
                        </span>
                    </p>
                    <p className="keyAndValueText text-start mb-1">
                        <span className="name">Comment:</span>
                    </p>
                    <form className="formEditBankDetails container-fluid">
                        <Row className="d-flex justify-content-center">
                            {status == "PENDING" ? (
                                <Col sm={12} className="mt-0 px-0">
                                    <textarea
                                        type="text"
                                        id="text-edit"
                                        onChange={handleValueChange}
                                        placeholder="Add Comment"
                                        className="form-control"
                                        name="comment"
                                        rows={2}
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

export default PotbRequests;
