import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import {Button, Col, Modal, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {Select, Tooltip} from "antd";
import {FaTrash} from "react-icons/fa";
import {useRecoilValue} from "recoil";
import ITDeclaration from "../../../assets/images/emp/IT-Declaration.svg";
import {
    useAddquickAccess,
    useDeleteQuickAccess,
    useGetAllquickAccess,
} from "../../../query/quickAccess/quickAccessQuery";
import {authState} from "../../../recoil/authRecoil";
import {toaster} from "../../../utilits/toast";
import {requiredField} from "../../../utilits/validation";
import {Input} from "../../widgets/formComponents/Input";
import Loader from "../../widgets/loader/Loader";
import "./style.scss";
import {useGetAllDesignation} from "../../../query/designation/allDesignation/allDesignationQuery";

const QuickAccess = () => {
    const location = useLocation();
    const [showAddQuickModal, setShowAddQuickModal] = useState(false);
    const empDetail = useRecoilValue(authState);
    const [showDelModal, setShowDelModal] = useState(false);
    const [deletingFileInfo, setDeletingFileInfo] = useState({});
    const {data: dataAllQuickAccess, isLoading: isLoadingDataAllQuickAccess} =
        useGetAllquickAccess("");
    const {mutateAsync: addQuickAccessMutateAsync, isLoading: isLoadingAddQuickAccess} =
        useAddquickAccess();
    const {mutateAsync: deleteQuickAccessMutateAsync, isLoading: isLoadingDeleteQuickAccess} =
        useDeleteQuickAccess();

    const deleteClickHandler = ({quick_access_uuid, subject, createdAt, file}) => {
        setDeletingFileInfo({quick_access_uuid, subject, createdAt, file});
        setShowDelModal(true);
    };
    return (
        <div className="QuickLinkSection cardShadow">
            <div className="titleSection">
                <span className="cardCustomTitle">Quick Access</span>
                {location.pathname.split("/")[1] === "dashboard" ? (
                    ""
                ) : (
                    <Button
                        size="sm"
                        variant="primary"
                        disabled={isLoadingDataAllQuickAccess}
                        onClick={() => setShowAddQuickModal(true)}
                    >
                        Add
                    </Button>
                )}
            </div>
            <div className="quickAccessGroup customScroll">
                {isLoadingDataAllQuickAccess ? (
                        <Loader />
                ) : !dataAllQuickAccess?.length ? (
                    <div className="emptyListText">No Data Found</div>
                ) : (
                    dataAllQuickAccess &&
                    dataAllQuickAccess.map(({quick_access_uuid, id, subject, createdAt, file}) => {
                        return (
                            <div className="oneDocumentRow">
                                <a
                                    key={id}
                                    className="quickAccess"
                                    download="Quick_Access"
                                    href={file}
                                >
                                    <div className="pic pink">
                                        <img src={ITDeclaration} alt="" />
                                    </div>
                                    <div className="quickAccessDetail">
                                        <p>{subject}</p>
                                        <p>
                                            {new Date(createdAt).getDate(createdAt)}{" "}
                                            {new Date(createdAt).toLocaleString("default", {
                                                month: "long",
                                            })}
                                            , {new Date(createdAt).getFullYear()}
                                        </p>
                                    </div>
                                </a>
                                {location.pathname.split("/")[1] === "dashboard" ? (
                                    ""
                                ) : (
                                    <FaTrash
                                        className="delIcon me-3 mt-1"
                                        onClick={() => {
                                            deleteClickHandler({
                                                quick_access_uuid,
                                                subject,
                                                createdAt,
                                            });
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })
                )}
            </div>
            {showAddQuickModal && (
                <QuickAccessAddModal
                    modalOpen={showAddQuickModal}
                    modalClose={() => setShowAddQuickModal(false)}
                    addQuickAccessMutateAsync={addQuickAccessMutateAsync}
                    isLoadingAddQuickAccess={isLoadingAddQuickAccess}
                />
            )}
            {showDelModal && (
                <DeleteModal
                    modalOpen={showDelModal}
                    modalClose={() => setShowDelModal(false)}
                    deletingFileInfo={deletingFileInfo}
                    deleteQuickAccessMutateAsync={deleteQuickAccessMutateAsync}
                    isLoadingDeleteQuickAccess={isLoadingDeleteQuickAccess}
                />
            )}
        </div>
    );
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

export const QuickAccessAddModal = ({
    modalOpen,
    modalClose,
    addQuickAccessMutateAsync,
    isLoadingAddQuickAccess,
}) => {
    const [file, setFile] = useState(null);
    const [selectedDesignation, setDesignations] = useState([]);
    const empDetail = useRecoilValue(authState);
    const {data: designations, isLoading: isDesignationsLoading} = useGetAllDesignation();
    const {register, handleSubmit, errors, formState} = useForm({
        mode: "onTouched",
    });
    const handleSelectDesignation = (desig) => {
        setDesignations(desig);
    };

    const onAddQuickAccess = (data) => {
        const payload = {
            subject: data.subject,
            designation_uuids: selectedDesignation,
            file: file.file,
            fileName: file.fileName,
            created_by: empDetail && empDetail.first_name + " " + empDetail.last_name,
            updated_by: empDetail && empDetail.first_name + " " + empDetail.last_name,
        };
        addQuickAccessMutateAsync(payload);
        modalClose();
    };
    const uploadFile = async (e) => {
        const file = e.target.files[0];
        const imgType = file.name.match(/\.(pdf)$/);
        if (imgType) {
            const base64 = await convertBase64(file);
            setFile({
                file: base64,
                fileName: file.name,
            });
        } else {
            if (!imgType) toaster("error", "The File Type should be in pdf");
        }
    };

    if (isDesignationsLoading) {
        return <p>loader..</p>;
    }

    return (
        <Modal className="commonModal" show={modalOpen} onHide={modalClose} centered>
            <Modal.Header closeButton>
                <div className="cardCustomTitle">Add Quick Access</div>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onAddQuickAccess)}>
                    <Row className="my-3">
                        <Col sm={12}>
                            <label className={`${errors.subject ? "text-danger" : ""}`}>
                                Subject
                            </label>
                            <Input
                                type="text"
                                placeholder="Subject"
                                className="form-control"
                                name="subject"
                                reference={register({required: requiredField()})}
                            />
                            {errors.subject && (
                                <small className="form-text text-danger">
                                    {errors.subject.message}
                                </small>
                            )}
                        </Col>
                        <Col sm={12}>
                            <label className={`${errors.file ? "text-danger" : ""}`}>
                                Upload file
                            </label>
                            <span style={{display: "none"}}>
                                <AiOutlineCloudUpload className="icons" />
                                <p>Upload file</p>
                            </span>
                            <Input
                                type="File"
                                onChangeHandler={uploadFile}
                                onClickHandler={(event) => {
                                    event.target.value = null;
                                }}
                                id="fileTag"
                                className="form-control customStyle"
                                name="file"
                                reference={register({required: requiredField()})}
                            />
                            {errors.file && (
                                <small className="form-text text-danger">
                                    {errors.file.message}
                                </small>
                            )}
                        </Col>
                        <Col sm={12}>
                            <label>Select Designation</label>
                            <Select
                                mode="multiple"
                                placeholder="Select Designation"
                                className="form-control"
                                name="id"
                                onChange={handleSelectDesignation}
                                reference={register({required: requiredField()})}
                            >
                                <option value="" disabled>
                                    Select Designation
                                </option>
                                {designations &&
                                    designations.map((item, i) => (
                                        <Select.Option
                                            key={item.designation_uuid}
                                            value={item.designation_uuid}
                                        >
                                            {item.designation_name}
                                        </Select.Option>
                                    ))}
                            </Select>
                        </Col>
                    </Row>
                    <Row className="mt-4 mb-2">
                        <Col sm={12} className="buttonSection">
                            <Button
                                disabled={!formState.isValid || isLoadingAddQuickAccess}
                                variant="primary"
                                type="submit"
                            >
                                {isLoadingAddQuickAccess ? "Adding..." : "Add"}
                            </Button>
                            <Button variant="outline-danger" onClick={modalClose}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export const DeleteModal = ({
    modalOpen,
    modalClose,
    deletingFileInfo,
    deleteQuickAccessMutateAsync,
    isLoadingDeleteQuickAccess,
}) => {
    const onDeleteQuickAccess = (uuid) => {
        deleteQuickAccessMutateAsync(uuid);
        modalClose();
    };
    return (
        <Modal className="commonModal" show={modalOpen} onHide={modalClose} centered>
            <Modal.Header closeButton>
                <div className="cardCustomTitle">Delete {deletingFileInfo.subject}</div>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col sm={12}>
                        <p>Are you sure want to delete this item?</p>
                    </Col>
                    <Col sm={12}>
                        <div className="buttonSection">
                            <Button
                                variant="primary"
                                onClick={(e) =>
                                    onDeleteQuickAccess(deletingFileInfo.quick_access_uuid)
                                }
                            >
                                Yes
                            </Button>
                            <Button variant="outline-danger" onClick={modalClose}>
                                Cancel
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default QuickAccess;
