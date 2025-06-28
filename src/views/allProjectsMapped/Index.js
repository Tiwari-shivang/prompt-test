import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import Breadcrumb from "../../components/Breadcrumb";
import "./style.scss";

const Index = () => {
    const membersCol = [
        {
            dataField: "employee_name",
            text: "Employee Name",
            style: {
                textAlign: "start",
            },
            sort: true,
        },
        {
            dataField: "billability ",
            text: "Billability %",
        },
        {
            dataField: "allocation",
            text: "Allocation %",
        },
        {
            dataField: "utilization",
            text: "Utilization %",
        },
    ];
    return (
        <Container>
            <Row className="mb-2">
                <Col xs={6}>
                    <Breadcrumb />
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <BootstrapTable
                        keyField="employee_uuid"
                        wrapperClasses="membersTable table-center-align"
                        noDataIndication={() => <span>No Members Found.</span>}
                        data={[{}, {}, {}]}
                        columns={membersCol}
                        condensed
                        bordered={false}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Index;
