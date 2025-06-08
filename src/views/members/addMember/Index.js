import React, {useEffect, useState} from "react";
import {Button, Col, Row, Tab, Tabs, ProgressBar, Container} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {MdOutlineCancel} from "react-icons/md";
import {useNavigate, useParams} from "react-router-dom";
import {useRecoilValue, useSetRecoilState} from "recoil";
import Breadcrumb from "../../../components/Breadcrumb";
import {useGetCountries} from "../../../query/country/countriesQuery";
import {useGetAllDepartments} from "../../../query/department/allDepartments/allDepartmentsQuery";
import {useGetAllDesignation} from "../../../query/designation/allDesignation/allDesignationQuery";
import {useGetAllLocations} from "../../../query/location/allLocation/allLocationQuery";
import {
    useAddMembers,
    useAddMembersFromCSV,
    useMemberDownloadCSVFile,
} from "../../../query/members/addMembers/addMembersQuery";
import {
    useGetAllRms,
    useGetAllRoles,
    useGetMembersById,
} from "../../../query/members/allMembers/allMembersQuery";
import {useUpdateMembers} from "../../../query/members/updateMembers/updateMembersQuery";
import {useGetShiftTiming} from "../../../query/shiftTiming/shiftTimingQuery";
import {useGetSkills} from "../../../query/skill/skillsQuery";
import {useGetTimeZone} from "../../../query/timeZone/timeZoneQuery";
import {resetAddMemberState} from "../../../recoil/resetFormRecoil";
import {toaster} from "../../../utilits/toast";
import {PhonePattern, emailPattern, requiredField} from "../../../utilits/validation";
import {Input} from "../../widgets/formComponents/Input";
import "./style.scss";
import {capitalizeFirstLetter} from "../../../utilits/usefulFunctions";

const AddMember = () => {
    const params = useParams();
    const navigate = useNavigate();
    const setResetAddMemberState = useSetRecoilState(resetAddMemberState);
    const useresetAddMemberState = useRecoilValue(resetAddMemberState);
    const [countryCode, setCountryCode] = useState("");
    const [image, setImage] = useState();
    const [resume, setResume] = useState();
    const [resumeName, setResumeName] = useState();
    const [year, setYear] = useState();

    const {
        register,
        formState,
        handleSubmit,
        errors,
        reset,
        setValue,
        getValues,
        watch,
        clearErrors,
    } = useForm();

    const addMemberFromWatch = watch("date_of_joining");
    const addMemberToWatch = watch("date_of_confirmation");
    const {data: memberDetail, isLoading: isLoadingMemberDetail} = useGetMembersById(params.id);
    const {data: countryList, isLoading: isLoadingCountryList} = useGetCountries();
    const {data: locations, isLoading: isLoadingLocations} = useGetAllLocations();
    const {data: departments, isLoading: isLoadingDepartments} = useGetAllDepartments();
    const {data: dataAllRm, isLoading: isLoadingAllRm} = useGetAllRms(params.id);
    const {data: designation, isLoading: isLoadingDesignation} = useGetAllDesignation();
    const {data: skills, isLoading: isLoadingSkills} = useGetSkills();
    const {data: shiftTiming, isLoading: isLoadingShiftTiming} = useGetShiftTiming();
    const {data: timeZoneList, isLoading: isLoadingTimeZoneList} = useGetTimeZone(countryCode);
    const {data: userRoles, isLoading: isLoadingUserRoles} = useGetAllRoles();
    const {mutateAsync: addMemberMutateAsync, isLoading: isLoadingAddMembers} = useAddMembers();
    const {mutateAsync: updateMemberMutateAsync, isLoading: isLoadingUpdateMembers} =
        useUpdateMembers();

    const [csvFileState, setCsvFileState] = useState();
    const [csvFileName, setCsvFileName] = useState("");
    const {mutateAsync: addMembersCSVMutateAsync} = useAddMembersFromCSV();
    const {data: downloadCsvFile, isLoading: isLoadingCsvFile} = useMemberDownloadCSVFile();

    const uploadCsvFile = async (e) => {
        const file = e.target.files[0];
        // const base64 = await convertBase64File(file);
        setCsvFileState(file);
        setCsvFileName(file.name);
    };

    const downloadCSVClickHandler = () => {
        if (downloadCsvFile != undefined) {
            var mediaType = "data:text/csv;base64,";
            var userInp = downloadCsvFile && downloadCsvFile;
            var a = document.createElement("a");
            a.href = mediaType + userInp;
            a.download = "Member format.csv";
            a.textContent = "Download file!";
            document.body.appendChild(a);
            a.click();
        }
    };
    const [uploadProgress, setUploadProgress] = useState(false); //true
    const [progressShow, setProgressShow] = useState(false); //true
    const [resMessage, setResMessage] = useState("");
    const [isSuccessOrError, setIsSuccessOrError] = useState("");
    const uploadCSVClickHandler = async () => {
        setProgressShow(true);
        const val = {
            file: csvFileState,
        };
        // addMembersCSVMutateAsync(val);
        const res = await addMembersCSVMutateAsync(val);
        setResMessage(res);
        setProgressShow(false);
        setUploadProgress(true);
        setIsSuccessOrError(res === "Employee Created Successfully!" ? "success" : "error");
        setTimeout(() => {
            setProgressShow(false);
            setUploadProgress(false);
            setIsSuccessOrError("");
        }, 3000);
        setCsvFileName("");
    };

    useEffect(() => {
        var getCountryCode =
            memberDetail && memberDetail.country && memberDetail.country.split("-")[0];
        const formDefaultFields = {
            ...memberDetail,
            phone_number: memberDetail?.phone_number?.substring(2),
            role_uuid:
                userRoles &&
                userRoles.find(({roleName}) => roleName == memberDetail?.role_name)?.role_uuid,
        };
        reset(formDefaultFields);
        setImage(memberDetail?.profile_picture);
        setCountryCode(getCountryCode);
    }, [memberDetail]);

    useEffect(() => {
        if (!params.id) {
            reset({});
        }
    }, [params.id]);

    useEffect(() => {
        const year = new Date().getFullYear() - 17;
        setYear(year);
    }, []);

    useEffect(() => {
        if (useresetAddMemberState) {
            setImage("");
            setCountryCode("");
            reset({});
        }
    }, [useresetAddMemberState]);

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

    const uploadResume = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setResumeName(file.name);
        setResume(base64);
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

    const handleOnSubmitProject = (memberData) => {
        const newMemberData = {
            ...memberData,
            "profile_picture": image,
            "resume_name": resumeName,
            "resume": resume,
        };
        const updateMemberData = {
            ...memberData,
            "profile_picture": image,
            "resume": resume,
            "resume_name": resumeName,
            "user_uuid": memberDetail?.user_uuid,
            "employee_uuid": params.id,
            "office_id": memberDetail?.office_id,
            "email": memberDetail?.email,
        };
        if (params?.id) {
            updateMemberMutateAsync(updateMemberData);
        } else {
            addMemberMutateAsync(newMemberData);
        }
        setResetAddMemberState(false);
    };

    const handleCancelImage = (e) => {
        e.preventDefault();
        setImage("");
    };

    const getTimeZone = (e) => {
        setCountryCode(e.target.value.split("-")[0]);
    };

    // if (
    //     isLoadingAllRm &&
    //     isLoadingShiftTiming &&
    //     isLoadingMemberDetail &&
    //     isLoadingSkills &&
    //     isLoadingUserRoles &&
    //     isLoadingDesignation &&
    //     isLoadingDepartments &&
    //     isLoadingLocations
    // ) {
    //     return <p>loader..</p>;
    // }
    // if (isLoadingCountryList) {
    //     return <p>loader..</p>;
    // }

    return (
        <div className="addMemberMainDiv container">
            <Row className="mb-2">
                <Col xs={6}>
                    <Breadcrumb />
                </Col>
                {/* <Col xs={6} className="clientButtonGroup">
            <Button className='editButton' variant='primary'><BiEdit className='icon'/>Edit client</Button>
        </Col> */}
            </Row>
            <div className="addclient mb-5">
                <Tabs id="controlled-tab-example" className="mb-3">
                    <Tab eventKey="Manual Upload" title="Manual Upload" className="container">
                        <form onSubmit={handleSubmit(handleOnSubmitProject)}>
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
                                            type="File"
                                            onChangeHandler={uploadImage}
                                            onClickHandler={(event) => {
                                                event.target.value = null;
                                            }}
                                            id="fileTag"
                                            className="form-control customStyle"
                                        />
                                    </label>
                                </Col>
                                <Col sm={9} className="mb-3">
                                    <Container>
                                        <Row>
                                            <Col sm={6} className="mb-3">
                                                <label
                                                    className={`${
                                                        errors.first_name ? "text-danger" : ""
                                                    }`}
                                                >
                                                    First Name *
                                                </label>
                                                <Input
                                                    type="text"
                                                    placeholder="First Name"
                                                    className="form-control"
                                                    name="first_name"
                                                    reference={register({
                                                        required: requiredField(),
                                                    })}
                                                />
                                                {errors.first_name && (
                                                    <small className="form-text text-danger">
                                                        {errors.first_name.message}
                                                    </small>
                                                )}
                                            </Col>
                                            <Col sm={6} className="mb-3">
                                                <label>Last Name</label>
                                                <Input
                                                    type="text"
                                                    placeholder="Last Name"
                                                    className="form-control"
                                                    name="last_name"
                                                    reference={register({})}
                                                />
                                                {errors.last_name && (
                                                    <small className="form-text text-danger">
                                                        {errors.last_name.message}
                                                    </small>
                                                )}
                                            </Col>
                                            <Col sm={6} className="mb-3">
                                                <label
                                                    className={`${
                                                        errors.gender ? "text-danger" : ""
                                                    }`}
                                                >
                                                    Gender *
                                                </label>
                                                <select
                                                    placeholder="Gender*"
                                                    className="form-control"
                                                    name="gender"
                                                    ref={register({required: requiredField()})}
                                                >
                                                    <option key='1' value="">Select Gender</option>
                                                    <option key='2' value="Male">Male</option>
                                                    <option key='3' value="Female">Female</option>
                                                </select>
                                                {errors.gender && (
                                                    <small className="form-text text-danger">
                                                        {errors.gender.message}
                                                    </small>
                                                )}
                                            </Col>
                                            <Col sm={6} className="mb-3">
                                                <label
                                                    className={`${
                                                        errors.email ? "text-danger" : ""
                                                    }`}
                                                >
                                                    Email *
                                                </label>
                                                <Input
                                                    type="text"
                                                    placeholder="Email ID"
                                                    className="form-control"
                                                    name="email"
                                                    disabled={params.id}
                                                    reference={register({
                                                        required: requiredField(),
                                                        pattern: emailPattern(),
                                                    })}
                                                />
                                                {errors.email && (
                                                    <small className="form-text text-danger">
                                                        {errors.email.message}
                                                    </small>
                                                )}
                                            </Col>
                                            <Col sm={6}>
                                                <label
                                                    className={`${
                                                        errors.phone_number ? "text-danger" : ""
                                                    }`}
                                                >
                                                    Mobile Number *
                                                </label>
                                                <Input
                                                    type="number"
                                                    placeholder="Mobile Number"
                                                    className="form-control"
                                                    name="phone_number"
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
                                            <Col sm={6}>
                                                <label
                                                    className={`${errors.dob ? "text-danger" : ""}`}
                                                >
                                                    DOB *
                                                </label>
                                                <Input
                                                    type="date"
                                                    max={`${year}-01-01`}
                                                    placeholder="Date Of Birth"
                                                    className="form-control datePick"
                                                    name="dob"
                                                    reference={register({
                                                        required: requiredField(),
                                                    })}
                                                />
                                                {errors.dob && (
                                                    <small className="form-text text-danger">
                                                        {errors.dob.message}
                                                    </small>
                                                )}
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                                <Col sm={4} md={3} className="mb-3">
                                    <label className={`${errors.location_id ? "text-danger" : ""}`}>
                                        Location *
                                    </label>
                                    <select
                                        placeholder="Location*"
                                        className="form-control customScroll"
                                        name="location_uuid"
                                        disabled={isLoadingLocations}
                                        ref={register({required: requiredField()})}
                                    >
                                        <option key='0' value="">Select Location</option>
                                        {locations &&
                                            locations.map((option, index) => (
                                                <option key={`${index+1}`} value={option.uuid}>
                                                    {option.location_name}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.location_uuid && (
                                        <small className="form-text text-danger">
                                            {errors.location_uuid.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={4} md={3} className="mb-3">
                                    <label
                                        className={`${errors.department_uuid ? "text-danger" : ""}`}
                                    >
                                        Department *
                                    </label>
                                    <select
                                        placeholder="Department*"
                                        className="form-control customScroll"
                                        name="department_uuid"
                                        disabled={isLoadingDepartments}
                                        ref={register({required: requiredField()})}
                                    >
                                        <option key='0' value="">Select Department</option>
                                        {departments &&
                                            departments.map((option, index) => (
                                                <option
													key={`${index+1}`}
                                                    value={option.department_uuid}
                                                >
                                                    {option.department_name}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.department_uuid && (
                                        <small className="form-text text-danger">
                                            {errors.department_uuid.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={4} md={3} className="mb-3">
                                    <label
                                        className={`${errors.designation_id ? "text-danger" : ""}`}
                                    >
                                        Designation *
                                    </label>
                                    <select
                                        placeholder="Designation*"
                                        className="form-control customScroll"
                                        name="designation_uuid"
                                        disabled={isLoadingDesignation}
                                        ref={register({required: requiredField()})}
                                    >
                                        <option index='0' value="">Select Designation</option>
                                        {designation &&
                                            designation.map((option, index) => (
                                                <option
													key={`${index+1}`}
                                                    value={option.designation_uuid}
                                                >
                                                    {option.designation_name}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.designation_uuid && (
                                        <small className="form-text text-danger">
                                            {errors.designation_uuid.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={4} md={3} className="mb-3">
                                    <label className={`${errors.role_uuid ? "text-danger" : ""}`}>
                                        Role *
                                    </label>
                                    <select
                                        placeholder="Designation *"
                                        className="form-control customScroll"
                                        name="role_uuid"
                                        disabled={isLoadingUserRoles}
                                        ref={register({required: requiredField()})}
                                    >
                                        <option key='0' value="">Select Role</option>
                                        {userRoles &&
                                            userRoles.map((option, index) => (
                                                <option
													key={`${index+1}`}
                                                    value={option.role_uuid}
                                                >
                                                    {option.roleName}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.role_uuid && (
                                        <small className="form-text text-danger">
                                            {errors.role_uuid.message}
                                        </small>
                                    )}
                                </Col>

                                <Col sm={4} md={3} className="mb-3">
                                    <label
                                        className={`${
                                            errors.reporting_manager_id ? "text-danger" : ""
                                        }`}
                                    >
                                        Reporting Manager *
                                    </label>
                                    <select
                                        placeholder="Reporting Manager*"
                                        disabled={isLoadingAllRm}
                                        className="form-control customScroll"
                                        name="reporting_manager_uuid"
                                        ref={register({required: requiredField()})}
                                    >
                                        <option key='0' value="">Select Reporting Manager</option>
                                        {dataAllRm &&
                                            dataAllRm.map((option, index) => (
                                                <option key={`${index+1}`} value={option.uuid}>
                                                    {option.first_name} {option.last_name}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.reporting_manager_uuid && (
                                        <small className="form-text text-danger">
                                            {errors.reporting_manager_uuid.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={4} md={3} className="mb-3">
                                    <label
                                        className={`${errors.employee_status ? "text-danger" : ""}`}
                                    >
                                        Employee Status *
                                    </label>
                                    <select
                                        placeholder="Employee Status*"
                                        className="form-control"
                                        name="employee_status"
                                        ref={register({
                                            required: requiredField(),
                                        })}
                                    >
                                        <option key='1' value="">Select Employee Status</option>
                                        <option key='2' value="Full-time Employee">
                                            Full-time Employee
                                        </option>
                                        <option key='3' value="Probation">Probation</option>
                                        <option key='4' value="Notice Period">Notice Period</option>
                                    </select>
                                    {errors.employee_status && (
                                        <small className="form-text text-danger">
                                            {errors.employee_status.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={4} md={3} className="mb-3">
                                    <label
                                        className={`${errors.date_of_joining ? "text-danger" : ""}`}
                                    >
                                        DOJ *
                                    </label>
                                    <Input
                                        type="date"
                                        className="form-control datePick"
                                        name="date_of_joining"
                                        reference={register({
                                            required:
                                                isNaN(addMemberToWatch) && isNaN(addMemberFromWatch)
                                                    ? false
                                                    : "Value required",
                                            validate: {
                                                lessThan: (v) => {
                                                    if (v === "" && isNaN(addMemberToWatch))
                                                        return true;
                                                    if (addMemberToWatch > Date(v)) {
                                                        clearErrors("date_of_confirmation");
                                                    }
                                                    return (
                                                        addMemberToWatch > v ||
                                                        `Should be less than ${
                                                            isNaN(addMemberToWatch)
                                                                ? "end date"
                                                                : addMemberToWatch
                                                        }`
                                                    );
                                                },
                                            },
                                        })}
                                    />
                                    {errors.date_of_joining && (
                                        <small className="form-text text-danger">
                                            {errors.date_of_joining.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={4} md={3} className="mb-3">
                                    <label
                                        className={`${
                                            errors.date_of_confirmation ? "text-danger" : ""
                                        }`}
                                    >
                                        DOC *
                                    </label>
                                    <Input
                                        type="date"
                                        className="form-control datePick"
                                        name="date_of_confirmation"
                                        reference={register({
                                            required: params.id
                                                ? isNaN(addMemberToWatch) &&
                                                  isNaN(addMemberFromWatch)
                                                    ? false
                                                    : "Value required"
                                                : false,
                                            validate: {
                                                greaterThan: (v) => {
                                                    if (v === "" && isNaN(addMemberFromWatch))
                                                        return true;
                                                    if (addMemberFromWatch < Date(v)) {
                                                        clearErrors("date_of_joining");
                                                    }
                                                    return (
                                                        addMemberFromWatch < Date(v) ||
                                                        `Should be greater than ${
                                                            isNaN(addMemberFromWatch)
                                                                ? "start date"
                                                                : addMemberFromWatch
                                                        }`
                                                    );
                                                },
                                            },
                                            required: requiredField(),
                                        })}
                                    />
                                    {errors.date_of_confirmation && (
                                        <small className="form-text text-danger">
                                            {errors.date_of_confirmation.message}
                                        </small>
                                    )}
                                </Col>

                                <Col sm={4} md={3} className="mb-3">
                                    <label
                                        className={`${
                                            errors.total_experience ? "text-danger" : ""
                                        }`}
                                    >
                                        Total Experience *
                                    </label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="40"
                                        step="0.1"
                                        placeholder="Total Experience"
                                        className="form-control"
                                        name="total_experience"
                                        reference={register({required: requiredField()})}
                                    />
                                    {errors.total_experience && (
                                        <small className="form-text text-danger">
                                            {errors.total_experience.message}
                                        </small>
                                    )}
                                </Col>

                                <Col sm={4} md={3} className="mb-3">
                                    <label className={`${errors.country ? "text-danger" : ""}`}>
                                        Country *
                                    </label>
                                    <select
                                        placeholder="Select Country"
                                        className="form-control customScroll"
                                        name="country"
                                        disabled={isLoadingCountryList}
                                        onChange={(e) => getTimeZone(e)}
                                        ref={register({
                                            required: requiredField(),
                                        })}
                                    >
                                        <option key='0' value="">Select Country</option>
                                        {countryList &&
                                            countryList.map((option, index) => (
                                                <option key={`${index+1}`} value={option?.iso2}>
                                                    {option.name}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.country && (
                                        <small className="form-text text-danger">
                                            {errors.country.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={4} md={3} className="mb-3">
                                    <label className={`${errors.time_zone ? "text-danger" : ""}`}>
                                        Time Zone *
                                    </label>

                                    <select
                                        placeholder={
                                            isLoadingTimeZoneList ? "Loading..." : "time zone"
                                        }
                                        className="form-control"
                                        disabled={isLoadingTimeZoneList ? true : false}
                                        name="time_zone"
                                        ref={register({
                                            required: requiredField(),
                                        })}
                                    >
                                        <option key='0' value="">
                                            {isLoadingTimeZoneList
                                                ? "Loading..."
                                                : "Select Time Zone"}
                                        </option>
                                        {timeZoneList &&
                                            timeZoneList.map((option, index) => (
                                                <option key={`${index+1}`} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                    </select>

                                    {errors.time_zone && (
                                        <small className="form-text text-danger">
                                            {errors.time_zone.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <label className={`${errors.address ? "text-danger" : ""}`}>
                                        Address *
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Address"
                                        className="form-control"
                                        name="address"
                                        reference={register({required: requiredField()})}
                                    />
                                    {errors.address && (
                                        <small className="form-text text-danger">
                                            {errors.address.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <label
                                        className={`${errors.primary_skill ? "text-danger" : ""}`}
                                    >
                                        Primary Skill *
                                    </label>
                                    <select
                                        className="form-control customScroll"
                                        placeholder="Please select"
                                        name="primary_skill"
                                        ref={register({
                                            required: requiredField(),
                                        })}
                                    >
                                        {skills &&
                                            skills.map((option, index) => (
                                                <option
													key={`${index+1}`}
                                                    value={option.skill_uuid}
                                                >
                                                    {option.skill_name}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.primary_skill && (
                                        <small className="form-text text-danger">
                                            {errors.primary_skill.message}
                                        </small>
                                    )}
                                </Col>

                                <Col sm={6} className="mb-3">
                                    <label
                                        className={`${
                                            errors.secondary_skills ? "text-danger" : ""
                                        }`}
                                    >
                                        Secondary Skills
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Secondary skills"
                                        className="form-control"
                                        name="secondary_skills"
                                        reference={register({})}
                                    />
                                    {errors.secondary_skills && (
                                        <small className="form-text text-danger">
                                            {errors.secondary_skills.message}
                                        </small>
                                    )}
                                </Col>

                                <Col sm={6} className="mb-3">
                                    <label
                                        className={`${errors.primary_skill ? "text-danger" : ""}`}
                                    >
                                        Shift Timing *
                                    </label>
                                    <select
                                        className="form-control customScroll"
                                        placeholder="Please select"
                                        name="shift_timing_uuid"
                                        ref={register({
                                            required: requiredField(),
                                        })}
                                    >
                                        <option key='0' value="">Select Shift Time</option>
                                        {shiftTiming &&
                                            shiftTiming.map((item, index) => (
                                                <option
													key={`${index+1}`}
                                                    value={item.shift_timing_uuid}
                                                >
                                                    {item.formatted_shift_timing}
                                                </option>
                                            ))}
                                    </select>
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <label
                                        className={`${
                                            errors.area_of_interest ? "text-danger" : ""
                                        }`}
                                    >
                                        Area Of Interest
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Area of Interest"
                                        className="form-control"
                                        name="area_of_interest"
                                        reference={register({})}
                                    />
                                    {errors.area_of_interest && (
                                        <small className="form-text text-danger">
                                            {errors.area_of_interest.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={6} className="mb-3" hidden={params.id}>
                                    <label className={`${errors.resume ? "text-danger" : ""}`}>
                                        Resume
                                    </label>
                                    <Input
                                        type="file"
                                        placeholder="Address"
                                        className="form-control"
                                        name="resume"
                                        id="resume"
                                        onChangeHandler={uploadResume}
                                        reference={register({})}
                                    />
                                    {errors.resume && (
                                        <small className="form-text text-danger">
                                            {errors.resume.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={12} className="mb-3">
                                    <label>Description</label>
                                    <textarea
                                        type="text"
                                        id="text-edit"
                                        placeholder="Description"
                                        className="form-control"
                                        name="description"
                                        ref={register({})}
                                    ></textarea>
                                </Col>
                            </Row>

                            <Row className="mt-4 mb-2">
                                <Col sm={12} className="buttonSection">
                                    <Button
                                        // disabled={!formState.isValid}
                                        variant="primary"
                                        type="submit"
                                    >
                                        {params.id ? "Update" : "Add"} Member
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
                    </Tab>
                    <Tab eventKey="CSV upload" title="CSV upload">
                        <label htmlFor="issueFile" className="labelAdmin">
                            <div className="customImg">
                                <AiOutlineCloudUpload className="icons" />
                                {csvFileName == "" ? (
                                    <p>Upload from Computer or Other</p>
                                ) : (
                                    <div>{csvFileName}</div>
                                )}
                            </div>
                            <Input
                                type="file"
                                className="form-control customStyle"
                                onChangeHandler={uploadCsvFile}
                                id="issueFile"
                                accept=".csv"
                            />
                        </label>
                        <Container>
                            <Row className="mt-4 mb-2">
                                <Col sm={6}>
                                    <Button
                                        disabled={csvFileName === "" ? true : false}
                                        onClick={uploadCSVClickHandler}
                                    >
                                        Start Importing
                                    </Button>
                                </Col>
                                <Col sm={6} className="downloadCsvContainer">
                                    <Button
                                        className="downloadCsv"
                                        onClick={downloadCSVClickHandler}
                                    >
                                        Download CSV
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                        {progressShow === true ? (
                            <div className="progressBarCss container">
                                <Row className="mt-4 mb-2">
                                    <Col>
                                        <h6>Progress....</h6>
                                        <ProgressBar
                                            className="progressBarLine"
                                            striped
                                            variant="success"
                                            now={100}
                                            animated="true"
                                        />
                                    </Col>
                                </Row>
                            </div>
                        ) : (
                            uploadProgress && (
                                <div className="progressBarCss container">
                                    <Row className="mt-4 mb-2">
                                        <Col>
                                            <h6>{resMessage}</h6>
                                            <ProgressBar
                                                className="progressBarLine"
                                                striped
                                                variant={
                                                    isSuccessOrError === "success"
                                                        ? "success"
                                                        : "danger"
                                                }
                                                now={100}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            )
                        )}
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default AddMember;
