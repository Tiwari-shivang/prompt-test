import React from "react";
import "./style.scss";
import Loader from "../../widgets/loader/Loader";
import {authState} from "../../../recoil/authRecoil";
import {useRecoilValue} from "recoil";

import {Link, useNavigate} from "react-router-dom";
import {useGetAllMenteeMentor} from "../../../query/members/allMembers/allMembersQuery";
import {FaUserAlt} from "react-icons/fa";
import ColumnGroup from "antd/lib/table/ColumnGroup";
const ListOfMentees = () => {
    const navigate = useNavigate();
    const empDetail = useRecoilValue(authState);
    const {data: allMentees, isLoading} = useGetAllMenteeMentor(empDetail && empDetail.uuid);
    const handleEmployeeDetail = (id) => {
        navigate(`/members/memberDetail/${id}`);
    };
    return (
        <div className="listOfMentees cardShadow">
            <div className="cardCustomTitle">List of Mentees</div>
            <div className="MenteesList customScroll">
                {isLoading ? (
                    <Loader />
                ) : !allMentees?.length ? (
                    <div className="emptyListText">No Mentees Found.</div>
                ) : (
                    allMentees &&
                    allMentees.map((item, index) =>
                        index > 4 ? (
                            "" //max. number of employees to show = 5
                        ) : (
                            <div
                                className="aboutMentee"
                                key={index}
                                onClick={() => handleEmployeeDetail(item.uuid)}
                            >
                                <div className="menteePic">
                                    {item && item.profile_picture ? (
                                        <img src={item.profile_picture} alt="" />
                                    ) : (
                                        <FaUserAlt className="userIcon" />
                                    )}
                                </div>
                                <div className="menteeDetail">
                                    <p>{item.full_name}</p>
                                    <p>{item.department_name}</p>
                                </div>
                            </div>
                        )
                    )
                )}
            </div>
            <div className="viewFullListButton">
                <button disabled={!allMentees} onClick={() => navigate("/dashboard/mentorList")}>
                    View Full List
                </button>
            </div>
        </div>
    );
};

export default ListOfMentees;
