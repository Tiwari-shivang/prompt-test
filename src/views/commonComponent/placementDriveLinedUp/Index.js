import Moment from "moment";
import React, {useEffect, useState} from "react";
import {Button, Col, Modal, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {useForm} from "react-hook-form";
import {useLocation} from "react-router-dom";
import {useGetAllDepartments} from "../../../query/department/allDepartments/allDepartmentsQuery";
import {useGetAllDesignation} from "../../../query/designation/allDesignation/allDesignationQuery";
import {useGetAllLocations} from "../../../query/location/allLocation/allLocationQuery";
import {useGetAllMembers} from "../../../query/members/allMembers/allMembersQuery";
import {
    useAddPlacementDrive,
    useGetAllPlacementDrive,
} from "../../../query/placementDrive/placementDriveQuery";
import {toaster} from "../../../utilits/toast";
import {requiredField} from "../../../utilits/validation";
import {Input} from "../../widgets/formComponents/Input";
import Loader from "../../widgets/loader/Loader";
import "./style.scss";
const Index = () => {
    const [showPlacementDriveModal, setShowPlacementDriveModal] = useState(false);
    const {data: dataAllPlacementDrive, isLoading: isDataAllPlacementDriveLoading} =
        useGetAllPlacementDrive();
    // const location = useLocation();
    const editClickHandler = () => {};
    const deleteClickHandler = () => {};
    const columns = [
        {
            dataField: "organizerName",
            text: "Organizer",
            formatter: (cellContent, row) => (
                <div className="organiserCol">
                    {/* <div className='organiserPic'>
						<img src={row.profile_picture} alt="" />
					</div> */}
                    <div className="organiserName">{row.organizerName}</div>
                </div>
            ),
        },
        {
            dataField: "positionName",
            text: "Position",

            formatter: (cellContent, row) => (
                <div className="positionCol">
                    <OverlayTrigger
                        placement="bottom"
                        delay={{show: 250, hide: 250}}
                        overlay={<Tooltip id="button-tooltip">{row?.positionName}</Tooltip>}
                    >
                        <div className="positionText">{row?.positionName}</div>
                    </OverlayTrigger>
                </div>
            ),
        },
        {
            dataField: "place",
            text: "place",
            headerStyle: {
                textAlign: "center",
            },
            formatter: (cellContent, row) => (
                <div className="positionCol">
                    <div className="positionText">{row.place === "1" ? "Noida" : "Pune"}</div>
                </div>
            ),
        },
        {
            dataField: "drive_date",
            text: "Drive Date",
        },
        // {
        // 	dataField: '',
        // 	text: 'Action',
        // 	headerStyle: {
        // 		textAlign: "center"
        // 	},
        // 	formatter: (cellContent, row) => (
        // 		<div className="actionCol">
        // 			<BiEdit className='editIcon' onClick={() => editClickHandler()} />
        // 			<BsTrash className='deleteIcon' onClick={() => deleteClickHandler()} />
        // 		</div>
        // 	),
        // },
    ];
    return (
        <>
            <div className="detailsPlacementDriveLinedUp cardShadow">
                <div className="titleSection">
                    <div className="cardCustomTitle">Placement drive lined up</div>
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setShowPlacementDriveModal(true)}
                    >
                        Add
                    </Button>
                </div>
                {isDataAllPlacementDriveLoading ? (
                    <Loader />
                ) : dataAllPlacementDrive && dataAllPlacementDrive.length === 0 ? (
                    <div className="emptyListTextPlacement">No placement drives found.</div>
                ) : (
                    <BootstrapTable
                        keyField="id"
                        data={dataAllPlacementDrive ? dataAllPlacementDrive : []}
                        columns={columns}
                        condensed
                    />
                )}
            </div>
            {showPlacementDriveModal && (
                <PlacementDriveAddEditModal
                    modalOpen={showPlacementDriveModal}
                    modalClose={() => setShowPlacementDriveModal(false)}
                />
            )}
        </>
    );
};

export const PlacementDriveAddEditModal = (props) => {
    const {modalOpen, modalClose, formData} = props;
    const {data: allDepartment} = useGetAllDepartments();
    const {data: Locations} = useGetAllLocations();
    const {data: designations, isLoading: isDesignationsLoading} = useGetAllDesignation();
    const hrDepatmentId =
        allDepartment &&
        allDepartment.find((dept) => dept.department_name === "Human Resources").id;
    const {data: allHrMembers} = useGetAllMembers({departmentName: hrDepatmentId});
    const {mutateAsync: addPlacementDriveMutateAsync, isLoading: isLoadingAddPlacementDrive} =
        useAddPlacementDrive();
    const [todayDate, setTodayDate] = useState();
    const {register, handleSubmit, getValues, reset, errors, formState} = useForm({
        mode: "onTouched",
    });
    const [image, setImage] = useState("");

    const addPlacementDriveHandler = (data) => {
        addPlacementDriveMutateAsync(data);
        modalClose();
    };

    useEffect(() => {
        const year = new Date() - 1;
        setTodayDate(year);
    }, []);

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

    const handleCancelImage = (e) => {
        e.preventDefault();
        setImage("");
    };

    return (
        <Modal
            className="commonModal cardShadow addModal"
            show={modalOpen}
            onHide={modalClose}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Add Placement Drive</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(addPlacementDriveHandler)}>
                    <Row className="my-3">
                        {/* 
								<Col sm={12} md={4}>
									<Row>
										<Col sm={12} className="mb-3">
											<label htmlFor="fileTag" className='label'>
												<div className='customImg'>
													<button onClick={(e) => handleCancelImage(e)}><MdOutlineCancel className='crossIcon' /></button>
													{
														image ? <img src={image} /> : <div><AiOutlineCloudUpload className='icons' /> <p>Profile Picture</p></div>
													}
												</div>
												<Input
													type="File"
													onChangeHandler={uploadImage}
													id="fileTag"
													className="form-control customStyle"
													reference={register({})} />
												{errors.file && (<small className="form-text text-danger">{errors.file.message}</small>)}
											</label>
										</Col>
									</Row>
								</Col> 
							*/}
                        <Col sm={12} /*md={8}*/>
                            <Row>
                                <Col sm={12} className="mb-3">
                                    <label className={`${errors.positionId ? "text-danger" : ""}`}>
                                        Designation *
                                    </label>
                                    <select
                                        placeholder="Designation *"
                                        className="form-control"
                                        disabled={isDesignationsLoading}
                                        name="positionId"
                                        ref={register({required: requiredField()})}
                                    >
                                        <option value="">Select Designation</option>
                                        {designations &&
                                            designations.map((option) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.designation_name}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.positionId && (
                                        <small className="form-text text-danger">
                                            {errors.positionId.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={12}>
                                    <label
                                        className={`${errors.organizerUuid ? "text-danger" : ""}`}
                                    >
                                        Organizer *
                                    </label>
                                    <select
                                        placeholder="Name *"
                                        className="form-control"
                                        // disabled={}
                                        name="organizerUuid"
                                        ref={register({required: requiredField()})}
                                    >
                                        <option key="0" value="">
                                            Select Organizer
                                        </option>
                                        {allHrMembers &&
                                            allHrMembers.employees &&
                                            allHrMembers.employees.map((option, index) => (
                                                <option key={index} value={option.uuid}>
                                                    {option.first_name ??
                                                        "" + option.last_name ??
                                                        ""}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.organizerUuid && (
                                        <small className="form-text text-danger">
                                            {errors.organizerUuid.message}
                                        </small>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={12} md={6}>
                            <label className={`${errors.place ? "text-danger" : ""}`}>
                                Place *
                            </label>
                            <select
                                placeholder="Place*"
                                className="form-control"
                                name="place"
                                ref={register({required: requiredField()})}
                            >
                                <option value="">Select Place</option>
                                {Locations &&
                                    Locations.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.location_name}
                                        </option>
                                    ))}
                            </select>
                            {errors.place && (
                                <small className="form-text text-danger">
                                    {errors.place.message}
                                </small>
                            )}
                        </Col>
                        <Col sm={12} md={6}>
                            <label className={`${errors.driveDate ? "text-danger" : ""}`}>
                                Drive Date *
                            </label>
                            <Input
                                type="date"
                                placeholder="Drive Date"
                                className="form-control"
                                max="9999-12-31"
                                name="driveDate"
                                min={Moment(todayDate).format("YYYY-MM-DD")}
                                reference={register({required: requiredField()})}
                            />
                            {errors.driveDate && (
                                <small className="form-text text-danger">
                                    {errors.driveDate.message}
                                </small>
                            )}
                        </Col>
                    </Row>
                    <Row className="mt-4 mb-2">
                        <Col sm={12} className="buttonSection">
                            <Button
                                disabled={!formState.isValid || isLoadingAddPlacementDrive}
                                variant="primary"
                                type="submit"
                            >
                                {isLoadingAddPlacementDrive ? "Adding..." : "Add"}
                            </Button>
                            <Button variant="outline-danger" onClick={modalClose}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default Index;
