import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Col,
  Row,
  Tab,
  Tabs,
  ProgressBar,
  Container,
  Table,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AiOutlineCloudUpload, AiOutlinePlusCircle } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Breadcrumb from "../../../components/Breadcrumb";
import { useGetCountries } from "../../../query/country/countriesQuery";
import { useGetAllDepartments } from "../../../query/department/allDepartments/allDepartmentsQuery";
import { useGetAllDesignation } from "../../../query/designation/allDesignation/allDesignationQuery";
import { useGetAllLocations } from "../../../query/location/allLocation/allLocationQuery";
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
import { useUpdateMembers } from "../../../query/members/updateMembers/updateMembersQuery";
import { useGetShiftTiming } from "../../../query/shiftTiming/shiftTimingQuery";
import { useGetSkills } from "../../../query/skill/skillsQuery";
import { useGetTimeZone } from "../../../query/timeZone/timeZoneQuery";
import { resetAddMemberState } from "../../../recoil/resetFormRecoil";
import { toaster } from "../../../utilits/toast";
import {
  PhonePattern,
  emailPattern,
  requiredField,
} from "../../../utilits/validation";
import { Input } from "../../widgets/formComponents/Input";
import "./style.scss";
import { capitalizeFirstLetter } from "../../../utilits/usefulFunctions";
import AddSkill from "../addSkill";
import { authState } from "../../../recoil/authRecoil";
import { useGetSkill } from "../../../query/skillManagement/getSkill/getSkillQuery";

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
  
  // Get auth state for employee UUID
  const authUser = useRecoilValue(authState);
  const empUuid = authUser?.uuid;

  // Mock data for testing (keeping API integration code intact)
  const mockSkillsData = [
    {
      "id": 1,
      "employee_uuid": "eb7424c4-b2fc-4501-9b78-43d973d717ef",
      "skill_uuid": "ef98372d-ad76-4ce6-9924-42f218f57221",
      "skill_name": "Java",
      "certificate_uuid": "d738ae90-7ce8-40d4-add8-a26c6f957913",
      "is_certified": true,
      "skill_rating_by_pm": 8,
      "skills_remarks": "Outstanding Java development skills with Spring framework",
      "remark_date": "2024-12-10",
      "proficiency_level": "Expert",
      "skill_version": "17.0.0",
      "skill_type": "primary",
      "start_date": "2023-01-15",
      "end_date": "2025-01-15",
      "certificate": "java-certification-2024",
      "certificate_name": "Java Advanced Developer",
      "last_evaluated": "2024-12-10T10:30:00.000000"
    },
    {
      "id": 2,
      "employee_uuid": "eb7424c4-b2fc-4501-9b78-43d973d717ef",
      "skill_uuid": "ef98372d-ad76-4ce6-9924-42f218f57222",
      "skill_name": "Python",
      "certificate_uuid": null,
      "is_certified": false,
      "skill_rating_by_pm": 7,
      "skills_remarks": "Strong Python fundamentals and data science libraries",
      "remark_date": "2024-11-15",
      "proficiency_level": "Advanced",
      "skill_version": "3.11.0",
      "skill_type": "primary",
      "start_date": "2022-06-01",
      "end_date": null,
      "certificate": null,
      "certificate_name": null,
      "last_evaluated": "2024-11-15T14:20:00.000000"
    },
    {
      "id": 3,
      "employee_uuid": "eb7424c4-b2fc-4501-9b78-43d973d717ef",
      "skill_uuid": "ef98372d-ad76-4ce6-9924-42f218f57223",
      "skill_name": "Android",
      "certificate_uuid": "e738ae90-7ce8-40d4-add8-a26c6f957914",
      "is_certified": true,
      "skill_rating_by_pm": 6,
      "skills_remarks": "Good understanding of Android native development",
      "remark_date": "2024-10-22",
      "proficiency_level": "Intermediate",
      "skill_version": "14.0",
      "skill_type": "secondary",
      "start_date": "2023-03-10",
      "end_date": "2024-12-31",
      "certificate": "android-developer-cert",
      "certificate_name": "Android Certified Developer",
      "last_evaluated": "2024-10-22T09:15:00.000000"
    },
    {
      "id": 4,
      "employee_uuid": "eb7424c4-b2fc-4501-9b78-43d973d717ef",
      "skill_uuid": "ef98372d-ad76-4ce6-9924-42f218f57224",
      "skill_name": "React-Native",
      "certificate_uuid": null,
      "is_certified": false,
      "skill_rating_by_pm": 4,
      "skills_remarks": "Learning React Native for cross-platform development",
      "remark_date": "2024-09-30",
      "proficiency_level": "Beginner",
      "skill_version": "0.72.0",
      "skill_type": "secondary",
      "start_date": "2024-01-20",
      "end_date": null,
      "certificate": null,
      "certificate_name": null,
      "last_evaluated": "2024-09-30T16:45:00.000000"
    },
    {
      "id": 5,
      "employee_uuid": "eb7424c4-b2fc-4501-9b78-43d973d717ef",
      "skill_uuid": "ef98372d-ad76-4ce6-9924-42f218f57225",
      "skill_name": "JavaScript",
      "certificate_uuid": "f738ae90-7ce8-40d4-add8-a26c6f957915",
      "is_certified": true,
      "skill_rating_by_pm": 7,
      "skills_remarks": "Excellent JavaScript ES6+ and modern frameworks",
      "remark_date": "2024-12-01",
      "proficiency_level": "Advanced",
      "skill_version": "ES2023",
      "skill_type": "primary",
      "start_date": "2022-11-05",
      "end_date": "2025-11-05",
      "certificate": "javascript-developer-cert",
      "certificate_name": "JavaScript Certified Developer",
      "last_evaluated": "2024-12-01T11:30:00.000000"
    },
    {
      "id": 6,
      "employee_uuid": "eb7424c4-b2fc-4501-9b78-43d973d717ef",
      "skill_uuid": "ef98372d-ad76-4ce6-9924-42f218f57221",
      "skill_name": "Java",
      "certificate_uuid": "g738ae90-7ce8-40d4-add8-a26c6f957916",
      "is_certified": true,
      "skill_rating_by_pm": 9,
      "skills_remarks": "Expert level Java enterprise development",
      "remark_date": "2024-11-28",
      "proficiency_level": "Expert",
      "skill_version": "21.0.0",
      "skill_type": "secondary",
      "start_date": "2023-07-12",
      "end_date": "2026-07-12",
      "certificate": "java-enterprise-architect",
      "certificate_name": "Java Enterprise Architect",
      "last_evaluated": "2024-11-28T08:20:00.000000"
    },
    {
      "id": 7,
      "employee_uuid": "eb7424c4-b2fc-4501-9b78-43d973d717ef",
      "skill_uuid": "ef98372d-ad76-4ce6-9924-42f218f57222",
      "skill_name": "Python",
      "certificate_uuid": null,
      "is_certified": false,
      "skill_rating_by_pm": 5,
      "skills_remarks": "Good Python skills for automation and scripting",
      "remark_date": "2024-08-15",
      "proficiency_level": "Intermediate",
      "skill_version": "3.12.0",
      "skill_type": "secondary",
      "start_date": "2023-09-18",
      "end_date": null,
      "certificate": null,
      "certificate_name": null,
      "last_evaluated": "2024-08-15T13:10:00.000000"
    },
    {
      "id": 8,
      "employee_uuid": "eb7424c4-b2fc-4501-9b78-43d973d717ef",
      "skill_uuid": "ef98372d-ad76-4ce6-9924-42f218f57223",
      "skill_name": "Android",
      "certificate_uuid": "h738ae90-7ce8-40d4-add8-a26c6f957917",
      "is_certified": true,
      "skill_rating_by_pm": 8,
      "skills_remarks": "Advanced Android development with Kotlin",
      "remark_date": "2024-12-05",
      "proficiency_level": "Advanced",
      "skill_version": "14.0",
      "skill_type": "primary",
      "start_date": "2022-04-25",
      "end_date": "2025-04-25",
      "certificate": "android-kotlin-cert",
      "certificate_name": "Android Kotlin Developer",
      "last_evaluated": "2024-12-05T15:40:00.000000"
    },
    {
      "id": 9,
      "employee_uuid": "eb7424c4-b2fc-4501-9b78-43d973d717ef",
      "skill_uuid": "ef98372d-ad76-4ce6-9924-42f218f57224",
      "skill_name": "React-Native",
      "certificate_uuid": null,
      "is_certified": false,
      "skill_rating_by_pm": 9,
      "skills_remarks": "Expert React Native cross-platform development",
      "remark_date": "2024-07-20",
      "proficiency_level": "Expert",
      "skill_version": "0.73.0",
      "skill_type": "primary",
      "start_date": "2021-08-10",
      "end_date": null,
      "certificate": null,
      "certificate_name": null,
      "last_evaluated": "2024-07-20T12:25:00.000000"
    },
    {
      "id": 10,
      "employee_uuid": "eb7424c4-b2fc-4501-9b78-43d973d717ef",
      "skill_uuid": "ef98372d-ad76-4ce6-9924-42f218f57225",
      "skill_name": "JavaScript",
      "certificate_uuid": "i738ae90-7ce8-40d4-add8-a26c6f957918",
      "is_certified": true,
      "skill_rating_by_pm": 3,
      "skills_remarks": "Learning modern JavaScript frameworks and tools",
      "remark_date": "2024-11-10",
      "proficiency_level": "Beginner",
      "skill_version": "ES2024",
      "skill_type": "secondary",
      "start_date": "2024-05-01",
      "end_date": "2025-05-01",
      "certificate": "js-fundamentals",
      "certificate_name": "JavaScript Fundamentals",
      "last_evaluated": "2024-11-10T17:00:00.000000"
    }
  ];

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
  const { data: memberDetail, isLoading: isLoadingMemberDetail } =
    useGetMembersById(params.id);
  const { data: countryList, isLoading: isLoadingCountryList } =
    useGetCountries();
  const { data: locations, isLoading: isLoadingLocations } =
    useGetAllLocations();
  const { data: departments, isLoading: isLoadingDepartments } =
    useGetAllDepartments();
  const { data: dataAllRm, isLoading: isLoadingAllRm } = useGetAllRms(
    params.id
  );
  const { data: designation, isLoading: isLoadingDesignation } =
    useGetAllDesignation();
  const { data: skills, isLoading: isLoadingSkills } = useGetSkills();
  const { data: shiftTiming, isLoading: isLoadingShiftTiming } =
    useGetShiftTiming();
  const { data: timeZoneList, isLoading: isLoadingTimeZoneList } =
    useGetTimeZone(countryCode);
  const { data: userRoles, isLoading: isLoadingUserRoles } = useGetAllRoles();
  const { data: employeeSkills, isLoading: isLoadingEmployeeSkills } = 
    useGetSkill(empUuid);
  const { mutateAsync: addMemberMutateAsync, isLoading: isLoadingAddMembers } =
    useAddMembers();
  const {
    mutateAsync: updateMemberMutateAsync,
    isLoading: isLoadingUpdateMembers,
  } = useUpdateMembers();

  const [csvFileState, setCsvFileState] = useState();
  const [csvFileName, setCsvFileName] = useState("");
  const { mutateAsync: addMembersCSVMutateAsync } = useAddMembersFromCSV();
  const { data: downloadCsvFile, isLoading: isLoadingCsvFile } =
    useMemberDownloadCSVFile();

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
    setIsSuccessOrError(
      res === "Employee Created Successfully!" ? "success" : "error"
    );
    setTimeout(() => {
      setProgressShow(false);
      setUploadProgress(false);
      setIsSuccessOrError("");
    }, 3000);
    setCsvFileName("");
  };

  useEffect(() => {
    var getCountryCode =
      memberDetail &&
      memberDetail.country &&
      memberDetail.country.split("-")[0];
    const formDefaultFields = {
      ...memberDetail,
      phone_number: memberDetail?.phone_number?.substring(2),
      role_uuid:
        userRoles &&
        userRoles.find(({ roleName }) => roleName == memberDetail?.role_name)
          ?.role_uuid,
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
      if (!imgsize)
        toaster("error", "The image size should be less than 500KB");
      if (!imgType)
        toaster("error", "The File Type should be in jpg ,jpeg ,png");
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

  const [addSkillModal, setAddSkillModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillModalMode, setSkillModalMode] = useState('add'); // 'add', 'view', 'edit'
  
  const handleOpenAddSkill = useCallback(() => {
    setSelectedSkill(null);
    setSkillModalMode('add');
    setAddSkillModal(true);
  }, []);
  
  const handleCloseAddSkill = useCallback(() => {
    setAddSkillModal(false);
    setSelectedSkill(null);
    setSkillModalMode('add');
  }, []);

  const handleSkillRowClick = useCallback((skill) => {
    setSelectedSkill(skill);
    setSkillModalMode('view');
    setAddSkillModal(true);
  }, []);
  const handleOnSubmitProject = (memberData) => {
    const newMemberData = {
      ...memberData,
      profile_picture: image,
      resume_name: resumeName,
      resume: resume,
    };
    const updateMemberData = {
      ...memberData,
      profile_picture: image,
      resume: resume,
      resume_name: resumeName,
      user_uuid: memberDetail?.user_uuid,
      employee_uuid: params.id,
      office_id: memberDetail?.office_id,
      email: memberDetail?.email,
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

  const [activeTab, setActiveTab] = useState("Manual Upload");

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
        {activeTab === "Skills" && (
          <Col xs={6} className="clientButtonGroup">
            <Button
              className="addButton"
              variant="primary"
              style={{ fontSize: "14px" }}
              onClick={handleOpenAddSkill}
            >
              <AiOutlinePlusCircle className="icon" /> Add Skills
            </Button>
          </Col>
        )}
      </Row>
      <div className="addclient mb-5">
        <Tabs
          id="controlled-tab-example"
          className="mb-3"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
        >
          <Tab
            eventKey="Manual Upload"
            title="Manual Upload"
            className="container"
          >
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
                          className={`${errors.gender ? "text-danger" : ""}`}
                        >
                          Gender *
                        </label>
                        <select
                          placeholder="Gender*"
                          className="form-control"
                          name="gender"
                          ref={register({ required: requiredField() })}
                        >
                          <option key="1" value="">
                            Select Gender
                          </option>
                          <option key="2" value="Male">
                            Male
                          </option>
                          <option key="3" value="Female">
                            Female
                          </option>
                        </select>
                        {errors.gender && (
                          <small className="form-text text-danger">
                            {errors.gender.message}
                          </small>
                        )}
                      </Col>
                      <Col sm={6} className="mb-3">
                        <label
                          className={`${errors.email ? "text-danger" : ""}`}
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
                        <label className={`${errors.dob ? "text-danger" : ""}`}>
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
                  <label
                    className={`${errors.location_id ? "text-danger" : ""}`}
                  >
                    Location *
                  </label>
                  <select
                    placeholder="Location*"
                    className="form-control customScroll"
                    name="location_uuid"
                    disabled={isLoadingLocations}
                    ref={register({ required: requiredField() })}
                  >
                    <option key="0" value="">
                      Select Location
                    </option>
                    {locations &&
                      locations.map((option, index) => (
                        <option key={`${index + 1}`} value={option.uuid}>
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
                    ref={register({ required: requiredField() })}
                  >
                    <option key="0" value="">
                      Select Department
                    </option>
                    {departments &&
                      departments.map((option, index) => (
                        <option
                          key={`${index + 1}`}
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
                    ref={register({ required: requiredField() })}
                  >
                    <option index="0" value="">
                      Select Designation
                    </option>
                    {designation &&
                      designation.map((option, index) => (
                        <option
                          key={`${index + 1}`}
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
                    ref={register({ required: requiredField() })}
                  >
                    <option key="0" value="">
                      Select Role
                    </option>
                    {userRoles &&
                      userRoles.map((option, index) => (
                        <option key={`${index + 1}`} value={option.role_uuid}>
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
                    ref={register({ required: requiredField() })}
                  >
                    <option key="0" value="">
                      Select Reporting Manager
                    </option>
                    {dataAllRm &&
                      dataAllRm.map((option, index) => (
                        <option key={`${index + 1}`} value={option.uuid}>
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
                    <option key="1" value="">
                      Select Employee Status
                    </option>
                    <option key="2" value="Full-time Employee">
                      Full-time Employee
                    </option>
                    <option key="3" value="Probation">
                      Probation
                    </option>
                    <option key="4" value="Notice Period">
                      Notice Period
                    </option>
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
                          if (v === "" && isNaN(addMemberToWatch)) return true;
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
                        ? isNaN(addMemberToWatch) && isNaN(addMemberFromWatch)
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
                    reference={register({ required: requiredField() })}
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
                    <option key="0" value="">
                      Select Country
                    </option>
                    {countryList &&
                      countryList.map((option, index) => (
                        <option key={`${index + 1}`} value={option?.iso2}>
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
                    <option key="0" value="">
                      {isLoadingTimeZoneList
                        ? "Loading..."
                        : "Select Time Zone"}
                    </option>
                    {timeZoneList &&
                      timeZoneList.map((option, index) => (
                        <option key={`${index + 1}`} value={option}>
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
                    reference={register({ required: requiredField() })}
                  />
                  {errors.address && (
                    <small className="form-text text-danger">
                      {errors.address.message}
                    </small>
                  )}
                </Col>
                <Col sm={6} className="mb-3">
                  <label
                    className={`${
                      errors.primary_skill ? "text-danger" : ""
                    }`}
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
                        <option key={`${index + 1}`} value={option.skill_uuid}>
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
                    <option key="0" value="">
                      Select Shift Time
                    </option>
                    {shiftTiming &&
                      shiftTiming.map((item, index) => (
                        <option
                          key={`${index + 1}`}
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
          <Tab eventKey="Skills" title="Skills" className="container">
            <Row className="mt-4 mb-2">
              <Col>
                <div className="table-responsive">
                  <Table striped bordered hover className="equal-width-table">
                    <thead>
                      <tr>
                        <th>Skill Name</th>
                        <th>Skill Type</th>
                        <th>Proficiency Level</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Last Evaluated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Using mock data for now - API integration code kept intact above */}
                      {mockSkillsData && mockSkillsData.length > 0 ? (
                        mockSkillsData.map((skill, index) => (
                          <tr 
                            key={skill.id || index} 
                            onClick={() => handleSkillRowClick(skill)}
                            style={{ cursor: 'pointer' }}
                            className="skill-table-row"
                          >
                            <td>{skill.skill_name}</td>
                            <td>{skill.skill_type}</td>
                            <td>{skill.proficiency_level}</td>
                            <td>{skill.start_date}</td>
                            <td>{skill.end_date || "--"}</td>
                            <td>{skill.last_evaluated ? new Date(skill.last_evaluated).toLocaleDateString() : "--"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <div className="text-muted">
                              <h5>No Skill data available</h5>
                              <p>Add Skills to see them here.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                      
                      {/* 
                      Original API integration code (commented out for now):
                      {isLoadingEmployeeSkills ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <div className="text-muted">
                              <h5>Loading skills...</h5>
                            </div>
                          </td>
                        </tr>
                      ) : employeeSkills && employeeSkills.length > 0 ? (
                        employeeSkills.map((skill, index) => (
                          <tr key={skill.id || index}>
                            <td>{skill.skill_uuid}</td>
                            <td>{skill.skill_type}</td>
                            <td>{skill.proficiency_level}</td>
                            <td>{skill.start_date}</td>
                            <td>{skill.end_date || "--"}</td>
                            <td>{skill.last_evaluated ? new Date(skill.last_evaluated).toLocaleDateString() : "--"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <div className="text-muted">
                              <h5>No Skill data available</h5>
                              <p>Add Skills to see them here.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                      */}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
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
                          isSuccessOrError === "success" ? "success" : "danger"
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
      <AddSkill 
        show={addSkillModal} 
        handleClose={handleCloseAddSkill} 
        selectedSkill={selectedSkill}
        mode={skillModalMode}
        setMode={setSkillModalMode}
      />
    </div>
  );
};

export default AddMember;
