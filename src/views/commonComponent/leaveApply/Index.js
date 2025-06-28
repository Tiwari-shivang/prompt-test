import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LeaveHolidays from "../../../assets/images/emp/Leave-Holidays.svg";
import leave from "../../../assets/images/emp/leave.svg";
import LeaveModal from "../../modals/applyLeave/Index";
import "./style.scss";


const LeaveApply = () => {
    const navigate = useNavigate();
    const [applyLeaveModalVisible, setApplyLeaveModalVisible] = useState(false);

    return (
        <div className="employee-Leave-Holiday cardShadow py-3">
            <div
                xs={12}
                sm={12}
                md={6}
                className="employeeSection"
                onClick={() => setApplyLeaveModalVisible(true)}
            >
                <div className="img">
                    <img src={leave} alt="" />
                </div>
                <div className="detail">
                    <p>Apply For</p>
                    <p>
                        <span>Leave</span>
                    </p>
                </div>
            </div>
            <div
                xs={12}
                sm={12}
                md={6}
                className="employeeSection d-none d-md-flex"
                onClick={() => navigate("/holidays")}
            >
                <div className="img">
                    <img src={LeaveHolidays} alt="" />
                </div>
                <div className="detail">
                    <p>List Of All</p>
                    <p>
                        <span>Holidays</span>
                    </p>
                </div>
            </div>
            <LeaveModal
                applyLeaveModalVisible={applyLeaveModalVisible}
                setApplyLeaveModalVisible={setApplyLeaveModalVisible}
                leaveType={""}
            />
        </div>
    );
};

export default LeaveApply;
