import React, {useEffect, useState} from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import {Row, Col, Button, Table, Badge, Form} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {useGetAllHolidays} from "../../../query/holidays/holidaysQuery";
import {BsTrash, BsGrid} from "react-icons/bs";
import {FaUserAlt, FaChevronLeft, FaChevronRight} from "react-icons/fa";
import {BiEdit} from "react-icons/bi";
import {useGetTicketsForItDashboard} from "../../../query/helpdesk/getHelpdesk/getHelpdeskQuery";
import {useUpdateTicketStatus} from "../../../query/helpdesk/updateHelpDesk/updateHelpdeskQuery";
import "./style.scss";
import Moment from "moment";
import {
    RiFilterLine,
    RiLayoutGridLine,
    RiUser3Line,
    RiMenu3Fill,
    RiExternalLinkFill,
    RiUserAddLine,
    RiGitMergeLine,
    RiThumbUpFill,
    RiDeleteBin2Line,
} from "react-icons/ri";
import {
    FaCalendarAlt,
    FaEllipsisH,
    FaBirthdayCake,
    FaRegCalendarMinus,
    FaRegCalendar,
    FaRegCalendarCheck,
} from "react-icons/fa";
import {useRecoilValue} from "recoil";
import {authState} from "../../../recoil/authRecoil";
import Loader from "../../widgets/loader/Loader";

const Index = () => {
    const empDetail = useRecoilValue(authState);
    const [getAllLeaves, setGetAllLeaves] = useState({
        "id": empDetail?.location_uuid,
        "sort": "Upcoming",
    });
    const {data: allHolidays, isLoading: isHolidaysLoading} = useGetAllHolidays(getAllLeaves);

    const columns = [
        {
            dataField: "holiday_name",
            text: "Name",
        },
        {
            dataField: "date",
            text: "Date",
            formatter: (cellContent, row) => (
                <div className="dateCol">
                    {Moment(cellContent).format("L")} {Moment(cellContent).format("ddd")}
                </div>
            ),
        },
        {
            dataField: "location_name",
            text: "Location",
        },
    ];

    return (
        <>
            <Row className="nav mb-2">
                <Col xs={4}>
                    <Breadcrumb />
                </Col>
            </Row>
            <div className="holidays viewCard customScroll">
                <div className="cardCustomTitle mb-3">
                    <div className="holidaysText">Holidays List</div>
                </div>
                {isHolidaysLoading ? (
                    <div className="loadingScreen">
                        <Loader />
                    </div>
                ) : allHolidays && allHolidays.length === 0 ? (
                    <div className="emptyListText">No Holidays Found.</div>
                ) : (
                    <BootstrapTable
                        keyField="uuid"
                        data={allHolidays ? allHolidays : []}
                        columns={columns}
                        condensed
                    />
                )}
            </div>
        </>
    );
};

export default Index;
