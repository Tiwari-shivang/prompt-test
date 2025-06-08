import {EditorState} from "draft-js";
import React, {useEffect, useState} from "react";
import {Button, Col, Row, Tab, Tabs, ProgressBar} from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {useForm} from "react-hook-form";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {useNavigate, useParams} from "react-router-dom";
import {useRecoilValue, useSetRecoilState} from "recoil";
import Breadcrumb from "../../../components/Breadcrumb";
import {useGetAllClients} from "../../../query/clients/allClients/allClientsQuery";
import {useGetAllDepartments} from "../../../query/department/allDepartments/allDepartmentsQuery";
import {useGetAllRms} from "../../../query/members/allMembers/allMembersQuery";
import {
    useCreateProject,
    useCreateProjectFromCSV,
} from "../../../query/projects/addProjects/addProjectsQuery";
import {
    useGetProjectById,
    useProjectDownloadCSVFile,
} from "../../../query/projects/allProjects/allProjectsQuery";
import {useUpdateProject} from "../../../query/projects/updateProjects/updateProjectsQuery";
import {resetAddProjectState} from "../../../recoil/resetFormRecoil";
import {requiredField} from "../../../utilits/validation";
import {Input} from "../../widgets/formComponents/Input";
import "./style.scss";
import {toaster} from "../../../utilits/toast";

const AddProject = () => {
    const params = useParams();
    const navigate = useNavigate();
    const setResetAddProjectState = useSetRecoilState(resetAddProjectState);
    const useResetAddProject = useRecoilValue(resetAddProjectState);
    const {data: Departments, isLoading: isLoadingDepartments} = useGetAllDepartments();
    const {data: projectData, isLoadingProject} = useGetProjectById(params.id);
    const {data: downloadCsvFile, isLoading: isLoadingCsvFile} = useProjectDownloadCSVFile();
    const {
        register,
        handleSubmit,
        errors,
        watch,
        formState,
        clearErrors,
        reset,
        setValue,
        getValues,
    } = useForm();
    const {data: dataAllClient, isLoading: isLoadingAllClient} = useGetAllClients();
    const {data: dataAllRm, isLoading: isLoadingAllRm} = useGetAllRms();
    const {mutateAsync: addProjectMutateAsync} = useCreateProject();
    const {mutateAsync: updateProjectMutateAsync} = useUpdateProject();

    const projectFromWatch = watch("project_start_date");
    const projectToWatch = watch("project_end_date");

    const [editorState, setEditorState] = useState("");

    const onProjectEditor = (value) => {
        setEditorState(value);
    };

    const handleOnSubmitProject = (projectData) => {
        if (projectData.pm_uuid == projectData.snr_pm_uuid) {
            toaster("error", "PM and SPM cannot be the same person.");
            return;
        }
        if (projectData.pm_allocation)
            projectData.pm_allocation = parseInt(projectData.pm_allocation);
        if (projectData.pm_billable) projectData.pm_billable = parseInt(projectData.pm_billable);
        let projectDescription = editorState.getCurrentContent().getPlainText();
        let addProjectData = {
            ...projectData,
            "department_id": projectData.department_uuid,
            "priority": "High",
        };
        let updateProjectData = {
            ...addProjectData,
            "uuid": params.id,
            "priority": "High",
        };
        if (params?.id) {
            updateProjectMutateAsync(updateProjectData);
        } else {
            addProjectMutateAsync(addProjectData);
        }
        setResetAddProjectState(false);
    };

    useEffect(() => {
        if (useResetAddProject) {
            reset({});
        }
    }, [useResetAddProject]);

    useEffect(() => {
        reset({
            ...projectData,
            "pm_allocation": projectData?.allocation || undefined,
            "pm_billable": projectData?.billable || undefined,
        });
    }, [projectData]);

    useEffect(() => {
        if (!params.id) {
            reset({});
        }
    }, [params.id]);

    // useEffect(() => {
    //   const TextEdit = document.getElementById('text-edit')
    //   if (TextEdit) {
    //     TextEdit.addEventListener('input', function (e) {
    //       this.style.height = 'inherit';
    //       var scrlHeight = this.scrollHeight
    //       this.style.height = scrlHeight + 'px'
    //     })
    //   }
    // },[getValues("description")]);

    useEffect(() => {
        setEditorState(EditorState.createEmpty());
    }, []);

    // if (isLoadingProject) {
    //     return <p>loader..</p>;
    // }
    // if (isLoadingAllRm) {
    //     return <p>loading---</p>;
    // }

    ////////////////////

    const [csvFileState, setCsvFileState] = useState();
    const [csvFileName, setCsvFileName] = useState("");
    const {mutateAsync: createProjectFromCSVMutateAsync} = useCreateProjectFromCSV();

    const uploadCsvFile = async (e) => {
        const file = e.target.files[0];
        // const base64 = await convertBase64File(file);
        setCsvFileState(file);
        setCsvFileName(file.name);
    };

    // const convertBase64File = (file) => {
    //     return new Promise((resolve, reject) => {
    //         const fileReader = new FileReader();
    //         fileReader.readAsDataURL(file);
    //         fileReader.onload = () => {
    //             resolve(fileReader.result);
    //         };

    //         fileReader.onerror = (error) => {
    //             reject(error);
    //         };
    //     });
    // };
    const [uploadProgress, setUploadProgress] = useState(false); //true
    const [progressShow, setProgressShow] = useState(false); //true
    const [resMessage, setResMessage] = useState("");
    const [isSuccessOrError, setIsSuccessOrError] = useState("");
    const uploadClickHandler = async () => {
        setProgressShow(true);
        const val = {
            file: csvFileState,
        };
        // console.log(val);
        // createProjectFromCSVMutateAsync(val);
        const res = await createProjectFromCSVMutateAsync(val);
        setResMessage(res);
        setProgressShow(false);
        setUploadProgress(true);
        setIsSuccessOrError(res === "File Imported Successfully" ? "success" : "error");
        setTimeout(() => {
            setProgressShow(false);
            setUploadProgress(false);
            setIsSuccessOrError("");
        }, 3000);
        setCsvFileName("");
        // reset();
    };
    const downloadCSVClickHandler = () => {
        if (downloadCsvFile != undefined) {
            var mediaType = "data:text/csv;base64,";
            var userInp = downloadCsvFile && downloadCsvFile;
            var a = document.createElement("a");
            a.href = mediaType + userInp;
            a.download = "Project Csv format.csv";
            a.textContent = "Download file!";
            document.body.appendChild(a);
            a.click();
        }
    };
    ////////////////////////////

    return (
        <>
            <Row className="mb-2">
                <Col xs={6}>
                    <Breadcrumb />
                </Col>
                <Col xs={6} className=""></Col>
            </Row>
            <div className="addProject">
                <Tabs id="controlled-tab-example" className="mb-3">
                    <Tab eventKey="Manual upload" title="Manual upload">
                        <form onSubmit={handleSubmit(handleOnSubmitProject)}>
                            <Row>
                                <Col sm={6} className="mb-3">
                                    <label
                                        className={`${errors.project_name ? "text-danger" : ""}`}
                                    >
                                        Project Name *
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Project Name"
                                        className="form-control"
                                        name="project_name"
                                        reference={register({
                                            required: requiredField(),
                                        })}
                                    />
                                    {errors.project_name && (
                                        <small className="form-text text-danger">
                                            {errors.project_name.message}
                                        </small>
                                    )}
                                </Col>

                                <Col sm={6} className="mb-3">
                                    <label className={`${errors.client_id ? "text-danger" : ""}`}>
                                        Client Name *
                                    </label>
                                    <select
                                        className="form-control customScroll"
                                        name="client_uuid"
                                        ref={register({
                                            required: requiredField(),
                                        })}
                                    >
                                        <option key="000" value="">
                                            Select Client
                                        </option>
                                        {dataAllClient &&
                                            dataAllClient?.clients?.map((option, index) => (
                                                <option
                                                    key={`${index+1}`}
                                                    value={option.client_id}
                                                >
                                                    {option.name}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.client_id && (
                                        <small className="form-text text-danger">
                                            {errors.client_id.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <label className={`${errors.pm_uuid ? "text-danger" : ""}`}>
                                        Project Manager *
                                    </label>
                                    <select
                                        className="form-control customScroll"
                                        name="pm_uuid"
                                        ref={register({
                                            required: requiredField(),
                                        })}
                                    >
                                        <option key="0" value="">
                                            Select PM
                                        </option>
                                        {dataAllRm &&
                                            dataAllRm.map((option, index) => (
                                                <option key={`${index+1}`} value={option.uuid}>
                                                    {option.first_name} {option.last_name}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.pm_uuid && (
                                        <small className="form-text text-danger">
                                            {errors.pm_uuid.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <label className={`${errors.pm_uuid ? "text-danger" : ""}`}>
                                        Senior Project Manager *
                                    </label>
                                    <select
                                        className="form-control customScroll"
                                        name="snr_pm_uuid"
                                        ref={register({
                                            required: requiredField(),
                                        })}
                                    >
                                        <option key="0" value="">
                                            Select PM
                                        </option>
                                        {dataAllRm &&
                                            dataAllRm.map((option, index) => (
                                                <option key={`${index+1}`} value={option.uuid}>
                                                    {option.first_name} {option.last_name}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.pm_uuid && (
                                        <small className="form-text text-danger">
                                            {errors.pm_uuid.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <label
                                        className={`${errors.project_status ? "text-danger" : ""}`}
                                    >
                                        Project status *
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Project Status"
                                        className="form-control"
                                        name="project_status"
                                        reference={register({
                                            required: requiredField(),
                                        })}
                                    />
                                    {errors.project_status && (
                                        <small className="form-text text-danger">
                                            {errors.project_status.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <label className={`${errors.tech_stack ? "text-danger" : ""}`}>
                                        Tech Stack *
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Tech Stack"
                                        className="form-control"
                                        name="tech_stack"
                                        reference={register({
                                            required: requiredField(),
                                        })}
                                    />
                                    {errors.tech_stack && (
                                        <small className="form-text text-danger">
                                            {errors.tech_stack.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <label className={`${errors.allocation ? "text-danger" : ""}`}>
                                        PM Allocation *
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="PM Allocation"
                                        className="form-control"
                                        name="pm_allocation"
                                        min="0"
                                        //max="100"
                                        reference={register({
                                            // required : requiredField(),
                                        })}
                                    />
                                    {errors.pm_allocation && (
                                        <small className="form-text text-danger">
                                            {errors.pm_allocation.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <label className={`${errors.pm_billable ? "text-danger" : ""}`}>
                                        Billable *
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="Billable"
                                        className="form-control"
                                        name="pm_billable"
                                        min="0"
                                        max="100"
                                        reference={register({
                                            // required : requiredField(),
                                        })}
                                    />
                                    {errors.pm_billable && (
                                        <small className="form-text text-danger">
                                            {errors.pm_billable.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <label
                                        className={`${
                                            errors.project_start_date ? "text-danger" : ""
                                        }`}
                                    >
                                        Start Date *
                                    </label>
                                    <Input
                                        type="date"
                                        className="form-control"
                                        min="2010-01-01"
                                        max="2050-01-02"
                                        name="project_start_date"
                                        reference={register({
                                            required: isNaN(projectFromWatch)
                                                ? false
                                                : "Value required",
                                            validate: {
                                                lessThan: (v) => {
                                                    if (!params.id) return true;
                                                    if (v === "" && isNaN(projectToWatch))
                                                        return true;
                                                    if (projectToWatch > Date(v)) {
                                                        clearErrors("project_end_date");
                                                    }
                                                    return isNaN(projectToWatch)
                                                        ? projectToWatch > v ||
                                                              `Should be less than ${
                                                                  isNaN(projectToWatch)
                                                                      ? "end date"
                                                                      : projectToWatch
                                                              }`
                                                        : true;
                                                },
                                            },
                                        })}
                                    />
                                    {errors.project_start_date && (
                                        <small className="form-text text-danger">
                                            {errors.project_start_date.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={6} className="mb-3" hidden={!params.id}>
                                    <label
                                        className={`${
                                            errors.project_end_date ? "text-danger" : ""
                                        }`}
                                    >
                                        End Date
                                    </label>
                                    <Input
                                        type="date"
                                        min="2010-01-01"
                                        max="2050-01-02"
                                        className="form-control"
                                        name="project_end_date"
                                        reference={register({
                                            // required: params.id
                                            //     ? isNaN(projectToWatch) && isNaN(projectFromWatch)
                                            //         ? false
                                            //         : "Value required"
                                            //     : false,
                                            validate: {
                                                greaterThan: (v) => {
                                                    if (v === "" && isNaN(projectFromWatch))
                                                        return true;
                                                    if (projectFromWatch < Date(v)) {
                                                        clearErrors("project_start_date");
                                                    }
                                                    return (
                                                        projectFromWatch < Date(v) ||
                                                        `Should be greater than ${
                                                            isNaN(projectFromWatch)
                                                                ? "start date"
                                                                : projectFromWatch
                                                        }`
                                                    );
                                                },
                                            },
                                        })}
                                    />
                                    {errors.project_end_date && (
                                        <small className="form-text text-danger">
                                            {errors.project_end_date.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <label className={`${errors.is_client ? "text-danger" : ""}`}>
                                        Project Type *
                                    </label>
                                    <select
                                        placeholder="Role"
                                        className="form-control"
                                        name="is_client"
                                        ref={register({required: requiredField()})}
                                    >
                                        <option key="1" value="">
                                            Select Project Type
                                        </option>
                                        <option key="2" value="true">
                                            Client Side
                                        </option>
                                        <option key="3" value="false">
                                            Internal
                                        </option>
                                    </select>
                                    {errors.is_client && (
                                        <small className="form-text text-danger">
                                            {errors.is_client.message}
                                        </small>
                                    )}
                                </Col>

                                <Col sm={6} className="mb-3">
                                    <label
                                        className={`${errors.payment_status ? "text-danger" : ""}`}
                                    >
                                        Payment Status *
                                    </label>
                                    <select
                                        className="form-control customScroll"
                                        name="payment_status"
                                        ref={register({
                                            required: requiredField(),
                                        })}
                                    >
                                        <option key="1" value="">
                                            Select Payment Status
                                        </option>
                                        <option key="2" value="Pending">
                                            Pending
                                        </option>
                                        <option key="3" value="Completed">
                                            Completed
                                        </option>
                                    </select>
                                    {errors.payment_status && (
                                        <small className="form-text text-danger">
                                            {errors.payment_status.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <label
                                        className={`${errors.department_uuid ? "text-danger" : ""}`}
                                    >
                                        Department *
                                    </label>
                                    <select
                                        placeholder="Department*"
                                        className="form-control customScroll"
                                        name="department_uuid"
                                        ref={register({required: requiredField()})}
                                    >
                                        <option key="abc" value="">
                                            Select Department
                                        </option>
                                        {Departments &&
                                            Departments.map((option, index) => (
                                                <option key={`${index + 1}`} value={option.id}>
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
                                <Col sm={12}>
                                    <label>Description</label>
                                    <textarea
                                        placeholder="Description"
                                        className="form-control"
                                        name="description"
                                        id="text-edit"
                                        defaultValue={projectData?.description}
                                        ref={register({})}
                                    ></textarea>
                                </Col>
                            </Row>
                            <Row className="mt-4 mb-2">
                                <Col sm={12} className="buttonSection">
                                    <Button variant="primary" type="submit">
                                        {params.id ? "Update" : "Add"} Project
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
                    <Tab eventKey="CSV Upload" title="CSV Upload">
                        <label className="labelAdmin">
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
                                name="issue_file"
                                id="issueFile"
                                accept=".csv"
                                reference={register({})}
                            />
                        </label>
                        <Row className="mt-4 mb-2">
                            <Col sm={6}>
                                <Button
                                    disabled={csvFileName === "" ? true : false}
                                    onClick={uploadClickHandler}
                                >
                                    Start Importing
                                </Button>
                            </Col>
                            <Col sm={6} className="downloadCsvContainer">
                                <Button className="downloadCsv" onClick={downloadCSVClickHandler}>
                                    Download CSV
                                </Button>
                            </Col>
                        </Row>
                        {progressShow === true ? (
                            <div className="progressBarCss">
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
                                <div className="progressBarCss">
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
        </>
    );
};

export default AddProject;
