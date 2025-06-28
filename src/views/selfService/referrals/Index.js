import React, {useState} from "react";
import {Button, Col, Modal, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import Breadcrumb from "../../../components/Breadcrumb";
import {authState} from "../../../recoil/authRecoil";
import {PhonePattern, requiredField} from "../../../utilits/validation";
import {Input} from "../../widgets/formComponents/Input";

import {useForm} from "react-hook-form";
import {RiAddLine} from "react-icons/ri";
import {useAddReferral} from "../../../query/referral/addReferral/addReferralQuery";
import {useGetAllReferralByEmpId} from "../../../query/referral/allReferral/allReferralQuery";
import {emailPattern} from "../../../utilits/validation";
import "./style.scss";

const Index = () => {
    const navigate = useNavigate();
    const empDetail = useRecoilValue(authState);
    const {data: allReferralByEmp, isLoading} = useGetAllReferralByEmpId(
        empDetail && empDetail.uuid
    );
    const addReferralClickHandler = () => {
        setAddReferralModalVisible(true);
    };
    const [addReferralModalVisible, setAddReferralModalVisible] = useState(false);

    const data = [
        {
            status: "Approved",
            dateOfResignation: "12-15-2022",
            reasonForLeaving: "Higher Studies",
            requestedLastWorkingDay: "12-15-2022",
            withdraw: true,
        },
    ];

    const columns = [
        {
            dataField: "referral_name",
            text: "name",
        },
        {
            dataField: "referral_email",
            text: "Email",
        },
        {
            dataField: "referral_mobile_no",
            text: "Contact No.",
        },
        {
            dataField: "referral_passout_year",
            text: "Passout Year",
        },
        {
            dataField: "referral_status",
            text: "Referral status",
        },
    ];

    return (
        <>
            <Row className="nav mb-2">
                <Col xs={4}>
                    <Breadcrumb />
                </Col>
                <Col xs={8} className="filter-buttons mb-2">
                    <Button size="sm" variant="outline-primary" onClick={addReferralClickHandler}>
                        <RiAddLine /> Add referral
                    </Button>
                </Col>
            </Row>
            <div className="referral">
                <BootstrapTable
                    keyField="id"
                    data={allReferralByEmp ? allReferralByEmp : []}
                    columns={columns}
                    condensed
                />
            </div>
            <Modal
                className="applyReferralModal"
                show={addReferralModalVisible}
                onHide={() => setAddReferralModalVisible(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add a referral</Modal.Title>
                </Modal.Header>
                <Modal.Body closeButton>
                    <ReferralForm setAddReferralModalVisible={setAddReferralModalVisible} />
                </Modal.Body>
            </Modal>
        </>
    );
};

const ReferralForm = ({setAddReferralModalVisible}) => {
    const empDetail = useRecoilValue(authState);
    const [resumeFile, setResumeFile] = useState("");
    const [resumeFileName, setResumeFileName] = useState("");
    const navigate = useNavigate();
    const {
        setError,
        formState,
        reset,
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        mode: "onTouched",
    });
    const {
        data: addReferral,
        isLoading: isLoadingAddResign,
        mutateAsync: addMutateAsync,
    } = useAddReferral();

    const onSubmit = (data) => {
        const val = {
            ...data,
            "emp_uuid": empDetail && empDetail.uuid,
            "referral_resume": resumeFile,
            "referral_status": "Pending",
            "referral_date": "2022-12-29",
        };
        addMutateAsync(val);
        setResumeFile("");
        setResumeFileName("");
        reset("");
    };

    const uploadResumeFile = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setResumeFile(base64);
        setResumeFileName(file.name);
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

    return (
        <>
            <div className="addReferral">
                <form className="formAddReferral" onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={12} className="mb-3">
                            <label>Name *</label>
                            <Input
                                type="text"
                                placeholder="Name"
                                className="form-control"
                                name="referral_name"
                                reference={register({
                                    required: requiredField(),
                                })}
                            />
                            {errors.referral_name && (
                                <small className="form-text text-danger">
                                    {errors.referral_name.message}
                                </small>
                            )}
                        </Col>
                        {/* Personal email ID */}
                        <Col sm={12} className="mb-3">
                            <label>Email ID *</label>
                            <Input
                                type="email"
                                placeholder="Email"
                                className="form-control"
                                name="referral_email"
                                reference={register({
                                    required: requiredField(),
                                    pattern: emailPattern(),
                                })}
                            />
                            {errors.referral_email && (
                                <small className="form-text text-danger">
                                    {errors.referral_email.message}
                                </small>
                            )}
                        </Col>
                        <Col sm={12} className="mb-3">
                            <label>Mobile Number *</label>
                            <Input
                                type="number"
                                placeholder="Mobile Number"
                                className="form-control"
                                name="referral_mobile_no"
                                reference={register({
                                    required: requiredField(),
                                    pattern: PhonePattern(),
                                })}
                            />
                            {errors.referral_mobile_no && (
                                <small className="form-text text-danger">
                                    {errors.referral_mobile_no.message}
                                </small>
                            )}
                        </Col>
                        <Col sm={12} className="mb-3">
                            <label>Passout Year *</label>
                            <Input
                                type="number"
                                max="9999"
                                placeholder="Passout Year"
                                className="form-control"
                                name="referral_passout_year"
                                reference={register({
                                    required: requiredField(),
                                    validate: {
                                        sanity: (year) =>
                                            year > 2100 || year < 1950 ? "Invalid year." : true,
                                    },
                                })}
                            />
                            {errors.referral_passout_year && (
                                <small className="form-text text-danger">
                                    {errors.referral_passout_year.message}
                                </small>
                            )}
                        </Col>
                        <Col sm={12} className="mb-3">
                            <label>Referral relation *</label>
                            <Input
                                type="text"
                                placeholder="Relation"
                                className="form-control"
                                name="referral_relation"
                                reference={register({
                                    required: requiredField(),
                                })}
                            />
                            {errors.referral_relation && (
                                <small className="form-text text-danger">
                                    {errors.referral_relation.message}
                                </small>
                            )}
                        </Col>
                        <Col sm={12} className="mb-3">
                            <label htmlFor="issueFile" className="labelAdmin">
                                <div className="customImg">
                                    {/* {resumeFileName == "" ? <>{'Resume'}</> : <div>{}</div>} */}
                                    Resume *
                                </div>
                                <Input
                                    type="file"
                                    className="form-control customStyle"
                                    onChangeHandler={uploadResumeFile}
                                    id="issueFile"
                                    reference={register({})}
                                />
                            </label>
                        </Col>
                        <Col sm={12} className="buttonSection">
                            <Button
                                variant="primary"
                                size="sm"
                                disabled={!formState.isValid}
                                type="submit"
                                class="applyReferral"
                            >
                                Add
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                type="button"
                                class="closeBtn"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </form>
            </div>
        </>
    );
};

export default Index;
