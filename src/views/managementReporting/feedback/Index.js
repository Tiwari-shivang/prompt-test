import "antd/dist/antd.css";
import React, {useEffect} from "react";
import {Button, Col, Container, Modal, Row} from "react-bootstrap";
import {authState} from "../../../recoil/authRecoil";

import {Popconfirm, Rate} from "antd";
import {useState} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {useForm} from "react-hook-form";
import {FaEdit, FaStar} from "react-icons/fa";
import {useLocation, useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {useGetMembersById} from "../../../query/members/allMembers/allMembersQuery";
import {
    useCreateEmpRating,
    useUpdateEmpRating,
} from "../../../query/ratings/addRatings/addRatingsQuery";
import {useGetEmployeeRatingByEmpUuid} from "../../../query/ratings/getRatings/getRatingsQuery";
import {requiredField} from "../../../utilits/validation";
import {Input} from "../../widgets/formComponents/Input";
import "./style.scss";
import Loader from "../../widgets/loader/Loader";
import {toaster} from "../../../utilits/toast";
import {TextWithViewMore} from "../../modals/viewMore/Index";

const FeedbackModule = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {empUuid} = location.state;
    // const {data: empData} = useGetMembersById(empUuid || "");
    const empDetails = useRecoilValue(authState);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [modalData, setModalData] = useState({});

    const {data: allFeedbacks, isLoading: isLoadingAllFeedbacks} =
        useGetEmployeeRatingByEmpUuid(empUuid);

    useEffect(() => {
        if (empUuid == null || empUuid == undefined) navigate("/exportUtilizationData");
    }, []);
    const editClickHandler = (data) => {
        setModalData(data);
        setFeedbackModalOpen(true);
    };
    const addClickHandler = () => {
        setModalData({});
        setFeedbackModalOpen(true);
    };

    const feedbackColumns = [
        {
            dataField:'dummy1',
            text: "S.No.",
            headerStyle: (colum, colIndex) => {
                return {width:'3%'};
            },
            formatter: (cellContent, row, index) => index + 1,
        },
        {
            dataField: "description",
            text: "Internal Feedback",
            headerStyle: (colum, colIndex) => {
                return {textAlign: "left", width: "30%"};
            },
            align: "left",
            formatter: (cellContent, row, index) => (
                <TextWithViewMore text={cellContent} title={"Internal Feedback"} showLength={100} />
            ),
        },
        {
            dataField: "client_description",
            text: "Customer Feedback",
            headerStyle: (colum, colIndex) => {
                return {textAlign: "left", width: "30%"};
            },
            align: "left",
            formatter: (cellContent, row, index) => (
                <TextWithViewMore text={cellContent} title={"Customer Feedback"} />
            ),
        },
        {
            dataField: "rating",
            text: "Rating",
            sort: true,
            formatter: (cellContent) => (
                <>
                    <span className="mt-3">{cellContent}</span>
                    <FaStar className="icon starIcon ms-1 " />
                </>
            ),
        },
        {
            dataField: "providedby_name",
            text: "Provided by",
            formatter: (cellContent) => cellContent || "N/A",
        },
        {
            dataField:'dummy2',
            text: "Edit",
            headerStyle: (colum, colIndex) => {
                return {width:'5%'};
            },
            formatter: (cellContent, row) => (
                <>
                    {empDetails?.uuid == row?.providedby_uuid ? (
                        <FaEdit
                            onClick={() => editClickHandler(row)}
                            className="icon editIcon ms-1 "
                        />
                    ) : (
                        ""
                    )}
                </>
            ),
        },
    ];

    return (
        <Container>
            <Row className="feedbackModule">
                <Col sm={8} className="d-flex">
                    <div className="headerRow cardCustomTitle">All Feedbacks</div>
                </Col>
                <Col sm={4} className="d-flex justify-content-end">
                    <Button
                        size="sm"
                        className="btn btn-primary submitBtn my-1"
                        onClick={addClickHandler}
                    >
                        Add Feedback
                    </Button>
                </Col>
                <Col sm={12}>
                    <BootstrapTable
                        keyField="id"
                        wrapperClasses="table-center-align"
                        data={allFeedbacks || []}
                        columns={feedbackColumns}
                        noDataIndication={() =>
                            isLoadingAllFeedbacks ? (
                                <Loader />
                            ) : !allFeedbacks || !allFeedbacks.length ? (
                                <span>No Feedbacks Found.</span>
                            ) : (
                                ""
                            )
                        }
                        condensed
                        bordered={false}
                    />
                </Col>
				<AddFeedbackModal
					showModal={feedbackModalOpen}
					closeModal={() => setFeedbackModalOpen(false)}
					empUuid={empUuid}
					modalData={modalData}
				/>
            </Row>
        </Container>
    );
};

export const AddFeedbackModal = ({showModal, closeModal, empUuid, modalData}) => {
    const {register, handleSubmit, reset, setError, clearErrors, watch, errors, formState} =
        useForm({
            mode: "onTouched",
        });

    const {mutateAsync: createFeedbackMutateAsync} =
        useCreateEmpRating();
    const {mutateAsync: updateFeedbackMutateAsync} =
        useUpdateEmpRating();
    const [rating, setRating] = useState(0);
    const [ratingError, setRatingError] = useState(false);
    const empDetail = useRecoilValue(authState);
    useEffect(() => {
        reset(modalData);
        setRating(modalData.rating || 0);
    }, [modalData]);

    const onSubmit = (data) => {
        if (rating === 0) {
            setRatingError(true);
            return;
        } else {
            setRatingError(false);
        }
        if (data.description == "" && data.client_description == "") {
            toaster("error", "Please fill out either Internal feedback or Client feedback.");
            return;
        }
        const val = [
            {
                "emp_uuid": empUuid,
                "providedby_uuid": empDetail?.uuid || "",
                "rating": rating,
                "rating_date": new Date().toISOString().slice(0, 10),
                "description": data?.description || "",
                "client_description": data?.client_description,
            },
        ];
        modalData && Object.keys(modalData).length
            ? updateFeedbackMutateAsync({...val[0], id: modalData?.id || undefined})
            : createFeedbackMutateAsync(val);
        closeModal();
        reset({});
        setRatingError(false);
    };
    const ratingChangeHandler = (rating) => {
        // if (rating == 0) return;
        setRating(rating);
        if (rating) setRatingError(false);
        else setRatingError(true);
    };
    const handleOnCancel = () => {
        setRating(setRating(modalData.rating || 0));
        closeModal();
        setRatingError(false);
    };
    return (
        <Modal
            className="commonModal addFeedbackModal"
            show={showModal}
            onHide={handleOnCancel}
            centered
        >
            <Modal.Header>
                <Modal.Title className="cardCustomTitle">
                    {modalData && Object.keys(modalData).length ? "Update" : "Add"} Feedback
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modalFeedbackAdd container">
                {/* <p>{JSON.stringify(errors)}</p>
                <p>raging:{JSON.stringify(rating)}</p> */}
                <form className="formTodo" onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col sm={12} className="mb-3">
                            <label>Internal Feedback*</label>
                            <textarea
                                type="text"
                                className="form-control customScroll"
                                name="description"
                                ref={register({
                                    // required: requiredField(),
                                    validate: {
                                        greaterThan: (v) => {
                                            if (v && v.trim().length < 30) {
                                                return "Min. length is 30";
                                            } else return true;
                                        },
                                        lesserThan: (v) => {
                                            if (v && v.trim().length > 500) {
                                                return "Max. length is 500";
                                            } else return true;
                                        },
                                    },
                                })}
                            />
                            {errors.description && (
                                <small className="form-text text-danger">
                                    {errors.description.message}
                                </small>
                            )}
                        </Col>
                        <Col sm={12} className="mb-3">
                            <label>Customer Feedback*</label>
                            <textarea
                                type="text"
                                className="form-control customScroll"
                                name="client_description"
                                ref={register({
                                    validate: {
                                        greaterThan: (v) => {
                                            if (v && v.trim().length < 30) {
                                                return "Min length is 30";
                                            } else return true;
                                        },
                                        lesserThan: (v) => {
                                            if (v && v.trim().length > 500) {
                                                return "Max. length is 500";
                                            } else return true;
                                        },
                                    },
                                })}
                            />
                            {errors.client_description && (
                                <small className="form-text text-danger">
                                    {errors.client_description.message}
                                </small>
                            )}
                            {errors.neitherItemlist && (
                                <small className="text-danger">
                                    {errors.neitherItemlist.message}
                                </small>
                            )}
                        </Col>
                        <Col sm={12} className="mb-2">
                            <label className="pt-2 pe-2">Rating*</label>
                            <Rate
                                className="stars"
                                name="rating"
                                defaultValue={(modalData && modalData.rating) || 0}
                                
                                onChange={ratingChangeHandler}
                            />
                            {ratingError && (
                                <small className="d-block text-danger">{requiredField()}</small>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} className="buttonSection">
                            <Button size="sm" className="btn btn-primary addBtn" type="submit">
                                {modalData && Object.keys(modalData).length ? "Update" : "Add"}
                            </Button>

                            <Popconfirm title="Are you sure?" onConfirm={handleOnCancel}>
                                <Button size="sm" className="btn btn-danger">
                                    Cancel
                                </Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal>
    );
};
export default FeedbackModule;
