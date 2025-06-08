import Moment from "moment";
import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {FaChevronLeft, FaChevronRight, FaCircle, FaDotCircle} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import Breadcrumb from "../../../../components/Breadcrumb";
import {authState} from "../../../../recoil/authRecoil";
import "./style.scss";
import { Calendar } from "antd";
import "antd/dist/antd.css";

const Index = () => {
    const navigate = useNavigate();
    const empDetail = useRecoilValue(authState);
    const [credential, setCredential] = useState({
        "empUuid": "",
        "startDate": "",
        "endDate": "",
    });

    useEffect(() => {
        var curr = new Date();
        var first = curr.getDate() - curr.getDay();
        var last = first + 6;

        var sundayDate = new Date(curr.setDate(first));
        var saturdayDate = new Date(curr.setDate(last));
        setCredential({
            "empUuid": empDetail && empDetail.uuid,
            "startDate": Moment(sundayDate).format("DD-MM-YYYY"),
            "endDate": Moment(saturdayDate).format("DD-MM-YYYY"),
        });
    }, []);

    const data = [
        {
            day: "asfasfd",
            title: "00:00am",
            weekend: true,
        },
        {
            day: "asfasfd",
            title: "00:00am",
            weekend: false,
        },
        {
            day: "asfasfd",
            title: "00:00am",
            weekend: false,
        },
        {
            day: "asfasfd",
            title: "00:00am",
            weekend: false,
        },
        {
            day: "asfasfd",
            title: "00:00am",
            weekend: false,
        },
        {
            day: "asfasfd",
            title: "00:00am",
            weekend: false,
        },
        {
            day: "1",
            title: "00:00am",
            weekend: true,
        },
    ];
    const calendarData = [{}, {}, {}, {}];
    const columnCalendarView = [
        {
            // dataField: 'day',
            text: "Sun",
            formatter: (cellContent, row) => (
                <div className="weekendCol">
                    <div className="date">1</div>
                    <div className="note">Present</div>
                </div>
            ),
        },
        {
            dataField: "title",
            text: "Mon",
            formatter: (cellContent, row) => (
                <div>
                    <div className="date">1</div>
                    <div className="note">Present</div>
                </div>
            ),
        },
        {
            dataField: "title",
            text: "Tue",
            formatter: (cellContent, row) => (
                <div>
                    <div className="date">1</div>
                    <div className="note">Present</div>
                </div>
            ),
        },
        {
            dataField: "",
            text: "Wed",
            formatter: (cellContent, row) => (
                <div>
                    <div className="date">1</div>
                    <div className="note">Present</div>
                </div>
            ),
        },
        {
            dataField: "",
            text: "Thu",
            formatter: (cellContent, row) => (
                <div>
                    <div className="date">1</div>
                    <div className="note">Present</div>
                </div>
            ),
        },
        {
            dataField: "",
            text: "Fri",
            formatter: (cellContent, row) => (
                <div>
                    <div className="date">1</div>
                    <div className="note">Present</div>
                </div>
            ),
        },
        {
            dataField: "",
            text: "Sat",
            formatter: (cellContent, row) => (
                <div className="weekendCol">
                    <div className="date">1</div>
                    <div className="note">Present</div>
                </div>
            ),
        },
    ];

    return (
        <Container>
            <Row className="nav mb-2">
                <Col xs={6}>
                    <Breadcrumb />
                </Col>
                <Col xs={6} className=""></Col>
            </Row>
            <Row className="timesheet">
                <Col xs={12} className="headerRowMain">
                    <Calendar
                        className="calendarWrapper"
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Index;
