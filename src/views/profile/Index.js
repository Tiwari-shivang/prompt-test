import React, {useEffect, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {FiEdit} from "react-icons/fi";
import {GrGallery} from "react-icons/gr";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import Email from "../../assets/images/email.svg";
import Phone from "../../assets/images/phone.svg";
import Breadcrumb from "../../components/Breadcrumb";
import {useGetAllRms, useGetMembersById} from "../../query/members/allMembers/allMembersQuery";
import {useUpdateMembers} from "../../query/members/updateMembers/updateMembersQuery";
import {useGetSkills} from "../../query/skill/skillsQuery";
import {authState} from "../../recoil/authRecoil";
import {toaster} from "../../utilits/toast";
import {PhonePattern, requiredField} from "../../utilits/validation";
import {Input} from "../widgets/formComponents/Input";
import "./style.scss";

const Index = () => {
    const [editable, setEditable] = useState(false);
    const [probationPeriod, setProbationPeriod] = useState();
    const [image, setImage] = useState();
    const [resume, setResume] = useState();
    const [resumeName, setResumeName] = useState();
    const [year, setYear] = useState();
    const navigate = useNavigate();
    const empDetail = useRecoilValue(authState);
    const {data: details, isLoading, refetch} = useGetMembersById(empDetail && empDetail.uuid);
    const {data: skills, isLoading: isLoadingSkills} = useGetSkills();
    const {data: dataAllRm, isLoading: isLoadingAllRm} = useGetAllRms();

    const {mutateAsync: updateMemberMutateAsync} = useUpdateMembers();

    const {register, handleSubmit, errors, reset, setValue} = useForm();

    useEffect(() => {
        reset({...details, "phone_number": details?.phone_number?.substring(2)});
        setImage(details?.profile_picture);
        setProbationPeriod(
            (new Date(details?.date_of_confirmation) - new Date(details?.date_of_joining)) /
                (1000 * 60 * 60 * 24)
        );
    }, [details]);

    useEffect(() => {
        const year = new Date().getFullYear() - 17;
        setYear(year);
    }, []);

    const editProfile = () => {
        setEditable(true);
    };
    const backToProfile = () => {
        setEditable(false);
        reset(details);
    };

    const uploadImage = async (e) => {
        const file = e.target.files[0];
        const imgsize = file.size / 1024 <= 500;
        const imgType = file.name.match(/\.(jpg|jpeg|png)$/);
        if (imgsize && imgType) {
            const base64 = await convertBase64(file);
            setImage(base64);
        } else {
            if (!imgsize) toaster("error", "The image size should be less than 500KB.");
            if (!imgType) toaster("error", "The File Type should either be in jpg ,jpeg or png.");
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

    const handleOnSubmitProfileUpdate = (values) => {
        const editProfile = {
            ...values,
            "id": details && details.id,
            "user_uuid": details && details.user_uuid,
            "department_id": details && details.department_id,
            "reporting_manager_uuid": details && details.reporting_manager_uuid,
            "designation_id": details && details.designation_id,
            "employee_uuid": empDetail.uuid,
            "date_of_joining": details && details.date_of_joining,
            "date_of_confirmation": details && details.date_of_confirmation,
            "office_id": details && details.office_id,
            "email": details && details.email,
            "address": details && details.address,
            "country": details && details.country,
            "location_id": details && details.location_id,
            "employee_status": details && details.employee_status,
            "total_experience": details && details.total_experience,
            "time_zone": details && details.time_zone,
            "role_uuid": details && details.role_uuid,
            "description": details && details.description,
            "gender": details && details.gender,
            "profile_picture": image,
            "shift_timing_id": details && details.shift_timing_id,
        };

        updateMemberMutateAsync(editProfile).then(() => {
            refetch();
            setEditable(false);
        });
    };

    const reportingManager = dataAllRm?.filter(
        (item) => item.uuid == details?.reporting_manager_uuid
    )[0];

    const uploadResume = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setResumeName(file.name);
        setResume(base64);
    };

    return (
        <div className="profile">
            <Row className="mb-2">
                <Col xs={6}>
                    <Breadcrumb />
                </Col>
                <Col xs={6} className="text-end">
                    {editable ? (
                        <Button
                            className="editButton"
                            variant="outline-primary"
                            onClick={backToProfile}
                        >
                            Back
                        </Button>
                    ) : (
                        <Button
                            className="editButton"
                            variant="outline-primary"
                            onClick={editProfile}
                        >
                            <FiEdit className="icon" />
                            Edit Detail
                        </Button>
                    )}
                </Col>
            </Row>
            <Row>
                <Col xs={3} className="px-2">
                    <div className="profileImgSection">
                        <div className="imgSection">
                            <div className="imgContainer">
                                <label htmlFor="fileTag" className="label" hidden={!editable}>
                                    <div className="customImg">
                                        <div>
                                            <GrGallery className="icons" />
                                        </div>
                                    </div>
                                    <Input
                                        type="File"
                                        name="profile_picture"
                                        onChangeHandler={uploadImage}
                                        onClickHandler={(event) => {
                                            event.target.value = null;
                                        }}
                                        id="fileTag"
                                        className="form-control customStyle"
                                    />
                                </label>
                                <div className="img">{<img src={image} alt="" />}</div>
                            </div>
                            <h6>
                                {details?.first_name} {details?.last_name}
                            </h6>
                            <p>{details?.designation_name}</p>
                        </div>
                        <div className="phoneSection">
                            <img src={Phone} alt="" />
                            <p>
                                {"+91"} {details?.phone_number}
                            </p>
                        </div>
                        <div className="emailSection">
                            <img src={Email} alt="" />
                            <p>{details?.email}</p>
                        </div>
                        <div className="phoneSection">
                            <img src={Email} alt="" />
                            <p>{details?.department_name}</p>
                        </div>
                    </div>
                </Col>
                <Col xs={9} className="px-2">
                    <div className="profileDetailSection">
                        <div className="basicDetail cardCustomTitle">Basic information</div>
                        <form onSubmit={handleSubmit(handleOnSubmitProfileUpdate)}>
                            <Row>
                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>First Name</label>
                                    <Input
                                        type="text"
                                        name="first_name"
                                        className="form-control"
                                        placeholder="First name"
                                        disabled={!editable}
                                        reference={register({required: requiredField()})}
                                    />
                                    {errors.first_name && (
                                        <small className="form-text text-danger">
                                            {errors.first_name.message}
                                        </small>
                                    )}
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>Last Name</label>
                                    <Input
                                        type="text"
                                        name="last_name"
                                        className="form-control"
                                        placeholder="Last Name"
                                        disabled={!editable}
                                        reference={register({})}
                                    />
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>Mobile Number</label>
                                    <Input
                                        type="number"
                                        name="phone_number"
                                        className="form-control"
                                        placeholder="Mobile Number"
                                        disabled={!editable}
                                        reference={register({
                                            required: requiredField(),
                                            pattern: PhonePattern(),
                                        })}
                                    />
                                    {errors.phone_number && (
                                        <small className="form-text text-danger">
                                            {errors.phone_number.message}
                                        </small>
                                    )}
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>Employee ID</label>
                                    <Input
                                        type="text"
                                        name="office_id"
                                        className="form-control"
                                        placeholder="Employee ID"
                                        disabled={true}
                                        reference={register()}
                                    />
                                </Col>

                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>DOB</label>
                                    <Input
                                        type="date"
                                        name="dob"
                                        max={`${year}-01-01`}
                                        className="form-control"
                                        placeholder="Current Password"
                                        disabled={!editable}
                                        reference={register({required: requiredField()})}
                                    />
                                    {errors.dob && (
                                        <small className="form-text text-danger">
                                            {errors.dob.message}
                                        </small>
                                    )}
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>Email ID</label>
                                    <Input
                                        type="text"
                                        name="email"
                                        className="form-control"
                                        placeholder="Email ID"
                                        disabled={true}
                                        reference={register()}
                                    />
                                </Col>
                            </Row>
                            <div className="basicDetail cardCustomTitle mt-3">Work information</div>
                            <Row>
                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>Location</label>
                                    <Input
                                        type="text"
                                        name="location_name"
                                        className="form-control"
                                        disabled={true}
                                        reference={register()}
                                    />
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>Reporting Manager</label>
                                    <Input
                                        type="text"
                                        name="reportingManager"
                                        className="form-control"
                                        placeholder="Reporting Manager"
                                        disabled={true}
                                        value={`${reportingManager?.first_name} ${reportingManager?.last_name}`}
                                    />
                                </Col>

                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>Date of Joining</label>
                                    <Input
                                        type="text"
                                        name="date_of_joining"
                                        className="form-control"
                                        placeholder="Date of Joining"
                                        disabled={true}
                                        reference={register()}
                                    />
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>Date of Confirmation</label>
                                    <Input
                                        type="text"
                                        name="date_of_confirmation"
                                        className="form-control"
                                        placeholder="Date of Confirmation"
                                        disabled={true}
                                        reference={register()}
                                    />
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>Probation Period</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        placeholder="Probation Period"
                                        disabled={true}
                                        value={probationPeriod}
                                    />
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>Primary Skill</label>
                                    <select
                                        placeholder="Please select"
                                        name="primary_skill"
                                        className="form-control"
                                        disabled={!editable}
                                        ref={register({
                                            required: requiredField(),
                                        })}
                                    >
                                        {skills &&
                                            skills.map((option, id) => (
                                                <option key={id} value={option.id}>
                                                    {option.skill_name}
                                                </option>
                                            ))}
                                    </select>
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>Employee Status</label>
                                    <Input
                                        type="text"
                                        name="employee_status"
                                        className="form-control"
                                        placeholder="Employee Status"
                                        disabled={true}
                                        reference={register()}
                                    />
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>Total Experience</label>
                                    <Input
                                        type="text"
                                        name="total_experience"
                                        className="form-control"
                                        placeholder="Total Experience"
                                        disabled={true}
                                        reference={register()}
                                    />
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>Designation</label>
                                    <Input
                                        type="text"
                                        name="designation"
                                        className="form-control"
                                        placeholder="Designation"
                                        disabled={true}
                                        value={details?.designation_name}
                                    />
                                </Col>
                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>Department</label>
                                    <Input
                                        type="text"
                                        name="department"
                                        className="form-control"
                                        placeholder="Department"
                                        disabled={true}
                                        value={details?.department_name}
                                    />
                                </Col>

                                <Col xs={12} sm={6} lg={4} className="mb-3 px-2">
                                    <label>Secondary Skills</label>
                                    <Input
                                        type="text"
                                        placeholder="Secondary skills"
                                        className="form-control"
                                        disabled={!editable}
                                        name="secondary_skills"
                                        reference={register({})}
                                    />
                                    {errors.secondary_skills && (
                                        <small className="form-text text-danger">
                                            {errors.secondary_skills.message}
                                        </small>
                                    )}
                                </Col>

                                <Col xs={12} sm={12} className="buttonSection">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size={"sm"}
                                        disabled={!editable}
                                    >
                                        Save Profile
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size={"sm"}
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancel
                                    </Button>
                                </Col>
                                {/* </Col> */}
                            </Row>
                        </form>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Index;
