import React, {useEffect, useState} from "react";
import {Button, Col, Modal, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {BiEdit} from "react-icons/bi";
import {BsTrash} from "react-icons/bs";
import {FaUserAlt} from "react-icons/fa";
import {MdOutlineCancel} from "react-icons/md";
import {useNavigate, useParams} from "react-router-dom";
import {useRecoilValue} from "recoil";
import Breadcrumb from "../../../../components/Breadcrumb";
import {useAddHexaviewBuzz} from "../../../../query/members/addMembers/addMembersQuery";
import {useGetHexaviewBuzz} from "../../../../query/members/allMembers/allMembersQuery";
import {useDeleteHexaviewBuzz} from "../../../../query/members/deleteMembers/deleteMembersQuery";
import {useUpdateHexaviewBuzz} from "../../../../query/members/updateMembers/updateMembersQuery";
import {authState} from "../../../../recoil/authRecoil";
import {toaster} from "../../../../utilits/toast";
import {requiredField} from "../../../../utilits/validation";
import {Input} from "../../../widgets/formComponents/Input";
import Loader from "../../../widgets/loader/Loader";
import "./style.scss";

const HexaviewBuzz = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [deleteId, setDeleteId] = useState(false);
    const [ids, setIds] = useState();
    const [editId, setEditId] = useState();
    const [mode, setMode] = useState(false);
    const [deleteModel, setDeleteModel] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [formData, setFormData] = useState({});

    const {error, isError, mutateAsync} = useDeleteHexaviewBuzz();
    const {data: allBuzz, isLoading: isAllBuzzLoading} = useGetHexaviewBuzz();

    const handleDeleteBuzz = (id) => {
        setDeleteModel(true);
        setIds(id);
    };
    const editClickHandler = ({buzz_uuid, description, photo, title}) => {
        debugger;
        setEditId(buzz_uuid);
        setMode(true);
        setFormData({description: description, title: title, image: photo});
        setAddModal(true);
    };
    const addClickHandler = () => {
        setEditId(0);
        setMode(false);
        setFormData({});
        setAddModal(true);
    };

    return (
        <div className="hexaBuzz">
            <Row className="mb-2">
                <Col xs={8}>
                    <Breadcrumb />
                </Col>
                <Col className="buttonHeader" xs={4}>
                    {isAllBuzzLoading ? (
                        ""
                    ) : (
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => addClickHandler()}
                        >
                            Add Buzz
                        </button>
                    )}
                </Col>
            </Row>
            <div className="allBuzz mt-2">
                <div>All Buzz</div>
                {isAllBuzzLoading ? (
                    <Loader />
                ) : (
                    <Row>
                        {allBuzz &&
                            allBuzz.map(({description, title, photo, buzz_uuid}) => {
                                return (
                                    <Col sm={12} md={6} className="mt-3 ">
                                        <div className="founderSection cardShadow">
                                            <div className="founderImgSection">
                                                <div className="founderImg">
                                                    {photo ? (
                                                        <img src={photo} alt="" />
                                                    ) : (
                                                        <FaUserAlt className="userIcon" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="founderDetailSection ms-3">
                                                <div className="cardCustomTitle titleAndButtons">
                                                    <OverlayTrigger
                                                        // placement="start"
                                                        delay={{show: 250, hide: 250}}
                                                        overlay={
                                                            <Tooltip id="button-tooltip">
                                                                {title}
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <span>{title}</span>
                                                    </OverlayTrigger>
                                                    <div className="buttons">
                                                        <OverlayTrigger
                                                            // placement="start"
                                                            delay={{show: 1000, hide: 250}}
                                                            overlay={
                                                                <Tooltip id="button-tooltip">
                                                                    Edit
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <span>
                                                                <BiEdit
                                                                    onClick={() =>
                                                                        editClickHandler({
                                                                            buzz_uuid,
                                                                            description,
                                                                            title,
                                                                            photo,
                                                                        })
                                                                    }
                                                                    className="editIcon"
                                                                />
                                                            </span>
                                                        </OverlayTrigger>
                                                        <OverlayTrigger
                                                            // placement="start"
                                                            delay={{show: 250, hide: 250}}
                                                            overlay={
                                                                <Tooltip id="button-tooltip">
                                                                    Delete
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <span>
                                                                <BsTrash
                                                                    onClick={() =>
                                                                        handleDeleteBuzz(buzz_uuid)
                                                                    }
                                                                    className="deleteIcon"
                                                                />
                                                            </span>
                                                        </OverlayTrigger>
                                                    </div>
                                                </div>
                                                <p className="customScroll">{description}</p>
                                            </div>
                                        </div>
                                    </Col>
                                );
                            })}
                    </Row>
                )}
                <Row>
                    <Col xs={12}>
                        <DeleteHexaviewBuzzModal
                            deleteModalOpen={deleteModel}
                            deleteModalClose={() => setDeleteModel(false)}
                            deleteId={ids}
                        />
                        <AddHexaviewBuzzModal
                            addModalOpen={addModal}
                            addModalClose={() => setAddModal(false)}
                            curId={editId}
                            formData={formData}
                            isEditing={mode}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export const DeleteHexaviewBuzzModal = (props) => {
    const {deleteModalOpen, deleteModalClose, deleteId} = props;
    const {mutateAsync} = useDeleteHexaviewBuzz();
    // debugger

    const deleteHexaviewBuzzHandler = (e) => {
        e.preventDefault();
        mutateAsync(deleteId);
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
                    <Modal.Title>Delete Hexaview Buzz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="my-3">
                        <Col sm={12}>
                            <p>Are you sure want to delete this hexaview buzz ?</p>
                        </Col>
                    </Row>
                    <Row className="mt-4 mb-2">
                        <Col sm={12}>
                            <div className="buttonSection">
                                <Button
                                    variant="primary"
                                    onClick={(e) => deleteHexaviewBuzzHandler(e)}
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

export const AddHexaviewBuzzModal = (props) => {
    const {addModalOpen, addModalClose, curId, formData, isEditing} = props;
    const [image, setImage] = useState(formData.image);
    const empDetail = useRecoilValue(authState);

    const navigate = useNavigate();
    const {
        data: addData,
        isLoading: isLoadingAddData,
        mutateAsync: addMutateAsync,
    } = useAddHexaviewBuzz();
    const {mutateAsync: updateMutateAsync} = useUpdateHexaviewBuzz();

    const {register, handleSubmit, watch, errors, reset, setValue, getValues, formState} = useForm({
        mode: "onTouched",
    });
    const uploadImage = async (e) => {
        const file = e.target.files[0];
        const imgsize = file.size / 1024 <= 500;
        const imgType = file.name.match(/\.(jpg|jpeg|png)$/);
        if (imgsize && imgType) {
            const base64 = await convertBase64(file);
            setImage(base64);
        } else {
            if (!imgsize) toaster("error", "The image size should be less than 500KB");
            if (!imgType) toaster("error", "The File Type should be in jpg ,jpeg ,png");
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
        if (curId) {
            let updateBuzzData = {
                "id": curId,
                "title": data.title,
                "description": data.description,
                "photo": image,
            };
            updateMutateAsync(updateBuzzData);
        } else {
            let newBuzzData = {
                "id": empDetail.uuid,
                "photo": image,
                "title": data.title,
                "description": data.description,
            };
            addMutateAsync(newBuzzData);
        }
        reset();
        setImage("");
        addModalClose();
    };

    const handleCancelImage = (e) => {
        e.preventDefault();
        setImage("");
    };

    useEffect(() => {
        setImage(formData.image);
        reset(formData);
    }, [formData]);

    useEffect(() => {
        if (!isEditing) {
            reset({});
        }
    }, [isEditing]);

    return (
        <>
            <Modal className="commonModal" show={addModalOpen} onHide={addModalClose} centered>
                <Modal.Header closeButton className="mb-3">
                    <Modal.Title>{isEditing ? "Update" : "Add"} Hexaview Buzz</Modal.Title>
                </Modal.Header>
                <Modal.Body className="addEditBuzz">
                    <Row>
                        <form onSubmit={handleSubmit(handleOnSubmit)}>
                            <Row>
                                <Col sm={4} className="mb-3">
                                    <label htmlFor="fileTag" className="label">
                                        <div className="customImg">
                                            <button onClick={(e) => handleCancelImage(e)}>
                                                <MdOutlineCancel className="crossIcon" />
                                            </button>
                                            {image ? (
                                                <img src={image} />
                                            ) : (
                                                <div>
                                                    <AiOutlineCloudUpload className="icons" />{" "}
                                                    <p>Profile Picture</p>
                                                </div>
                                            )}
                                        </div>
                                        <Input
                                            name="file"
                                            type="File"
                                            onChangeHandler={uploadImage}
                                            id="fileTag"
                                            className="form-control customStyle"
                                            reference={register({})}
                                        />
                                        {errors.file && (
                                            <small className="form-text text-danger">
                                                {errors.file.message}
                                            </small>
                                        )}
                                    </label>
                                </Col>
                                <Col sm={8}>
                                    <Row>
                                        <Col sm={12} className="mb-3">
                                            <label
                                                className={`${errors.name ? "text-danger" : ""}`}
                                            >
                                                Title *
                                            </label>
                                            <Input
                                                type="text"
                                                placeholder="Title*"
                                                className="form-control"
                                                name="title"
                                                reference={register({
                                                    required: requiredField(),
                                                    validate: (v) =>
                                                        v.trim().length > 80
                                                            ? "Max. length is 80"
                                                            : true,
                                                })}
                                            />
                                            {errors.title && (
                                                <small className="form-text text-danger">
                                                    {errors.title.message}
                                                </small>
                                            )}
                                        </Col>
                                        <Col sm={12} className="mb-3">
                                            <label
                                                className={`${errors.name ? "text-danger" : ""}`}
                                            >
                                                Description *
                                            </label>
                                            <textarea
                                                type="text"
                                                id="text-edit"
                                                placeholder="Description*"
                                                className="form-control"
                                                name="description"
                                                ref={register({
                                                    required: requiredField(),
                                                    validate: (v) =>
                                                        v.trim().length > 160
                                                            ? "Max. length is 160"
                                                            : true,
                                                })}
                                            />
                                            {errors.description && (
                                                <small className="form-text text-danger">
                                                    {errors.description.message}
                                                </small>
                                            )}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12} className="buttonSection">
                                    <Button
                                        disabled={!formState.isValid}
                                        variant="primary"
                                        type="submit"
                                    >
                                        {isEditing ? "Update" : "Add"} Buzz
                                    </Button>
                                    <Button variant="outline-danger" onClick={addModalClose}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default HexaviewBuzz;
