import React, {useState} from "react";
import {Button, Col, Container, Modal, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";

import Moment from "moment";
import {useRecoilValue} from "recoil";
import Breadcrumb from "../../../../components/Breadcrumb";
import {useGetPendingLeaves} from "../../../../query/leave/allLeaves/allLeavesQuery";
import {useUpdateLeaveStatus} from "../../../../query/leave/updateLeaves/updateLeavesQuery";
import {authState} from "../../../../recoil/authRecoil";
import "./style.scss";

const Index = () => {
    const empDetail = useRecoilValue(authState);
    const {data: allPendingLeaves} = useGetPendingLeaves(empDetail && empDetail.uuid);
    const {data, isLoading, mutateAsync: updateMutateAsync} = useUpdateLeaveStatus();
    const [showDelModal, setShowDelModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [delId, setDelId] = useState(-1);
    const [approveId, setApproveId] = useState(-1);
    const [curLeave, setCurLeave] = useState({});
    const {data: allLeaves, isLoading: isLoadingAllLeaves} = useGetPendingLeaves(
        empDetail && empDetail.uuid
    );
    const handleOnCancel = (id) => {
        const val = {
            "commonLeaveUuid": id,
            "newStatus": "Rejected",
        };
        updateMutateAsync(val);
        setShowDelModal(false);
    };
    const handleOnApprove = (id) => {
        const val = {
            "commonLeaveUuid": id,
            "newStatus": "Approved",
        };
        updateMutateAsync(val);
        setShowApproveModal(false);
    };
    const deleteClickHandler = (id) => {
        setDelId(id);
        setShowDelModal(true);
    };
    const approveClickHandler = (id, item) => {
        setCurLeave(item);
        setApproveId(id);
        setShowApproveModal(true);
    };

    const columns = [
        {
            dataField: "leave_date",
            text: "date",
            headerStyle: (colum, colIndex) => {
                return {width: "12%", textAlign: "center"};
            },
            formatter: (cellContent, row) => (
                <div className="d-flex flex-lg-row flex-sm-column align-items-center dateCol">
                    <p className="mb-0">{Moment(row?.leave_date).format("DD MMM, yy ")}</p>
                    <p className="mb-0 px-1">to</p>
                    <p className="mb-0">{Moment(row?.leave_to_date).format("DD MMM, y ")}</p>
                </div>
            ),
        },
        {
            dataField: "first_name",
            text: "Name",
            headerStyle: (colum, colIndex) => {
                return {textAlign: "center"};
            },
            formatter: (cellContent, row) => (
                <div className="nameCol text-center">{row?.first_name + " " + row?.last_name}</div>
            ),
        },
        {
            dataField: "leave_type",
            text: "Leave-Type",
            headerStyle: (colum, colIndex) => {
                return {width: "10%", textAlign: "center"};
            },
            formatter: (cellContent, row) => (
                <div className="leaveTypeCol text-center">{cellContent}</div>
            ),
        },
        {
            dataField: "reason",
            text: 'Reason',
            headerStyle: (colum, colIndex) => {
                return {width: "30%", textAlign: "center"};
            },
            formatter: (cellContent, row) => (
                <div className="descriptionCol text-center">{cellContent}</div>
            ),
        },
        {	
			dataField:'action',
            text: "Action",
            headerStyle: (colum, colIndex) => {
                return {width: "10%", textAlign: "center"};
            },
            formatter: (cellContent, row) => (
                <div className="actionCol d-flex">
                    <button
                        type="button"
                        class="btn btn-outline-primary btn-sm approveBtn me-1"
                        onClick={() => approveClickHandler(row?.common_leave_uuid, row)}
                    >
                        Approve
                    </button>
                    <button
                        type="button"
                        class="btn btn-outline-danger btn-sm rejectBtn"
                        onClick={() => deleteClickHandler(row?.common_leave_uuid)}
                    >
                        Reject
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Container>
                <Row className="nav mb-2">
                    <Col xs={12} sm={12}>
                        <Breadcrumb />
                    </Col>
                </Row>
            </Container>
            <div className="leaveApprovalList viewCard">
                <div className="cardCustomTitle mb-3">Leave approval</div>
                <BootstrapTable
                    wrapperClasses="table-center-align customScroll"
                    keyField="id"
                    data={allPendingLeaves ? allPendingLeaves : []}
                    columns={columns}
                    condensed
                />
                {allPendingLeaves && allPendingLeaves.length == 0 ? (
                    <p className="emptyListText">No Leave Applications</p>
                ) : (
                    ""
                )}
            </div>
            {showDelModal && (
                <DeleteModal
                    modalOpen={showDelModal}
                    modalClose={() => setShowDelModal(false)}
                    delId={delId}
                    handleOnCancel={handleOnCancel}
                    curLeave={curLeave}
                />
            )}
            {showApproveModal && (
                <ApproveModal
                    modalOpen={showApproveModal}
                    modalClose={() => setShowApproveModal(false)}
                    approveId={approveId}
                    curLeave={curLeave}
                    handleOnApprove={handleOnApprove}
                />
            )}
        </>
    );
};

export const DeleteModal = ({modalOpen, modalClose, delId, handleOnCancel, curLeave}) => {
    return (
        <Modal
            className="approveRejectModal commonModal"
            show={modalOpen}
            onHide={modalClose}
            centered
        >
            <Modal.Header closeButton>
                <div className="cardCustomTitle">Reject Leave Approval</div>
            </Modal.Header>
            <Modal.Body className="container">
                <Row>
                    <Col sm={12}>
                        <p className="text-start mb-1">Are you sure want to reject this Leave ?</p>

                        <p className="dateInfo text-start mb-0">
                            <span>Date:</span> {Moment(curLeave?.leave_date).format("DD MMM, yy")}
                            {" to "}
                            {Moment(curLeave?.leave_to_date).format("DD MMM, y")}
                        </p>
                        {curLeave?.reason ? (
                            <p className="dateInfo text-start mb-0">
                                <span>Reason:</span> {curLeave?.reason}
                            </p>
                        ) : (
                            ""
                        )}
                    </Col>
                    <Col sm={12}>
                        <div className="buttonSection">
                            <Button variant="primary" onClick={() => handleOnCancel(delId)}>
                                Reject
                            </Button>
                            <Button variant="outline-danger" onClick={modalClose}>
                                Cancel
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export const ApproveModal = ({modalOpen, modalClose, approveId, handleOnApprove, curLeave}) => {
    return (
        <Modal
            className="approveRejectModal commonModal"
            show={modalOpen}
            onHide={modalClose}
            centered
        >
            <Modal.Header closeButton>
                <div className="cardCustomTitle">Approve Leave </div>
            </Modal.Header>
            <Modal.Body className="container">
                <Row>
                    <Col sm={12}>
                        <p className=" text-start mb-1">
                            Are you sure want to approve this leave ?
                        </p>
                        <p className="dateInfo text-start mb-0">
                            <span>Date:</span> {Moment(curLeave?.leave_date).format("DD MMM, yy")}
                            {" to "}
                            {Moment(curLeave?.leave_to_date).format("DD MMM, y")}
                        </p>
                        {curLeave?.reason ? (
                            <p className="dateInfo text-start mb-0">
                                <span>Reason:</span> {curLeave?.reason}
                            </p>
                        ) : (
                            ""
                        )}
                    </Col>
                    <Col sm={12}>
                        <div className="buttonSection">
                            <Button variant="primary" onClick={() => handleOnApprove(approveId)}>
                                Approve
                            </Button>
                            <Button variant="outline-danger" onClick={modalClose}>
                                Cancel
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default Index;
