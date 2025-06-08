import Moment from "moment";
import React, {useState} from "react";
import {Button, Col, Modal, Row} from "react-bootstrap";
import {useRecoilValue} from "recoil";
import {useGetPendingLeaves} from "../../../query/leave/allLeaves/allLeavesQuery";
import {useUpdateLeaveStatus} from "../../../query/leave/updateLeaves/updateLeavesQuery";
import {authState} from "../../../recoil/authRecoil";
import Loader from "../../widgets/loader/Loader";
import "./style.scss";
import ErrorBoundary from "../../../core/ErrorBoundary";
import {ApproveModal, DeleteModal} from "./leaveApprovalList/Index";
import {FaCheck, FaCross, FaXRay} from "react-icons/fa";
import {BsX, BsXLg} from "react-icons/bs";
import BootstrapTable from "react-bootstrap-table-next";
const LeaveApproval = () => {
    const empDetail = useRecoilValue(authState);
    const [showDelModal, setShowDelModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [delId, setDelId] = useState(-1);
    const [approveId, setApproveId] = useState(-1);
    const [curLeave, setCurLeave] = useState({});
    const {data: allLeaves, isLoading: isLoadingAllLeaves} = useGetPendingLeaves(
        empDetail && empDetail.uuid
    );
    const {mutateAsync: updateMutateAsync} = useUpdateLeaveStatus();
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
    

    return (
        <>
            <div className="leaveApprovalSection cardShadow">
                <div className="cardCustomTitle">Leave Approval</div>
                <div className="scrollLeaveApproval customScroll">
                    {isLoadingAllLeaves ? (
                        <Loader />
                    ) : allLeaves && !allLeaves?.length ? (
                        <div className="emptyListText" style={{marginTop: "10px"}}>
                            No Leaves For Approval
                        </div>
                    ) : (
                        allLeaves &&
                        allLeaves?.map((item) => (
                            <div className="leaveApproval container-fluid">
                                <Row className="leaveApprovalRow d-flex align-items-center">
                                    <Col xs={3} sm={3} lg={2} className="px-0">
                                        <div className="date">
                                            <span>
                                                {Moment(item.leave_date).format("DD MMM YY")}
                                            </span>{" "}
                                            -{" "}
                                            <span>
                                                {Moment(item.leave_to_date).format("DD MMM YY")}
                                            </span>
                                        </div>
                                    </Col>
                                    <Col xs={7} sm={7} md={5} lg={6} className="px-0">
                                        <div className="name">
                                            <p>
                                                {item.first_name} {item.last_name}
                                            </p>
                                        </div>
                                    </Col>
                                    <Col xs={1} sm={1} md={2} className="approvalButtonsCol px-0">
                                        <Button
                                            variant="outline-danger"
                                            onClick={() =>
                                                deleteClickHandler(item.common_leave_uuid)
                                            }
                                        >
                                            <BsXLg />
                                        </Button>
                                    </Col>
                                    <Col xs={1} sm={1} md={2} className="px-0">
                                        <Button
                                            variant="outline-primary px-0 px-sm-1"
                                            onClick={() =>
                                                approveClickHandler(item.common_leave_uuid, item)
                                            }
                                        >
                                            <FaCheck />
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        ))
                    )}
                </div>
                
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

export default LeaveApproval;
