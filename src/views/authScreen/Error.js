import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../assets/brand/logoWhite.svg";
import "./authCommon.scss";

const Error = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    return (
        <div className="authBg min-vh-100 d-flex flex-row">
            <Container>
                <Row className="min-vh-100">
                    <Col md={6}>
                        <div className="authLeftside pt-5">
                            <div className="logo">
                                <img src={logo} alt="" />
                            </div>
                            <div className="authContent">
                                <h1>Transform your Employee Lifecycle Management</h1>
                                <p>
                                    Get all-around productivity and engaged employees—the crucial
                                    ingredients for growth.
                                </p>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="authRightside">
                            <div className="authInputform">
                                <div className="loginHeading">
                                    <h5>User Login</h5>
                                    <p>Get all-around productivity and engagement</p>
                                </div>
                                <h5 className="text-center mt-3">
                                    Error: {searchParams.get("message")}
                                </h5>
                                <Button variant="primary" onClick={() => navigate("/login")}>
                                    Go back to Login
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Error;
