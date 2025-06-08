import React, {useState} from "react";
import {Col, Container, Row, Tab, Tabs} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {FaChevronLeft, FaChevronRight, FaCircle, FaDotCircle} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import Breadcrumb from "../../../components/Breadcrumb";
import "./style.scss";

const Index = () => {
    const navigate = useNavigate();
    const [bugModalVisible, setBugModalVisible] = useState(false);
    const [key, setKey] = useState("tabularView");

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
    const columnTabularView = [
        {
            // dataField: 'day',
            text: "Date",
            formatter: (cellContent, row) => <div className="dateCol">Mon, 19-Mar-2023</div>,
        },
        {
            dataField: "title",
            text: "First In",
            formatter: (cellContent, row) => <div className="checkInCol">00:00am</div>,
        },
        {
            dataField: "title",
            text: "Last Out",
            formatter: (cellContent, row) => <div className="checkInCol">00:00am</div>,
        },
        {
            dataField: "",
            text: "Total hours",
            formatter: (cellContent, row) => <div className="totalHoursCol">00:00</div>,
        },
        {
            dataField: "",
            text: "Payable hours",
            formatter: (cellContent, row) => <div className="payableHoursCol">00:00</div>,
        },
        {
            dataField: "",
            text: "Status",
            formatter: (cellContent, row) => <div className="statusCol">Weekend</div>,
        },
        {
            dataField: "",
            text: "Shift",
            formatter: (cellContent, row) => (
                <div className="shiftCol">General (10 : 00 AM-07 : 00 PM)</div>
            ),
        },

        {
            dataField: "",
            text: "Regularisation",
            formatter: (cellContent, row) => <div className="regularisationCol">-</div>,
        },
    ];
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
                    <div className="dateNav">
                        <button>
                            <FaChevronLeft />
                        </button>
                        <div className="dateInfo">01-Jan-2022 - 31-Dec-2022</div>
                        <button>
                            <FaChevronRight />
                        </button>
                    </div>
                </Col>
                <Col xs={12}>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="tabularView" title="Fill Timesheet/date">
                            <Col xs={12}>
                                <BootstrapTable
                                    keyField="employee_id"
                                    wrapperClasses="tabularTable"
                                    data={data}
                                    columns={columnTabularView}
                                    condensed
                                    bordered={false}
                                />
                            </Col>
                        </Tab>
                        <Tab eventKey="calendarView" title="Calendar View">
                            <Col xs={12}>
                                <BootstrapTable
                                    keyField="employee_id"
                                    wrapperClasses="calendarTable"
                                    data={calendarData}
                                    columns={columnCalendarView}
                                    condensed
                                />
                            </Col>
                        </Tab>
                    </Tabs>
                </Col>
                {/* <Col xs={12}>
					<BootstrapTable
						keyField="employee_id"
						data={data}
						columns={weekDays}
						condensed
						bordered={false}
					/>
				</Col>
				<Col xs={12} className='timeMarkers'>
					<div className='lines' />
					<div className='lines' />
					<div className='lines' />
					<div className='lines' />
					<div className='lines' />
					<div className='lines' />
					<div className='lines' />
					<div className='lines' />
					<div className='lines linesTerminalRight' />
				</Col>
				<Col xs={12} className='checkInOutTime'>
					<span>10am</span>
					<span>07pm</span>
				</Col> */}
            </Row>
        </Container>
    );
};

export default Index;
