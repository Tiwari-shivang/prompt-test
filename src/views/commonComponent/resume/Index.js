import React, {useState} from "react";
import {Row, Col, Form, Button, Carousel, Modal, ButtonGroup} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {Input} from "../../widgets/formComponents/Input";
import {AiOutlineFilePdf} from "react-icons/ai";
import Tooltip from "react-bootstrap/Tooltip";
import {MdOutlineCancel} from "react-icons/md";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {useAddResume} from "../../../query/resume/addResume/addResumeQuery";
import {useGetAllResumeById} from "../../../query/resume/allResume/allResumeQuery";
import {toaster} from "../../../utilits/toast";
import "./style.scss";
import {useDeleteResume} from "../../../query/resume/deleteResume/deleteResumeQuery";
import Loader from "../../widgets/loader/Loader";

const Index = (props) => {
    const {userId} = props;
    const [addResumePopup, setAddResumePopup] = useState(false);
    const [deleteModel, setDeleteModel] = useState(false);
    const [ids, setIds] = useState("");
    const {data: allResume, isLoading: isLoadingAllResume} = useGetAllResumeById(userId);
    const {mutateAsync: deleteResumeMutateAsync, isLoading: isLoadingDeleteResume} =
        useDeleteResume();
    const {mutateAsync: addResumeMutateAsync, isLoading: isLoadingAddResume} = useAddResume();

    const handlerAddResumePopup = () => {
        setAddResumePopup(true);
    };

    const handleDeleteResume = (id) => {
        setIds(id);
        setDeleteModel(true);
    };

    return (
        <Row className="resumeSection">
            <Col xs={12}>
                <div className="resumeRow">
                    <div className="cardCustomTitle">Resumes</div>
                    <div className="resumeCard customScroll py-2 mb-3">
                        {isLoadingAllResume ? (
                            <div className="loadingScreen">
                                <Loader />
                            </div>
                        ) : allResume && allResume.length == 0 ? (
                            // <div className='emptyListText'>
                            "No Resume added."
                        ) : (
                            allResume &&
                            allResume.map((item, index) => (
                                <OverlayTrigger
                                    placement="top"
                                    delay={{show: 250, hide: 250}}
                                    overlay={
                                        <Tooltip id="button-tooltip">{item.resume_name}</Tooltip>
                                    }
                                >
                                    <div className="resumeDiv">
                                        <MdOutlineCancel
                                            className="crossIcon"
                                            onClick={() => handleDeleteResume(item.id)}
                                        />
                                        <a download={item.resume_name} href={item.resume}>
                                            <AiOutlineFilePdf className="pdfIcon" />
                                        </a>
                                        <p>{item.resume_name}</p>
                                    </div>
                                </OverlayTrigger>
                            ))
                        )}
                    </div>
                    <div className="addResumeBtn">
                        <Button
                            variant="primary"
                            size="sm"
                            disabled={isLoadingDeleteResume || isLoadingAddResume}
                            onClick={handlerAddResumePopup}
                        >
                            {isLoadingDeleteResume
                                ? "Deleting..."
                                : isLoadingAddResume
                                ? "Adding..."
                                : "Add Resume"}
                        </Button>
                    </div>
                </div>
            </Col>

            <AddResumeModal
                modalOpen={addResumePopup}
                modalClose={() => setAddResumePopup(false)}
                empId={userId}
                addResumeMutateAsync={addResumeMutateAsync}
                isLoadingAddResume={isLoadingAddResume}
            />
            <DeleteResumeModal
                deleteModalOpen={deleteModel}
                deleteModalClose={() => setDeleteModel(false)}
                deleteId={ids}
                deleteResumeMutateAsync={deleteResumeMutateAsync}
            />
        </Row>
    );
};

export const AddResumeModal = ({
    modalOpen,
    modalClose,
    empId,
    addResumeMutateAsync,
    isLoadingAddResume,
}) => {
    const [resume, setResume] = useState();
    const [resumeName, setResumeName] = useState("");
    const {register, handleSubmit, formState} = useForm({
        mode: "onTouched",
    });

    const uploadResume = async (e) => {
        const file = e.target.files[0];
        const imgType = file.name.match(/\.(pdf)$/);
        if (imgType) {
            const base64 = await convertBase64(file);
            setResumeName(file.name);
            setResume(base64);
        } else {
            toaster("error", "The File Type should be in pdf");
        }
    };

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleOnSubmit = (data) => {
        const uploadResume = {
            "emp_id": empId,
            "resume_name": resumeName,
            "resume": resume,
        };
        addResumeMutateAsync(uploadResume).then(() => {
            setResumeName("");
        });
        modalClose();
    };

    return (
        <>
            <Modal className="commonModal" show={modalOpen} onHide={modalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Resume</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="my-3">
                        <Col sm={12}>
                            <form onSubmit={handleSubmit(handleOnSubmit)}>
                                <Row className="my-3">
                                    <Col sm={12} className="mb-3 px-2">
                                        <Input
                                            type="file"
                                            placeholder="Address"
                                            className="form-control"
                                            id="resume"
                                            onChangeHandler={uploadResume}
                                        />
                                    </Col>
                                    <Col sm={12} className="buttonSection">
                                        <Button
                                            disabled={!formState.isValid || isLoadingAddResume}
                                            variant="primary"
                                            type="submit"
                                        >
                                            {isLoadingAddResume ? "Adding..." : "Add"}
                                        </Button>
                                        <Button variant="outline-danger" onClick={modalClose}>
                                            Cancel
                                        </Button>
                                    </Col>
                                </Row>
                            </form>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
};

export const DeleteResumeModal = ({
    deleteModalOpen,
    deleteModalClose,
    deleteId,
    deleteResumeMutateAsync,
}) => {
    const deleteResumeHandler = (e) => {
        e.preventDefault();
        const details = {
            id: deleteId,
        };
        deleteResumeMutateAsync(details.id);
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
                    <Modal.Title>Delete Resume</Modal.Title>
                </Modal.Header>
                <Modal.Body className="my-2">
                    <Row className="my-3 ">
                        <Col sm={12}>
                            <p>Are you sure want to delete this resume ?</p>
                        </Col>
                    </Row>
                    <Row className="mt-4 mb-2">
                        <Col sm={12}>
                            <div className="buttonSection">
                                <Button variant="primary" onClick={(e) => deleteResumeHandler(e)}>
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
