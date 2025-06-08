import React, {useState} from "react";
import {Row, Col, Button, Modal, Container} from "react-bootstrap";
import {MdOutlineDelete} from "react-icons/md";
import "./style.scss";
import {useDeleteCertificate} from "../../../query/resume/deleteResume/deleteResumeQuery";
import {FaDownload, FaEye} from "react-icons/fa";
import Loader from "../../widgets/loader/Loader";
import {useRecoilValue} from "recoil";
import {authState} from "../../../recoil/authRecoil";
import {useGetAllCertificatesByEmpUuid} from "../../../query/employee/allEmployeeQuery";
import Moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import {convert24Hourto12Hour, formatDate} from "../../../utilits/usefulFunctions";
import {Popconfirm} from "antd";

const Index = (props) => {
    const {loading} = props;
    const empDetail = useRecoilValue(authState);
    const [deleteModel, setDeleteModel] = useState(false);
    const [ids, setIds] = useState("");
    const {mutateAsync: deleteCertificateMutateAsync, isLoading: isLoadingDeleteCertificate} =
        useDeleteCertificate();
    const {data: certis, isLoading: isLoadingCertificates} = useGetAllCertificatesByEmpUuid(
        empDetail?.uuid
    );
    const deleteCertificateHandler = (certificate_uuid) => {
        deleteCertificateMutateAsync(certificate_uuid);
        setDeleteModel(false);
    };

    const handleEyeClick = (certificate) => {
        let pdfWindow = window.open("");
        pdfWindow.document.write(`<body style='margin:0 !important;'><object width='100%' height='100%' style='object-fit: contain;' data=${certificate}></object></body>`);
    };

    const certificateColumns = 
	[
        {
            dataField: "S.No.",
            text: "S.No.",
            formatter: (cellContent, row, index) => index + 1,
        },
        {
            dataField: "skill_name",
            text: "Name",
            formatter: (cellContent) => <div className="skillNameCol">{cellContent || "N/A"}</div>,
        },
        {
            dataField: "upload_time",
            text: "Uploaded on",
            sort: true,
            formatter: (cellContent) =>
                formatDate(cellContent) +
                ", " +
                convert24Hourto12Hour(Moment(cellContent).format("HH:mm")),
        },
        { 	
			dataField: 'action',
            text: "Action",
            formatter: (cellContent, row) => (
                <div className="icons">
                    <span>
                        <a onClick={() => handleEyeClick(row?.certificate)}>
                            <FaEye className="eyeIcon" />
                        </a>
                    </span>
                    <span>
                        <a download={row?.skill_name} href={row?.certificate}>
                            <FaDownload className="pdfIcon" />
                        </a>
                    </span>
                    <span>
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => deleteCertificateHandler(row?.certificate_uuid)}
                        >
                            <MdOutlineDelete className="deleteIcon" />
                        </Popconfirm>
                    </span>
                </div>
            ),
        },
    ];

    return (
        <Container>
            <Row className="certificateSection">
                <Col xs={12}>
                    <div className="certificateRow customScroll">
                        
                            <BootstrapTable
                                keyField="certificate_uuid"
                                wrapperClasses="mb-2 table-center-align"
                                data={certis || []}
                                columns={certificateColumns}
                                noDataIndication={() =>
                                    isLoadingCertificates ? (
                                        <Loader />
                                    ) : !certis || !certis.length ? (
                                        <span>No Certificates Found.</span>
                                    ) : (
                                        ""
                                    )
                                }
                                condensed
                                bordered={false}
                            />
                            {/* {isLoadingCertificates ? (
                            <div>
                                <Loader />
                            </div>
                        ) : certificates && certificates.length == 0 ? (
                            "No Certificates added."
                        ) : (
                            certificates &&
                            certificates.map((item, index) => (
                                <>
                                    <Row className="mt-2">
                                        <Col xs={1}>
                                            <span>{index + 1}-</span>
                                        </Col>
                                        <Col xs={4}>
                                            <span>
                                                {item.skill_name == "" ||
                                                item.skill_name == undefined
                                                    ? "N/A"
                                                    : item.skill_name}
                                            </span>
                                        </Col>
                                        <Col xs={4}>
                                            <span>
                                                
											
                                            </span>
                                        </Col>
                                        <Col xs={3} className="icons">
                                            {" "}
                                            <span>
                                                {" "}
                                                <a
                                                    download={item.skill_name}
                                                    href={item.certificate}
                                                >
                                                    <FaDownload className="pdfIcon" />
                                                </a>
                                            </span>
                                            <span>
                                                <MdOutlineDelete
                                                    className="deleteIcon"
                                                    onClick={() =>
                                                        handleDeleteCertificate(
                                                            item.certificate_uuid
                                                        )
                                                    }
                                                />
                                            </span>
                                        </Col>
                                    </Row>
                                </>
                            ))
                        )} */}
                    </div>
                </Col>
                <DeleteCertificateModal
                    deleteModalOpen={deleteModel}
                    deleteModalClose={() => setDeleteModel(false)}
                    deleteId={ids}
                    deleteCertificateMutateAsync={deleteCertificateMutateAsync}
                />
            </Row>
        </Container>
    );
};

export const DeleteCertificateModal = ({
    deleteModalOpen,
    deleteModalClose,
    deleteId,
    deleteCertificateMutateAsync,
}) => {
    const deleteCertificateHandler = (e) => {
        e.preventDefault();
        const details = {
            id: deleteId,
        };
        deleteCertificateMutateAsync(details.id);
        deleteModalClose();
    };
    return (
        <>
            <Modal
                className="commonModal"
                show={deleteModalOpen}
                onHide={deleteModalClose}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Certificate</Modal.Title>
                </Modal.Header>
                <Modal.Body className="container">
                    <Row>
                        <Col sm={12}>
                            <p>Are you sure you want to delete this certificate?</p>
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col sm={12}>
                            <div className="buttonSection">
                                <Button
                                    variant="primary"
                                    onClick={(e) => deleteCertificateHandler(e)}
                                >
                                    Yes
                                </Button>
                                <Button variant="outline-danger" onClick={deleteModalClose}>
                                    Cancel
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Index;
