import React, {useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import Breadcrumb from "../../../../components/Breadcrumb";
import "./style.scss";
import RateModal from "../../../modals/rate/Index";
import {UseGetAllMenteeUnderEmployee} from "../../../../query/members/allMembers/allMembersQuery";
import {useRecoilValue} from "recoil";
import {authState} from "../../../../recoil/authRecoil";
import {useNavigate} from "react-router-dom";
import {FaUserAlt} from "react-icons/fa";

const Index = () => {
    const navigate = useNavigate();
    const empDetail = useRecoilValue(authState);
    const {data: allPendingRequest} = UseGetAllMenteeUnderEmployee(empDetail && empDetail.uuid);
    const [traineeId, setTraineeId] = useState();
    const columns = [
        {
            dataField: "",
            text: "Photos",
            formatter: (cellContent, row) => (
                <div className="reqHead">
                    <div
                        className="headPic"
                        onClick={() => navigate(`/members/memberDetail/${row.id}`)}
                    >
                        {row && row.profile_picture ? (
                            <img src={row.profile_picture} alt="" />
                        ) : (
                            <FaUserAlt className="userIcon" />
                        )}
                    </div>
                    <div>
                        <p>{row.trainee_name}</p>
                    </div>
                </div>
            ),
        },
        {
            dataField: "email",
            text: "Email",
        },
        {
            text: "Period",
            // headerStyle: (colum, colIndex) => {
            // 	return { width: '17%', textAlign: 'left' };
            // },
            formatter: (cellContent, row) => (
                <div className="dateCol">
                    {row.start_date} - {row.end_date}
                </div>
            ),
        },
        {
            text: "Action",
            headerStyle: (colum, colIndex) => {
                return {width: "3%", textAlign: "left"};
            },
            formatter: (cellContent, row) => (
                <div className="actionCol">
                    <button
                        type="button"
                        class="btn btn-primary btn-sm approveBtn"
                        onClick={() => {
                            setTraineeId(row.emp.uuid);
                            setRateModalVisible(true);
                        }}
                    >
                        Rate
                    </button>
                </div>
            ),
        },
    ];
    const [rateModalVisible, setRateModalVisible] = useState(false);
    return (
        <>
            <Container>
                <Row className="nav mb-2">
                    <Col xs={4}>
                        <Breadcrumb />
                    </Col>
                </Row>
            </Container>
            <div className="pendingRequestsList">
                <BootstrapTable
                    keyField="id"
                    data={allPendingRequest ? allPendingRequest : []}
                    columns={columns}
                    condensed
                />
            </div>
            <RateModal
                rateModalVisible={rateModalVisible}
                setRateModalVisible={setRateModalVisible}
                traineeId={traineeId}
            />
        </>
    );
};

export default Index;
