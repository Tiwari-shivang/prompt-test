import React from "react";
import {Button, Col, Row} from "react-bootstrap";
import {FaUserAlt} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {UseGetAllMenteeUnderEmployee} from "../../../query/members/allMembers/allMembersQuery";
import {authState} from "../../../recoil/authRecoil";
import Loader from "../../widgets/loader/Loader";
import "./style.scss";
const PendingRequests = () => {
    const navigate = useNavigate();
    const empDetail = useRecoilValue(authState);
    const {data: allPendingRequest, isLoading: isAllPendingRequestLoading} =
        UseGetAllMenteeUnderEmployee(empDetail?.id);

    return (
        <div className="pendingRequestsSection cardShadow">
            <div className="cardCustomTitle">Pending Requests</div>
            <div className="scrollPendingRequests customScroll">
                {isAllPendingRequestLoading ? (
                    <Loader />
                ) : !allPendingRequest?.length ? (
                    <div className="emptyListText" style={{marginTop: "13px"}}>
                        No Requests Found
                    </div>
                ) : (
                    allPendingRequest &&
                    allPendingRequest.map((item, index) => (
                        <div className="pendingRequests container">
                            <Row className="gx-0 pendingRequestsRow">
                                <Col xs={2}>
                                    <div className="employeePic">
                                        {item && item.profile_picture ? (
                                            <img src={item.profile_picture} alt="" />
                                        ) : (
                                            <FaUserAlt className="userIcon" />
                                        )}
                                    </div>
                                </Col>
                                <Col xs={7}>
                                    <div className="name">
                                        <p>{item.trainee_name}</p>
                                    </div>
                                </Col>
                                <Col xs={3}>
                                    <div className="cancel">
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => navigate("/pendingRequestsList")}
                                        >
                                            Rate
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PendingRequests;
