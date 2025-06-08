import React, {useEffect, useState} from "react";
import {Button, Col, Row, Tab, Tabs} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {FaChevronLeft, FaChevronRight, FaCircle, FaDotCircle} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import Breadcrumb from "../../../../components/Breadcrumb";
import {useGetAttendanceListView} from "../../../../query/attendance/attendanceQuery";
import {authState} from "../../../../recoil/authRecoil";
import Moment from "moment";

import "./style.scss";

const Index = () => {
    const navigate = useNavigate();
    const empDetail = useRecoilValue(authState);
    const [sundayDate, setSundayDate] = useState("");
    const [saturdayDate, setSaturdayDate] = useState("");
    const [credential, setCredential] = useState({
        "empUuid": "",
        "startDate": "",
        "endDate": "",
    });

    const {data: attendanceList, refetch} = useGetAttendanceListView(credential);

    const columnListView = [
        {
            // dataField: 'day',
            // text: 'day',
            headerStyle: (colum, colIndex) => {
                return {width: "80px"};
            },
            formatter: (cellContent, row) => <div className="dayCol">{row && row.date}</div>,
        },
        {
            dataField: "title",
            headerStyle: (colum, colIndex) => {
                return {width: "80px"};
            },
            text: "Check-in",
            formatter: (cellContent, row) => (
                <div className="checkInCol">{row.check_in_time ? row.check_in_time : "--:--"}</div>
            ),
        },
        {
            // text: 'time',
            headerStyle: (colum, colIndex) => {
                return {textAlign: "center"};
            },
            formatter: (cellContent, row) => (
                <div className="progressBarinfo">
                    <FaDotCircle className="terminalBullets" />
                    <FaCircle className="terminalDot" />
                    <FaDotCircle className="terminalBullets" />
                    <FaCircle
                        className={row && row.is_weekend ? "d-none" : "terminalDotInsideLeft"}
                    />
                    <div className="progressBar">
                        <div
                            className={`progress-bar ${
                                row && row.is_weekend == true ? "bg-warning" : "bg-success"
                            }`}
                            style={{width: row && row.is_weekend == true ? "100%" : "27%"}}
                        />
                    </div>
                    <p className={row && row.is_weekend == true ? "dayInfo" : "d-none"}>Weekend</p>
                    <FaCircle
                        className={row && row.is_weekend ? "d-none" : "terminalDotInsideRight"}
                    />
                    <FaDotCircle className="terminalBullets" />
                    <FaCircle className="terminalDot" />
                    <FaDotCircle className="terminalBullets" />
                </div>
            ),
        },
        {
            dataField: "",
            text: "Check-out",
            headerStyle: (colum, colIndex) => {
                return {width: "80px"};
            },
            formatter: (cellContent, row) => (
                <div className="checkOutCol">{row.checkout_time ? row.checkout_time : "--:--"}</div>
            ),
        },
        {
            dataField: "",
            text: "Total hours",
            headerStyle: (colum, colIndex) => {
                return {width: "80px"};
            },
            formatter: (cellContent, row) => (
                <div className="totalHoursCol">{row.total_time ? row.total_time : "--:--"}</div>
            ),
        },
    ];

    useEffect(() => {
        // debugger
        var curr = new Date();
        var first = curr.getDate() - curr.getDay();
        var last = first + 6;
        const sundayDate = new Date(curr.setDate(first));
        const saturdayDate = new Date(curr.setDate(last));
        setSundayDate(sundayDate);
        setSaturdayDate(saturdayDate);

        setCredential({
            "empUuid": empDetail && empDetail.uuid,
            "startDate": Moment(sundayDate).format("DD-MM-YYYY"),
            "endDate": Moment(saturdayDate).format("DD-MM-YYYY"),
        });
    }, []);

    const fetchAttendanceData = (data) => {
        if (data === "prev") {
            const prevSunday = new Date(
                sundayDate.getFullYear(),
                sundayDate.getMonth(),
                sundayDate.getDate() - 7
            );
            const prevSaturday = new Date(
                saturdayDate.getFullYear(),
                saturdayDate.getMonth(),
                saturdayDate.getDate() - 7
            );
            setSundayDate(prevSunday);
            setSaturdayDate(prevSaturday);
            setCredential({
                "empUuid": empDetail && empDetail.uuid,
                "startDate": Moment(prevSunday).format("DD-MM-YYYY"),
                "endDate": Moment(prevSaturday).format("DD-MM-YYYY"),
            });
        } else {
            const nextSunday = new Date(
                sundayDate.getFullYear(),
                sundayDate.getMonth(),
                sundayDate.getDate() + 7
            );
            const nextSaturday = new Date(
                saturdayDate.getFullYear(),
                saturdayDate.getMonth(),
                saturdayDate.getDate() + 7
            );
            setSundayDate(nextSunday);
            setSaturdayDate(nextSaturday);
            setCredential({
                "empUuid": empDetail && empDetail.uuid,
                "startDate": Moment(nextSunday).format("DD-MM-YYYY"),
                "endDate": Moment(nextSaturday).format("DD-MM-YYYY"),
            });
        }
    };

    useEffect(() => {
        refetch();
    }, [sundayDate]);

    return (
        <div className="container">
            <Row className="nav mb-2">
                <Col xs={6}>
                    <Breadcrumb />
                </Col>
                <Col xs={6} className=""></Col>
            </Row>
            <Row className="timesheet">
                <Col xs={12} className="headerRowMain">
                    <div className="dateNav">
                        <Button>
                            <FaChevronLeft onClick={() => fetchAttendanceData("prev")} />
                        </Button>
                        <div className="dateInfo">
                            {Moment(sundayDate).format("DD-MM-YYYY")} -{" "}
                            {Moment(saturdayDate).format("DD-MM-YYYY")}
                        </div>
                        <Button>
                            <FaChevronRight onClick={() => fetchAttendanceData("next")} />
                        </Button>
                    </div>
                    <BootstrapTable
                        keyField="date"
                        wrapperClasses="listTable"
                        data={
                            attendanceList && attendanceList.employee_attendance_list
                                ? attendanceList.employee_attendance_list
                                : []
                        }
                        columns={columnListView}
                        condensed
                        bordered={false}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default Index;
