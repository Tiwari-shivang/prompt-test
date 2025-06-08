import React, {useEffect, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {MdOutlineCancel} from "react-icons/md";
import {useNavigate, useParams} from "react-router-dom";
import Breadcrumb from "../../../components/Breadcrumb";
import {useGetContactsById} from "../../../query/contacts/allContact/allContactQuery";
import {useUpdateContact} from "../../../query/contacts/updateContact/updateContactQuery";
import {useGetCountries} from "../../../query/country/countriesQuery";
import {useGetTimeZone} from "../../../query/timeZone/timeZoneQuery";
import {Input} from "../../widgets/formComponents/Input";
import {useForm} from "react-hook-form";
import {toaster} from "../../../utilits/toast";
import {emailPattern, PhonePattern, requiredField} from "../../../utilits/validation";
import "./style.scss";

const Index = () => {
    const params = useParams();
    const navigate = useNavigate();

    const {register, handleSubmit, errors, reset, formState} = useForm({
        mode: "onTouched",
    });

    // contact api
    const {data, isLoading, mutateAsync} = useUpdateContact();

    const {data: dataList, isLoading: isLoadingList} = useGetContactsById(params.id);
    const [countryCode, setCountryCode] = useState("");
    const [image, setImage] = useState();

    const {data: countryList, isLoading: isLoadingCountryList} = useGetCountries();
    const {
        data: timeZoneList,
        isLoading: isLoadingTimeZoneList,
        refetch,
    } = useGetTimeZone(countryCode);

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

    useEffect(() => {
        reset(dataList);
        setImage(dataList?.profile_picture);
        setCountryCode(dataList?.country?.split("-")[0]);
    }, [dataList]);

    const getTimeZone = (e) => {
        setCountryCode(e.target.value.split("-")[0]);
    };

    const handleOnSubmit = (data) => {
        const newContactData = {
            ...data,
            id: params?.id,
            client_id: dataList.client_id,
            is_primary: true,
            profile_picture: image,
        };
        mutateAsync(newContactData);
    };

    const handleCancelImage = (e) => {
        e.preventDefault();
        setImage("");
    };
    if (isLoadingCountryList) {
        return <p>loading...</p>;
    }
    return (
        <div className="client-POC">
            <Row className="mb-2">
                <Col xs={6}>
                    <Breadcrumb />
                </Col>
            </Row>

            {/* control section  */}
            <div className="addclient">
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
                            <Row>
                                <Col sm={6} className="mb-3">
                                    <label className={`${errors.name ? "text-danger" : ""}`}>
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        className="form-control"
                                        name={`name`}
                                        ref={register({
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
                                    <label className={`${errors.email ? "text-danger" : ""}`}>
                                        Email *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Email"
                                        className="form-control"
                                        name={`email`}
                                        ref={register({
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
                                <Col sm={6} className="mb-3">
                                    <label className={`${errors.designation ? "text-danger" : ""}`}>
                                        Designation *
                                    </label>
                                    <select
                                        className="form-control"
                                        name={`designation`}
                                        ref={register({
                                            required: requiredField(),
                                        })}
                                    >
                                        <option value="">Select Designation</option>
                                        <option value="CTO">CTO</option>
                                        <option value="CFO">CFO</option>
                                        <option value="CEO">CEO</option>
                                    </select>
                                    {errors.designation && (
                                        <small className="form-text text-danger">
                                            {errors.designation.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <label
                                        className={`${errors.phone_number ? "text-danger" : ""}`}
                                    >
                                        Mobile Number *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Mobile Number"
                                        className="form-control"
                                        name={`phone_number`}
                                        ref={register({
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
                                    <label className={`${errors.country ? "text-danger" : ""}`}>
                                        Country *
                                    </label>
                                    <select
                                        placeholder="Select Country"
                                        className="form-control"
                                        name="country"
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
                                    <label className={`${errors.time_zone ? "text-danger" : ""}`}>
                                        Time Zone *
                                    </label>
                                    {isLoadingTimeZoneList ? (
                                        <select
                                            className="form-control"
                                            disabled={isLoadingTimeZoneList ? true : false}
                                        >
                                            <option value="">Select Time zone</option>
                                        </select>
                                    ) : (
                                        <select
                                            placeholder="time_zone"
                                            className="form-control"
                                            disabled={countryCode ? false : true}
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
                        </Col>
                    </Row>
                    <Row className="my-2">
                        <Col sm={12}>
                            <Button disabled={!formState.isValid} variant="primary" type="submit">
                                Update Contact
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

export default Index;
