import React from "react";
import "./style.scss";
import {useNavigate} from "react-router-dom";
import {useGetNewJoinee} from "../../../query/members/allMembers/allMembersQuery";
import {FaUserAlt} from "react-icons/fa";
import Loader from "../../widgets/loader/Loader";

const NewJoinee = () => {
    const navigate = useNavigate();
    const {data: newJoinee, isLoading: isNewJoineeLoading} = useGetNewJoinee();
    const handleEmployeeDetail = (id) => {
        navigate(`/members/memberDetail/${id}`);
    };

    return (
        <div className="listOfNewJoinee cardShadow">
            <div className="cardCustomTitle">New Joinees</div>
            <div className="newJoineesList customScroll">
                {isNewJoineeLoading ? (
                    <Loader />
                ) : !newJoinee.length ? (
                    <div className="emptyListText">No New Joinees Found</div>
                ) : (
                    newJoinee &&
                    newJoinee.map((item, index) =>
                        index > 4 ? (
                            ""
                        ) : (
                            <div
                                className="aboutNewJoinee"
                                key={index}
                                onClick={() => handleEmployeeDetail(item.uuid)}
                            >
                                <div className="newJoineePic">
                                    {/* <img src={avatar1} alt=""/> */}
                                    {item && item.profile_picture ? (
                                        <img src={item.profile_picture} alt="img" />
                                    ) : (
                                        <FaUserAlt className="userIcon" />
                                    )}
                                </div>
                                <div className="newJoineeDetail">
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
                <button disabled={!newJoinee} onClick={() => navigate("/dashboard/JoineeList")}>
                    View Full List
                </button>
            </div>
        </div>
    );
};

export default NewJoinee;
