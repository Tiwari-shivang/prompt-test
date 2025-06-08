import React, {useEffect, useState} from "react";
import {useParams, useNavigate, useLocation} from "react-router-dom";
import {Row, Col, Button} from "react-bootstrap";
import Breadcrumb from "../../../components/Breadcrumb";
import {MdOutlineCancel} from "react-icons/md";
import {Input} from "../../widgets/formComponents/Input";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {useForm, useFieldArray} from "react-hook-form";
import {useAddHexaviewBuzz} from "../../../query/members/addMembers/addMembersQuery";
import {toaster} from "../../../utilits/toast";
import {requiredField} from "../../../utilits/validation";
import "./style.scss";
import {useUpdateHexaviewBuzz} from "../../../query/members/updateMembers/updateMembersQuery";
import {useRecoilValue} from "recoil";
import {authState} from "../../../recoil/authRecoil";

const AddHexaviewBuzz = () => {
    const params = useParams();
    const [image, setImage] = useState();
    const empDetail = useRecoilValue(authState);
    const buzzData = useLocation();

    const navigate = useNavigate();
    const {
        data: addData,
        isLoading: isLoadingAddBuzz,
        mutateAsync: addMutateAsync,
    } = useAddHexaviewBuzz();
    const {mutateAsync: updateMutateAsync, isLoading: isLoadingUpdateBuzz} =
        useUpdateHexaviewBuzz();
    const {register, handleSubmit, errors, reset, setValue, getValues, formState} = useForm({
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

    const onSubmit = (data) => {
        if (params.id) {
            let updateBuzzData = {
                "id": params.id,
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
    };
    const handleCancelImage = (e) => {
        e.preventDefault();
        setImage("");
    };

    useEffect(() => {
        setImage(buzzData?.state?.photo);
        reset(buzzData.state);
    }, [buzzData.state]);

    useEffect(() => {
        if (!params.id) {
            reset({});
        }
    }, [params.id]);

    return (
        <div className="buzz-POC">
            <Row className="mb-2">
                <Col xs={8}>
                    <Breadcrumb />
                </Col>
                <Col xs={4} className="buttons">
                    <div class="list">
                        <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => {
                                navigate("/dashboard/manageHexaviewBuzz");
                            }}
                        >
                            Manage Buzz
                        </Button>
                    </div>
                </Col>
            </Row>
            <div className="addHexaviewBuzz mb-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={3} className="mb-3">
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
                                    reference={register({
                                        // required: requiredField(),
                                    })}
                                />
                                {errors.file && (
                                    <small className="form-text text-danger">
                                        {errors.file.message}
                                    </small>
                                )}
                            </label>
                        </Col>
                        <Col sm={9}>
                            <Row>
                                <Col sm={12} className="mb-3">
                                    <label className={`${errors.name ? "text-danger" : ""}`}>
                                        Title *
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Title *"
                                        className="form-control"
                                        name="title"
                                        reference={register({
                                            required: requiredField(),
                                        })}
                                    />
                                    {errors.title && (
                                        <small className="form-text text-danger">
                                            {errors.title.message}
                                        </small>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12} className="mb-3">
                                    <label className={`${errors.name ? "text-danger" : ""}`}>
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
                                disabled={
                                    !formState.isValid ||
                                    (params.id ? isLoadingUpdateBuzz : isLoadingAddBuzz)
                                }
                                variant="primary"
                                type="submit"
                            >
                                {params?.id
                                    ? isLoadingUpdateBuzz
                                        ? "Updating..."
                                        : "Update Buzz"
                                    : isLoadingAddBuzz
                                    ? "Adding..."
                                    : "Add Buzz"}
                            </Button>
                            <Button
                                variant="outline-danger"
                                onClick={() => {
                                    navigate(-1);
                                }}
                            >
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </form>
            </div>
        </div>
    );
};

export default AddHexaviewBuzz;
