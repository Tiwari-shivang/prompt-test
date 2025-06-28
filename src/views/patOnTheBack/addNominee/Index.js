import "antd/dist/antd.css";
import React from "react";
import {Button, Col, Container, Modal, Row} from "react-bootstrap";
import {authState} from "../../../recoil/authRecoil";

import {Popconfirm} from "antd";
import {useState} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {useForm} from "react-hook-form";
import {useLocation, useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {requiredField} from "../../../utilits/validation";
// import { CommentViewModal } from "../../managementReporting/feedback/Index";
import "./style.scss";
import Breadcrumb from "../../../components/Breadcrumb";

const PotbModule = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const {empUuid} = location.state;
    const [rating, setRating] = useState(3);
    // const {data: empData} = useGetMembersById(empUuid ?? "");
    const empDetails = useRecoilValue(authState);
    const [potbModalOpen, setPotbModalOpen] = useState(false);
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [modalData, setModalData] = useState({});
    const [commentToShow, setCommentToShow] = useState("");

    // const {data: allPotbs, isLoading: isLoadingAllPotbs} = useGetEmployeeRatingByEmpUuid(empUuid);

    // useEffect(() => {
    //     if (empUuid == null || empUuid == undefined) navigate("/exportUtilizationData");
    // }, []);
    const editClickHandler = (data) => {
        setModalData(data);
        setPotbModalOpen(true);
    };
    const addClickHandler = () => {
        setModalData({});
        setPotbModalOpen(true);
    };
    const viewMoreClickHandler = (comment) => {
        setCommentToShow(comment);
        setCommentModalOpen(true);
    };

    const potbColumns = [
        {	
			dataField: 'sno',
            text: "S.No.",
            formatter: (cellContent, row, index) => index + 1,
        },
        {
            dataField: "name",
            text: "Name",
            formatter: (cellContent, row) => cellContent || "N/A",
        },
        {
            dataField: "repManager",
            text: "Reporting Manager",
            formatter: (cellContent, row) => cellContent || "N/A",

            // headerStyle: (colum, colIndex) => {
            //     return {textAlign: "left", width:'30%'};
            // },
            // align: "left",
            // formatter: (cellContent, row, index) =>
            //     cellContent && cellContent.length > 100 ? (
            //         <>
            //             {cellContent.substring(0, 100)}...
            //             <b className=" boldBtn" onClick={() => viewMoreClickHandler(cellContent)}>
            //                 view more
            //             </b>
            //         </>
            //     ) : (
            //         cellContent || "N/A"
            //     ),
        },
        {
            dataField: "rating",
            text: "Issued on",
            formatter: (cellContent, row) => cellContent || "N/A",
        },
        {
            dataField: "desc",
            text: "Description",
            formatter: (cellContent, row, index) =>
                cellContent && cellContent.length > 100 ? (
                    <>
                        {cellContent.substring(0, 100)}...
                        <b className=" boldBtn" onClick={() => viewMoreClickHandler(cellContent)}>
                            view more
                        </b>
                    </>
                ) : (
                    cellContent || "N/A"
                ),
        },
        {
            dataField: "status",
            text: "Status",
            formatter: (cellContent, row) => "Pending",
        },
    ];

    return (
        <Container>
            <Row className="nav mb-2">
                <Col xs={12} sm={6}>
                    <Breadcrumb />
                </Col>
            </Row>
            <Row className="potbModule">
                <Col sm={3} className="d-flex">
                    <div className="headerRow cardCustomTitle">All POTBs</div>
                </Col>
                <Col sm={9} className="d-flex justify-content-end">
                    <Button
                        size="sm"
                        className="btn btn-primary submitBtn my-1"
                        onClick={addClickHandler}
                    >
                        Add Nominee
                    </Button>
                </Col>
                <Col sm={12}>
                    <BootstrapTable
                        keyField="id"
                        wrapperClasses="table-center-align"
                        data={[]}
                        columns={potbColumns}
                        noDataIndication={() =>
							<span className="emptyListText">No Applications Found.</span>
                           
                        }
                        condensed
                        bordered={false}
                    />
                </Col>
                <AddPotbModal
                    showModal={potbModalOpen}
                    closeModal={() => setPotbModalOpen(false)}
                    // empUuid={empUuid}
                    modalData={modalData}
                />
            </Row>
        </Container>
    );
};

export const AddPotbModal = ({showModal, closeModal, empUuid, modalData}) => {
    const {register, handleSubmit, reset, setError, clearErrors, watch, errors, formState} =
        useForm({
            mode: "onTouched",
        });

    const onSubmit = (data) => {
        console.log(data);
    };

    const handleOnCancel = () => {
        closeModal();
    };
    return (
        <Modal className="commonModal" show={showModal} onHide={handleOnCancel} centered>
            <Modal.Header>
                <Modal.Title className="cardCustomTitle">
                    Add Nominee
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="container">
                <form className="formTodo" onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={12} className="mb-3">
                            <label>Employee*</label>
                            <select
                                className="form-control"
                                name="locationName"
                                ref={register({
                                    required: requiredField(),
                                })}
                            >
                                <option value="">Select Employee</option>
                            </select>
                        </Col>
                        <Col sm={12} className="mb-3">
                            <label>Reporting Manager*</label>
                            <select className="form-control" name="locationName" ref={register({})}>
                                <option value="">Select Employee</option>
                            </select>
                        </Col>
                        <Col sm={12} className="mb-3">
                            <label>Description</label>
                            <textarea
                                type="text"
                                className="form-control customScroll"
                                name="client_description"
                                ref={register({
                                    required: requiredField(),
                                })}
                            />
                            {/* {errors.client_description && (
                                <small className="form-text text-danger">
                                    {errors.client_description.message}
                                </small>
                            )} */}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} className="buttonSection">
                            <Button size="sm" className="btn btn-primary addBtn" type="submit">
                                {"Submit"}
                            </Button>
                            <Popconfirm title="Are you sure?" onConfirm={handleOnCancel}>
                                <Button size="sm" className="btn btn-danger">
                                    Cancel
                                </Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal>
    );
};
export default PotbModule;
