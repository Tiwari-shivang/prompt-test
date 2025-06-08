import React from "react";
import "./style.scss";
import Loader from "../../widgets/loader/Loader";
import {Link, useNavigate} from "react-router-dom";
import {useGetAllMembers} from "../../../query/members/allMembers/allMembersQuery";
import {FaUserAlt} from "react-icons/fa";
const ListOfEmployee = () => {
    const navigate = useNavigate();
    const {data: allMember, isLoading} = useGetAllMembers();
    const handleEmployeeDetail = (id) => {
        navigate(`/members/memberDetail/${id}`);
    };
    return (
        <div className="listOfEmployee cardShadow">
            <div className="cardCustomTitle">List Of All Employees</div>
            <div className="EmployeesList customScroll">
                {isLoading ? (
                    <Loader />
                ) : !allMember?.employees.length ? (
                    <div className="emptyListText">No Employees Found</div>
                ) : (
                    allMember &&
                    allMember?.employees.map((item, index) =>
                        index > 4 ? (
                            "" //max. number of employees to show = 5
                        ) : (
                            <div
                                className="aboutEmployee"
                                key={index}
                                onClick={() => handleEmployeeDetail(item.uuid)}
                            >
                                <div className="employeePic">
                                    {item && item.profile_picture ? (
                                        <img src={item.profile_picture} alt="" />
                                    ) : (
                                        <FaUserAlt className="userIcon" />
                                    )}
                                </div>
                                <div className="employeeDetail">
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
                    disabled={!allMember?.employees}
                    onClick={() => navigate("/dashboard/employeeList")}
                >
                    View Full List
                </button>
            </div>
        </div>
    );
};

export default ListOfEmployee;
