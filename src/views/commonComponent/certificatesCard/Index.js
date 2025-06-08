import {Tooltip} from "antd";
import React, {useState} from "react";
import {Button, Col, Modal, Row, Tab, Tabs} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {BiEdit} from "react-icons/bi";
import {useRecoilValue} from "recoil";
import {useGetMembersById} from "../../../query/members/allMembers/allMembersQuery";
import {useGetSkills, useUpdateSkillByEmpUuid} from "../../../query/skill/skillsQuery";
import {authState} from "../../../recoil/authRecoil";
import {capitalizeFirstLetter} from "../../../utilits/usefulFunctions";
import {requiredField} from "../../../utilits/validation";
import {Input} from "../../widgets/formComponents/Input";
import "./style.scss";
import {
    useCreateSkillCertificate,
    useGetAllSkillWithCustomSkill,
} from "../../../query/employee/allEmployeeQuery";
import {toaster} from "../../../utilits/toast";
import Certifications from "../certificates/Index";
import {TextWithViewMore} from "../../modals/viewMore/Index";

const CertificatesCard = () => {
    const empDetail = useRecoilValue(authState);
    const [updateSkillModal, setUpdateSkillModal] = useState(false);
    const [uploadCertificationModal, setUploadCertificationModal] = useState(false);
    const {data: memberDetail, isLoading: isLoadingMemberDetail} = useGetMembersById(
        empDetail && empDetail.uuid
    );

    const updateSkillsHandler = () => {
        setUpdateSkillModal(true);
    };
    const uploadCertificationHandler = () => {
        setUploadCertificationModal(true);
    };

    return (
        <>
            <div className="certificatesCard dashboardCard cardShadow">
                <div sm={12} className="d-flex justify-content-between">
                    <div className="cardCustomTitle">My Skillset</div>
                    <BiEdit className="editButton" title="Edit" onClick={updateSkillsHandler} />
                </div>
                <p className="keyAndValueText mb-0">
                    <span className="name me-1">Primary Skill :</span>
                    <span className="value">
                        {isLoadingMemberDetail
                            ? "fetching..."
                            : memberDetail && memberDetail.primary_skill_name
                            ? capitalizeFirstLetter(memberDetail && memberDetail.primary_skill_name)
                            : "N/A"}
                    </span>
                </p>
                <p className="keyAndValueText secondarySkillText customScroll">
                    <span className="name me-1">Secondary Skill :</span>
                    {isLoadingMemberDetail ? (
                        "fetching..."
                    ) : (
                        <TextWithViewMore
                            text={memberDetail && memberDetail.secondary_skills}
                            title={"Secondary Skill"}
                            showLength={90}
                        />
                    )}
                </p>
                <Button size="sm" className="mt-2" onClick={uploadCertificationHandler}>
                    Add Certification
                </Button>
            </div>
            <UpdateSkillsModal
                showModal={updateSkillModal}
                closeModal={() => setUpdateSkillModal(false)}
                primaryKeyId={memberDetail && memberDetail.primary_skill_uuids}
                secondary_skills={memberDetail && memberDetail.secondary_skills}
            />
            <UploadCertificationModal
                showModal={uploadCertificationModal}
                closeModal={() => setUploadCertificationModal(false)}
                loading={isLoadingMemberDetail}
            />
        </>
    );
};

export const UpdateSkillsModal = ({showModal, closeModal, primaryKeyId, secondary_skills}) => {
    const {register, handleSubmit, reset, watch, errors, formState} = useForm({
        mode: "onChange",
    });
    const empDetail = useRecoilValue(authState);
    const {data: skills, isLoading: isLoadingSkills} = useGetSkills();
    const {mutateAsync: updateSkillsMutateAsync} = useUpdateSkillByEmpUuid();
    const onSubmit = (data) => {
        const updateVal = {
            ...data,
            "emp_uuid": empDetail && empDetail.uuid,
        };
        updateSkillsMutateAsync(updateVal);
        closeModal();
    };

    return (
        <Modal className="commonModal" show={showModal} onHide={closeModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Update Skill</Modal.Title>
            </Modal.Header>
            <Modal.Body className="myModalBody mt-3 container">
                <form className="formTodo" onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={12} className="mb-3">
                            <label>Primary Skill*</label>
                            <select
                                defaultValue={primaryKeyId}
                                className="form-control dropdown-bar"
                                name="primary_skill_uuid"
                                ref={register({
                                    required: requiredField(),
                                })}
                            >
                                <option key='0' value="">select</option>
                                {skills &&
                                    skills.map((option, index) => (
                                        <option key={`${index+1}`} value={option.skill_uuid}>
                                            {option.skill_name}
                                        </option>
                                    ))}
                            </select>
                            {errors.primary_skill_uuid && (
                                <small className="form-text text-danger">
                                    {errors.primary_skill_uuid.message}
                                </small>
                            )}
                        </Col>
                        <Col sm={12} className="mb-3">
                            <label>Secondary Skills</label>
                            <textarea
                                type="text"
                                rows="3"
                                id="text-edit"
                                className="form-control customScroll"
                                defaultValue={secondary_skills}
                                name="secondary_skill"
                                ref={register({})}
                            />
                            {errors.secondary_skill && (
                                <small className="form-text text-danger">
                                    {errors.secondary_skill.message}
                                </small>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} className="buttonSection">
                            <Button className="btn btn-primary addBtn" type="submit">
                                Update
                            </Button>
                            <Button className="btn btn-danger" onClick={closeModal}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export const UploadCertificationModal = ({showModal, closeModal, loading}) => {
    const {register, handleSubmit, reset, watch, errors, formState} = useForm({
        mode: "onChanged",
    });
    const empDetail = useRecoilValue(authState);
    const {data: skills, isLoading: isLoadingSkills} = useGetSkills();
    const {mutateAsync: createSkillCertificateMutateAsync} = useCreateSkillCertificate();
    const {data: skillsList, isLoading: isLoadingSkillsList} = useGetAllSkillWithCustomSkill();
    const [primarySkillUuid, setPrimarySkillUuid] = useState("");
    const [certificate, setCertificate] = useState();
    const [certificateName, setCertificateName] = useState("");
    const [customSkillName, setCustomSkillName] = useState("");
    const [currentTab, setCurrentTab] = useState("upload");
    const skillChangeHandler = (e) => {
        setPrimarySkillUuid(e.target.value);
    };
    const customSkillChangeHandler = (e) => {
        setCustomSkillName(e.target.value);
    };
    const uploadCertificate = async (e) => {
        const file = e.target.files[0];
        const imgType = file.name.match(/\.(jpg|jpeg|png|pdf)$/);
        if (imgType) {
            const base64 = await convertBase64(file);
            setCertificateName(file.name);
            setCertificate(base64);
        } else {
            document.getElementById("certificate").value = "";
            toaster("error", "The file type should be either pdf, jpeg, jpg or png.");
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
        if (!certificate || certificate == undefined) {
            toaster("error", "Please upload the certificate");
        } else if (customSkillName.trim().length > 35) {
            toaster("error", "Custom skill name must be less than or equal to 35 characters");
        } else {
            createSkillCertificateMutateAsync({
                employee_uuid: empDetail?.uuid,
                skill_uuid: primarySkillUuid == "custom" ? null : primarySkillUuid,
                primary_skill_certificate: certificate,
                custom_skill_name: primarySkillUuid == "custom" ? customSkillName.trim() : null,
            });
            setCertificate(undefined);
            setPrimarySkillUuid("");
            closeModal();
        }
    };
    const handleCloseModal = () => {
        setCertificate(undefined);
        setCertificateName("");
        setPrimarySkillUuid("");
        closeModal();
    };
    return (
        <Modal className="commonModal" show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Upload Certification</Modal.Title>
            </Modal.Header>
            <Modal.Body className="myModalBody mt-2">
                <Tabs
                    id="controlled-tab-example"
                    activeKey={currentTab}
                    onSelect={(key) => setCurrentTab(key)}
                >
                    <Tab eventKey="upload" title="Upload" className="container">
                        <form className="formTodo p-2" onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col sm={12} className="mb-3 px-0">
                                    <label>Choose skill*</label>
                                    <select
                                        className="form-control dropdown-bar customScroll"
                                        name="primary_skill_uuid"
                                        ref={register({
                                            required: requiredField(),
                                        })}
                                        onChange={skillChangeHandler}
                                    >
                                        <option key="0" value="">
                                            {isLoadingSkillsList ? "Loading..." : "Select"}
                                        </option>
                                        {skillsList &&
                                            skillsList.map((option, index) => (
                                                <option
                                                    key={`${index + 1}`}
                                                    value={option.skill_uuid}
                                                >
                                                    {option.skill_name}
                                                </option>
                                            ))}
                                        <option key="end" value="custom">
                                            Custom
                                        </option>
                                    </select>
                                    {errors.primary_skill_uuid && (
                                        <small className="form-text text-danger">
                                            {errors.primary_skill_uuid.message}
                                        </small>
                                    )}
                                </Col>
                                {primarySkillUuid == "custom" ? (
                                    <Col sm={12} className="mb-3 px-0">
                                        <Input
                                            type="text"
                                            placeholder="Enter language"
                                            className="form-control"
                                            id="certificate"
                                            reference={
                                                primarySkillUuid == "custom"
                                                    ? register({
                                                          validate: {
                                                              lesserThan: (v) => {
                                                                  if (v && v.trim().length > 35) {
                                                                      return "Max. length is 35";
                                                                  } else return true;
                                                              },
                                                          },
                                                          required: requiredField(),
                                                      })
                                                    : null
                                            }
                                            onChangeHandler={customSkillChangeHandler}
                                        />
                                    </Col>
                                ) : (
                                    ""
                                )}
                                <Col sm={12} className="mb-3 px-0">
                                    <Input
                                        type="file"
                                        className="form-control"
                                        id="certificate"
                                        onChangeHandler={uploadCertificate}
                                        // reference={register({
                                        //     required: requiredField(),
                                        // })}
                                    />
                                </Col>
                                <Col sm={12} className="buttonSection">
                                    <Button
                                        // disabled={!formState.isValid}
                                        variant="primary"
                                        type="submit"
                                    >
                                        Add
                                    </Button>
                                    <Button variant="outline-danger" onClick={handleCloseModal}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    </Tab>
                    <Tab eventKey="list" title="All Certifications" className="calendarTab mt-3">
                        <Certifications loading={loading} userId={empDetail && empDetail.uuid} />
                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
    );
};

export default CertificatesCard;
