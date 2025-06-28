import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {Row, Col, Button, Tabs, Tab, ProgressBar, Container} from "react-bootstrap";
import Breadcrumb from "../../../components/Breadcrumb";
import {useAddClients, useUploadClientCSV} from "../../../query/clients/addClients/addClientsQuery";
import {
    useDownloadCSVFile,
    useGetClientById,
} from "../../../query/clients/allClients/allClientsQuery";
import {useUpdateClient} from "../../../query/clients/updateClient/updateClientQuery";
import {useGetCountries} from "../../../query/country/countriesQuery";
import {useGetTimeZone} from "../../../query/timeZone/timeZoneQuery";
import {authState} from "../../../recoil/authRecoil";
import {resetAddClientState} from "../../../recoil/resetFormRecoil";
import {toaster} from "../../../utilits/toast";
import {PhonePattern, requiredField, urlPattern} from "../../../utilits/validation";
import {Input} from "../../widgets/formComponents/Input";
import "./style.scss";

import {useRecoilValue, useSetRecoilState} from "recoil";
import {useGetAllDepartments} from "../../../query/department/allDepartments/allDepartmentsQuery";
import {Select} from "antd";
import {useForm} from "react-hook-form";
import {MdOutlineCancel} from "react-icons/md";

const {Option} = Select;

const AddClient = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [countryCode, setCountryCode] = useState("");
    const [image, setImage] = useState();
    const {data: departments, isLoading: isLoadingDepartments} = useGetAllDepartments();
    const setResetAddClientState = useSetRecoilState(resetAddClientState);
    const useResetAddClient = useRecoilValue(resetAddClientState);
    const authDetail = useRecoilValue(authState);
    const {data: downloadCsvFile, isLoading: isLoadingCsvFile} = useDownloadCSVFile();
    const {data: dataList, isLoading: isLoadingList} = useGetClientById(params.id);
    const {data: countryList, isLoading: isLoadingCountryList} = useGetCountries();
    const {data: timeZoneList, isLoading: isLoadingTimeZoneList} = useGetTimeZone(countryCode);
    const {register, handleSubmit, errors, reset, setValue, getValues, formState} = useForm({
        mode: "onTouched",
    });

    // client api
    const {
        data: addData,
        isLoading: isLoadingAddData,
        mutateAsync: addMutateAsync,
    } = useAddClients();
    const {
        data: updateData,
        isLoading: isLoadingUpdateData,
        mutateAsync: updateMutateAsync,
    } = useUpdateClient();

    useEffect(() => {
        reset(dataList);
        setImage(dataList?.logo);
        setCountryCode(dataList?.country?.split("-")[0]);
    }, [dataList]);

    useEffect(() => {
        if (!params.id) {
            reset({});
        }
    }, [params.id]);

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

    const handleOnSubmit = (clientData) => {
        let newclientData = {
            ...clientData,
            "logo": image,
        };
        let updateClientData = {
            ...clientData,
            "logo": image,
            "id": params.id,
        };
        if (params?.id) {
            updateMutateAsync(updateClientData);
        } else {
            addMutateAsync(newclientData);
        }

        // setCountryCode("")
        // setImage("")
        setResetAddClientState(false);
        // reset()
    };

    const handleCancelImage = (e) => {
        e.preventDefault();
        setImage("");
    };

    const getTimeZone = (e) => {
        setCountryCode(e.target.value.split("-")[0]);
    };

    useEffect(() => {
        if (useResetAddClient) {
            setCountryCode("");
            setImage("");
            reset({});
        }
    }, [useResetAddClient]);

    //////

    const [csvFileState, setCsvFileState] = useState();
    const [csvFileName, setCsvFileName] = useState("");
    const {mutateAsync: uploadClientCSVMutateAsync, isLoading: isLoadingUploadClientCSV} =
        useUploadClientCSV();

    const uploadCsvFile = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64File(file);
        setCsvFileState(file);
        setCsvFileName(file.name);
    };

    const convertBase64File = (file) => {
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

    const [uploadProgress, setUploadProgress] = useState(false); //true
    const [progressShow, setProgressShow] = useState(false); //true
    const [resMessage, setResMessage] = useState("");
    const [isSuccessOrError, setIsSuccessOrError] = useState("");

    const uploadClickHandler = async (data) => {
        setProgressShow(true);
        const val = {
            "file": csvFileState,
        };
        // const res = await uploadClientCSVMutateAsync(val,
        // (progress) => {
        //     setProgressss(progress);
        //   });
        // setResMessage(res);
        // setProgressss(100);
        // setMotionBreak(false)
        // setCsvFileName("");
        // reset();
        const res = await uploadClientCSVMutateAsync(val);
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
    };
    //////
    const downloadCSVClickHandler = () => {
        if (downloadCsvFile != undefined) {
            var mediaType = "data:text/csv;base64,";
            var userInp = downloadCsvFile && downloadCsvFile;
            var a = document.createElement("a");
            a.href = mediaType + userInp;
            a.download = "Client Csv format.csv";
            a.textContent = "Download file!";
            document.body.appendChild(a);
            a.click();
        }
    };
    return (
        <div className=" container client-POC">
            <Row className="mb-2">
                <Col xs={6}>
                    <Breadcrumb />
                </Col>
                <Col xs={6} className="clientButtonGroup"></Col>
            </Row>
            <div className="addclient mb-5">
                <Tabs id="controlled-tab-example" className="mb-3">
                    <Tab eventKey="CSV Upload" title="CSV Upload" className="container">
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
                            <Row className="mt-4 mb-2" style={{height: "50px"}}>
                                <Col>
                                    <h6>Progress....</h6>
                                    <ProgressBar
                                        striped
                                        variant="success"
                                        now={100}
                                        animated="true"
                                        style={{height: "7px"}}
                                    />
                                </Col>
                            </Row>
                        ) : (
                            uploadProgress && (
                                <Row className="mt-4 mb-2" style={{height: "50px"}}>
                                    <Col>
                                        <h6>{resMessage}</h6>
                                        <ProgressBar
                                            striped
                                            variant={
                                                isSuccessOrError === "success"
                                                    ? "success"
                                                    : "danger"
                                            }
                                            now={100}
                                            style={{height: "7px"}}
                                        />
                                    </Col>
                                </Row>
                            )
                        )}
                    </Tab>
                    <Tab eventKey="Manual upload" title="Manual upload" className="container">
                        <form onSubmit={handleSubmit(handleOnSubmit)}>
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
                                <Col sm={9}>
                                    <Container>
                                        <Row>
                                            <Col sm={6} className="mb-3">
                                                <label
                                                    className={`${
                                                        errors.name ? "text-danger" : ""
                                                    }`}
                                                >
                                                    Name *
                                                </label>
                                                <Input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Client Name*"
                                                    className="form-control"
                                                    reference={register({
                                                        required: requiredField(),
                                                    })}
                                                />
                                                {errors.name && (
                                                    <small className="form-text text-danger">
                                                        {errors.name.message}
                                                    </small>
                                                )}
                                            </Col>

                                            <Col sm={6} className="mb-3">
                                                <label>Web URL *</label>
                                                <Input
                                                    type="text"
                                                    name="web_url"
                                                    placeholder="Web url"
                                                    className="form-control"
                                                    reference={register({
                                                        pattern: urlPattern(),
                                                    })}
                                                />
                                                {errors.web_url && (
                                                    <small className="form-text text-danger">
                                                        {errors.web_url.message}
                                                    </small>
                                                )}
                                            </Col>

                                            <Col sm={6} className="mb-3">
                                                <label
                                                    className={`${
                                                        errors.address ? "text-danger" : ""
                                                    }`}
                                                >
                                                    Address *
                                                </label>
                                                <Input
                                                    type="text"
                                                    placeholder="Address"
                                                    name="address"
                                                    className="form-control"
                                                    reference={register({
                                                        required: requiredField(),
                                                    })}
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
                                                        errors.phone_number ? "text-danger" : ""
                                                    }`}
                                                >
                                                    Mobile number *
                                                </label>
                                                <Input
                                                    type="number"
                                                    placeholder="Mobile Number*"
                                                    name="phone_number"
                                                    className="form-control"
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
                                            <Col sm={6} className="mb-3">
                                                <label
                                                    className={`${
                                                        errors.country ? "text-danger" : ""
                                                    }`}
                                                >
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
                                                    <option value="">Select Country</option>
                                                    {countryList &&
                                                        countryList.map((option) => (
                                                            <option
                                                                key={option.id}
                                                                value={`${option.iso2}-${option.name}`}
                                                            >
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
                                            <Col sm={6} className="mb-3">
                                                <label
                                                    className={`${
                                                        errors.time_zone ? "text-danger" : ""
                                                    }`}
                                                >
                                                    Time Zone *
                                                </label>
                                                {isLoadingTimeZoneList ? (
                                                    <select
                                                        className="form-control"
                                                        disabled={
                                                            isLoadingTimeZoneList ? true : false
                                                        }
                                                    >
                                                        <option value="">Loading...</option>
                                                    </select>
                                                ) : (
                                                    <select
                                                        placeholder="time_zone"
                                                        className="form-control"
                                                        disabled={isLoadingTimeZoneList}
                                                        name="time_zone"
                                                        ref={register({
                                                            required: requiredField(),
                                                        })}
                                                    >
                                                        <option value="">Select Time zone</option>
                                                        {timeZoneList &&
                                                            timeZoneList.map((option, id) => (
                                                                <option key={id} value={option}>
                                                                    {option}
                                                                </option>
                                                            ))}
                                                    </select>
                                                )}
                                                {errors.time_zone && (
                                                    <small className="form-text text-danger">
                                                        {errors.time_zone.message}
                                                    </small>
                                                )}
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <label className={`${errors.owner ? "text-danger" : ""}`}>
                                        Owner *
                                    </label>
                                    <Input
                                        type="text"
                                        name="owner"
                                        placeholder="Owner Name*"
                                        className="form-control"
                                        reference={register({
                                            required: requiredField(),
                                        })}
                                    />
                                    {errors.owner && (
                                        <small className="form-text text-danger">
                                            {errors.owner.message}
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
                                        disabled={isLoadingDepartments}
                                        ref={register({required: requiredField()})}
                                    >
                                        <option value="">Select Department</option>
                                        {departments &&
                                            departments.map((option) => (
                                                <option
                                                    key={option.department_uuid}
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
                                <Col className="buttonSection" sm={12}>
                                    <Button
                                        variant="primary"
                                        disabled={!formState.isValid || isLoadingAddData}
                                        type="submit"
                                    >{`${
                                        isLoadingAddData
                                            ? params?.id
                                                ? "Updating..."
                                                : "Adding..."
                                            : params?.id
                                            ? "Update"
                                            : "Add"
                                    }`}</Button>
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
                </Tabs>
            </div>
        </div>
    );
};

export default AddClient;
