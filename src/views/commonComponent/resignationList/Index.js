import React from "react";
import "./style.scss";
import Loader from "../../widgets/loader/Loader";
import {useNavigate} from "react-router-dom";
import {useGetEmpUnderResignation} from "../../../query/members/allMembers/allMembersQuery";
import {FaUserAlt} from "react-icons/fa";

const ResignationList = () => {
    const navigate = useNavigate();
    const {data: empUnderResignation, isLoading: isEmpUnderResignationLoading} =
        useGetEmpUnderResignation();
    const handleEmployeeDetail = (id) => {
        navigate(`/members/memberDetail/${id}`);
    };

    return (
        <div className="listOfUnderResignation cardShadow">
            <div className="cardCustomTitle">Under Resignation</div>
            <div className="underResignationsList customScroll">
                {isEmpUnderResignationLoading ? (
                    <Loader />
                ) : !empUnderResignation || !empUnderResignation.length ? (
                    <div className="emptyListText mt-3">No Employees Under Resignation Found</div>
                ) : (
                    empUnderResignation &&
                    empUnderResignation.map((item, index) =>
                        index > 4 ? (
                            ""
                        ) : (
                            <div
                                className="aboutUnderResignation"
                                key={index}
                                onClick={() => handleEmployeeDetail(item.uuid)}
                            >
                                <div className="underResignationPic">
                                    {/* <img src={avatar1} alt=""/> */}
                                    {item && item.profile_picture ? (
                                        <img src={item.profile_picture} alt="" />
                                    ) : (
                                        <FaUserAlt className="userIcon" />
                                    )}
                                </div>
                                <div className="underResignationDetail">
                                    <p>
                                        {item.first_name} {item.last_name}
                                    </p>
                                    <p>{item.designation_name}</p>
                                </div>
                            </div>
                        )
                    )
                )}
            </div>
            <div className="viewFullListButton">
                <button
                    disabled={!empUnderResignation}
                    onClick={() => navigate("/dashboard/ResignationList")}
                >
                    View Full List
                </button>
            </div>
        </div>
    );
};

export default ResignationList;
