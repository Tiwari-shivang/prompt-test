import { Calendar, Popover } from "antd";
import "antd/dist/antd.css";
import { Tab } from "bootstrap";
import Moment from "moment";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Tabs } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import Breadcrumb from "../../../components/Breadcrumb";
import {
	useGetAllLeavesCalendar,
	useGetTimesheetByMonth,
} from "../../../query/attendance/attendanceQuery";
import { useGetAllHolidays } from "../../../query/holidays/holidaysQuery";
import { useGetRmByEmpUuid } from "../../../query/members/allMembers/allMembersQuery";
import { authState } from "../../../recoil/authRecoil";
import Table from "../timeSheetTableNew/Index";
import "./style.scss";

const ListOfEmployee = () => {
    const [currentTab, setCurrentTab] = useState("timesheetView");
    const [dateToShow, setDateToShow] = useState(Moment().format("YYYY-MM-DD"));
    const [mode, setMode] = useState("Submit");
    const [timeSheetUuid, setTimeSheetUuid] = useState("");
    const [timesheetFilled, setTimesheetFilled] = useState(false);
    const empDetails = useRecoilValue(authState);
    const [datePrev, setDatePrev] = useState({month: Moment().month(), year: Moment().year()});
    const [dateMonthYear, setDateMonthYear] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });

    const {data: rmDetailByEmpId, isLoading: isLoadingAllRmDetail} = useGetRmByEmpUuid(
        empDetails && empDetails.uuid
    );
    const {data: allHolidays, isLoading: isLoadingAllHolidays} = useGetAllHolidays({
        id: empDetails && empDetails.location_uuid,
        date:
            dateMonthYear.year +
            "-" +
            ("0" + (dateMonthYear.month + 1)).slice(-2) +
            "-" +
            ("0" + new Date().getDate()).slice(-2),
    });

    const {data: allLeavesToShow} = useGetAllLeavesCalendar({
        empUuid: empDetails && empDetails.uuid,
        status: "Approved",
    });
    const {
        data: allTimesheets,
        isLoading: isloadingAllTimesheets,
        refetch: refetchTimesheetForCurrentMonth,
    } = useGetTimesheetByMonth({
        empUuid: empDetails?.uuid,
        month: dateMonthYear?.month + 1,
        year: dateMonthYear?.year,
    });

    useEffect(() => {
        if (allTimesheets && allTimesheets.length > 0) {
            const timeSheetStatusCheck =
                allTimesheets.filter(
                    (e) => e.time_sheet_date == dateToShow && e.time_sheet_status != "REJECTED"
                ).length > 0;
            timeSheetStatusCheck ? setTimesheetFilled(true) : setTimesheetFilled(false);
        }
    }, [allTimesheets && allTimesheets]);

    const showStatusAtDate = (value) => {
        //if timesheet found
        const timesheetIndex =
            allTimesheets &&
            allTimesheets.findIndex(
                (item) =>
                    new Date(item?.time_sheet_date).getDate() == value.date() &&
                    new Date(item?.time_sheet_date).getMonth() == value.month() &&
                    new Date(item?.time_sheet_date).getFullYear() == value.year()
            );

        if (timesheetIndex !== -1)
            return (
                <div
                    className={`strips ${
                        allTimesheets &&
                        (allTimesheets[timesheetIndex].time_sheet_status == "PENDING"
                            ? "pending"
                            : allTimesheets[timesheetIndex].time_sheet_status == "REJECTED"
                            ? "rejected"
                            : "accepted")
                    }`}
                />
            );

        //weekend
        if (Moment(value._d).day() === 6 || Moment(value._d).day() === 0) return "";

        //if date of prev/ next month
        if (value.month() != dateMonthYear.month) return;

        //holiday
        const holidayIndex =
            allHolidays &&
            allHolidays.findIndex(
                (item) =>
                    new Date(item?.date).getDate() == value.date() &&
                    new Date(item?.date).getMonth() == value.month() &&
                    new Date(item?.date).getFullYear() == value.year()
            );

        if (holidayIndex != -1)
            return (
                <Popover
                    placement="topLeft"
                    content={allHolidays && allHolidays[holidayIndex]?.holiday_name}
                >
                    <div className={`strips holiday`} />
                </Popover>
            );

        //if leave
        const leaveIndex =
            allLeavesToShow &&
            allLeavesToShow.findIndex(
                (item) =>
                    new Date(item?.leave_date).getDate() == value.date() &&
                    new Date(item?.leave_date).getMonth() == value.month() &&
                    new Date(item?.leave_date).getFullYear() == value.year()
            );
        if (leaveIndex != -1)
            return (
                <>
                    <Popover
                        placement="topLeft"
                        content={
                            <>
                                <p className="mb-0">
                                    -{" "}
                                    {allLeavesToShow && allLeavesToShow[leaveIndex]?.leave_day_type}{" "}
                                    Leave
                                </p>
                                <p className="mb-0">
                                    - {allLeavesToShow && allLeavesToShow[leaveIndex]?.leave_status}
                                </p>
                            </>
                        }
                    >
                        <div className={`strips leave`} />
                    </Popover>
                </>
            );

        // Future
        if (Moment(value._d) > new Date()) return "";

        // Past
        if (Moment(value._d) < new Date()) return <div className="strips notSubmitted" />;
    };

    const resetForm = () => {
        setTimeSheetUuid("");
    };

    const clickOnDate = (e) => {
        setTimeSheetUuid("");
        setTimesheetFilled(false);
        let selectedDateFormatted = Moment(e._d).format("YYYY-MM-DD");
        let selectedDate = Moment(e._d);
        setDatePrev({month: selectedDate.month(), year: selectedDate.year()});
        if (selectedDate.month() != datePrev.month || selectedDate.year() != datePrev.year) {
            return;
        }
        const timeSheetSelected = allTimesheets.filter(
            (e) => e.time_sheet_date == selectedDateFormatted
        );

        var dayOfWeek = e._d.getDay();
        var isWeekend = dayOfWeek === 6 || dayOfWeek === 0;

        if (timeSheetSelected.length && timeSheetSelected[0].time_sheet_status == "PENDING") {
            setMode("Update");
            setTimeSheetUuid(timeSheetSelected[0].time_sheet_uuid);
            setDateToShow(selectedDateFormatted);
            setCurrentTab("timesheetView");
            return;
        }

        if (timeSheetSelected.length && timeSheetSelected[0].time_sheet_status == "APPROVED") {
            setMode("Disabled");
            setTimeSheetUuid(timeSheetSelected[0].time_sheet_uuid);
            setDateToShow(selectedDateFormatted);
            setCurrentTab("timesheetView");
            return;
        }

        if (timeSheetSelected.length && timeSheetSelected[0].time_sheet_status == "REJECTED") {
            setMode("Submit");
            setTimeSheetUuid(timeSheetSelected[0].time_sheet_uuid);
            setDateToShow(selectedDateFormatted);
            setCurrentTab("timesheetView");
            return;
        }

        if (
            allLeavesToShow &&
            allLeavesToShow.findIndex(({leave_date}) => selectedDateFormatted == leave_date) != -1
        ) {
            return;
        }

        const timeSheetStatusCheck =
            allTimesheets.filter((e) => e.time_sheet_date == selectedDateFormatted).length > 0;

        const isTimeSheetSeleted = timeSheetSelected.length > 0;

        if (
            new Date(selectedDateFormatted) > new Date() ||
            new Date(selectedDateFormatted).getMonth() != datePrev.month //correct
        )
            return;

        if (isWeekend) {
            setMode("Submit");
            setDateToShow(selectedDateFormatted);
            setCurrentTab("timesheetView");
        }
        if (!timeSheetStatusCheck && e._d.getDay() != 6 && e._d.getDay() != 0) {
            setDateToShow(selectedDateFormatted);
            setCurrentTab("timesheetView");
            setMode("Submit");
        }
        if (isTimeSheetSeleted) {
            setTimeSheetUuid(timeSheetSelected[0].time_sheet_uuid);
            setDateToShow(selectedDateFormatted);
            setCurrentTab("timesheetView");
            setMode("Submit");
        }
    };

    const calendarChangeListener = (value) => {
        setDateMonthYear({
            month: value.month(),
            year: value.year(),
        });
    };

    const handleChangeTab = (key) => {
        if (key == "calendarView") {
            refetchTimesheetForCurrentMonth();
        }
        setCurrentTab(key);
    };

    return (
        <>
            <Container>
                <Row className="nav mb-2">
                    <Col xs={12} sm={6}>
                        <Breadcrumb />
                    </Col>
                    <Col
                        xs={12}
                        sm={6}
                        className="nameAndRoleInfo d-flex flex-column align-items-end"
                    >
                        <p className="keyAndValueText mb-0">
                            <span className="name">Employee Name: </span>{" "}
                            <span className="value">
                                {empDetails?.first_name} {empDetails?.last_name}
                            </span>
                        </p>
                        <p className="keyAndValueText mb-0">
                            <span className="name">Reporting Manager: </span>{" "}
                            <span className="value">
                                {rmDetailByEmpId && rmDetailByEmpId.first_name}{" "}
                                {rmDetailByEmpId && rmDetailByEmpId.last_name}
                            </span>
                        </p>
                    </Col>
                </Row>
            </Container>
            <div className="employeeTimesheet viewCard cardShadow customScroll">
                <Tabs
                    id="controlled-tab-example"
                    className="mb-1"
                    activeKey={currentTab}
                    onSelect={(key) => handleChangeTab(key)}
                >
                    <Tab
                        eventKey="timesheetView"
                        title={`Timesheet - ` + dateToShow}
                        className="searchBoxAndResultTab"
                    >
                        {/* {timesheetFilled ? (
                            <div style={{paddingLeft: "17px"}}>Timesheet for the {dateToShow} submitted.</div>
                        ) : (
                            ""
                        )} */}
                        <Table
                            mode={mode}
                            timeSheetUuid={timeSheetUuid}
                            resetForm={resetForm}
                            dateToShow={dateToShow}
                            currentTab={currentTab}
                            rmUuid={rmDetailByEmpId && rmDetailByEmpId.rm_uuid}
                            timesheetFilled={timesheetFilled}
                        />
                    </Tab>
                    <Tab
                        eventKey="calendarView"
                        title="Calendar View"
                        className="customScroll container calendarTab"
                    >
                        <Row className="calendarColumn">
                            <Col sm={12}>
                                <Calendar
                                    onSelect={clickOnDate}
                                    dateCellRender={showStatusAtDate}
                                    className="calendarWrapper"
                                    onChange={calendarChangeListener}
                                />
                            </Col>
                            <Col
                                xs={{span: 12, order: 3}}
                                sm={{span: 12, order: 3}}
                                md={{span: 6, order: 2}}
                                lg={6}
                                xl={8}
                                className="noteSection"
                            >
                                <div className="cardCustomTitle">Note</div>
                                <ol className="noteList ps-2">
                                    <li>
                                        If your timesheet is rejected you can click on the red bar ({" "}
                                        <span className="redStrip strip" /> ) to proceed filling the
                                        timesheet.
                                    </li>
                                    <li>
                                        If the timesheet is not submitted you can click on the
                                        yellow bar ( <span className="yellowStrip strip" /> ) to
                                        proceed filling the timesheet.
                                    </li>
                                </ol>
                            </Col>
                            <Col
                                xs={{span: 12, order: 2}}
                                sm={{span: 12, order: 2}}
                                md={{span: 6, order: 3}}
                                lg={6}
                                xl={4}
                                className="legendSection mb-sm-3"
                            >
                                <h6 className="cardCustomTitle">Legend</h6>
                                <div className="approvedStrip">Timesheet has been Approved</div>
                                <div className="pendingStrip">
                                    Timesheet is Pending for RM Approval
                                </div>
                                <div className="rejectedStrip">Timesheet has been Rejected</div>
                                <div className="notSubmittedStrip">
                                    Timesheet has not been Submitted
                                </div>
                                <div className="holidayStrip">Public holiday</div>
                                <div className="leaveStrip">Leave</div>
                            </Col>
                        </Row>
                    </Tab>
                </Tabs>
            </div>
        </>
    );
};
export default ListOfEmployee;
