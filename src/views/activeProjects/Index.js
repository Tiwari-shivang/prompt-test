import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {useRecoilValue} from "recoil";
import Breadcrumb from "../../components/Breadcrumb";
import {useGetActiveProjects} from "../../query/projects/allProjects/allProjectsQuery";
import {authState} from "../../recoil/authRecoil";
import Loader from "../widgets/loader/Loader";
import "./style.scss";

const Index = () => {
    const empDetail = useRecoilValue(authState);
    const {data, isLoading} = useGetActiveProjects();

    const activeProjectsColumns = [
        {dataField: "dummy1", text: "S.No", formatter: (cellContent, row, index) => index + 1},
        {
            dataField: "tech_stack",
            text: "Tech Stack (FE/BE)",
            formatter: (cellContent, row) => cellContent || "-",
        },
        {
            dataField: "project_name",
            text: "Project Name (A-Z)",
            sort: true,
            formatter: (cellContent, row) => cellContent || "-",
        },
        {
            dataField: "pm_name",
            text: "HVT PM",
            formatter: (cellContent, row) => cellContent || "-",
        },
        {
            dataField: "snr_pm_name",
            text: "Senior PM",
            formatter: (cellContent, row) => cellContent || "-",
        },
        // {
        //     dataField: "share_point",
        //     text: "Share Point",
        //     formatter: (cellContent, row) => cellContent || "-",
        // }, Will be done later
        {
            dataField: "project_status",
            text: "Project Status",
            formatter: (cellContent, row) =>
                cellContent ? (
                    <a target="_blank" href={cellContent}>
                        Link
                    </a>
                ) : (
                    "-"
                ),
        },
    ];

    return (
        <Container>
            <Row className="nav mb-2">
                <Col xs={4}>
                    <Breadcrumb />
                </Col>
            </Row>
            <Row className="activeProjects viewCard customScroll">
                <Col sm={12}>
                    <div className="cardCustomTitle mb-3">Active Projects</div>
                    <BootstrapTable
                        keyField="uuid"
                        data={data || []}
                        noDataIndication={() =>
                            isLoading ? (
                                <Loader />
                            ) : !data || !data.length ? (
                                <div className="emptyListText">No active projects found</div>
                            ) : (
                                ""
                            )
                        }
                        columns={activeProjectsColumns}
                        condensed
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Index;
