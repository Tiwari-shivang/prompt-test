import React, {useState} from "react";
import {Button, Col, Modal, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {useRecoilValue} from "recoil";
import avatar1 from "../../../assets/images/avatars/1.jpg";
import {useReportBug} from "../../../query/helpdesk/addHelpdesk/addHelpdeskQuery";
import {authState} from "../../../recoil/authRecoil";
import {requiredField} from "../../../utilits/validation";
import {Input} from "../../widgets/formComponents/Input";
import "./style.scss";

const Index = ({bugModalVisible, setBugModalVisible}) => {
    const empDetail = useRecoilValue(authState);
    // const empDetail = useRecoilValue(authState)
    const {mutateAsync: createBugMutateAsync} = useReportBug();

    const {
        setError,
        getValues,
        register,
        handleSubmit,
        formState: {errors},
        formState,
    } = useForm({
        mode: "onTouched",
    });
    const submitBugReport = (data) => {
        const newData = {
            ...data,
            "screenshot": issueFileState,
            "user_name": empDetail.email,
        };
        createBugMutateAsync(newData);
        setBugModalVisible(false);
    };
    const uploadIssueFile = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setIssueFileState(base64);
        setIssueFileName(file.name);
    };
    const [issueFileState, setIssueFileState] = useState();
    const [issueFileName, setIssueFileName] = useState("");
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
        <Modal className="bugModal" show={bugModalVisible} onHide={setBugModalVisible}>
            <div className="blueBg"></div>
            <div className="iconAndName">
                <div className="headPic">
                    <img src={empDetail?.profile_picture} alt="" />
                </div>
                <div className="nameText">{empDetail?.first_name + " " + empDetail?.last_name}</div>
                <div className="helpText">How can we help?</div>
            </div>
            <Modal.Body closeButton>
                <form className="formBugForm" onSubmit={handleSubmit(submitBugReport)}>
                    <Row>
                        <Col sm={12} className="mb-3">
                            <label>Where*</label>
                            <Input
                                type="text"
                                placeholder=""
                                className="form-control"
                                name="where_bug"
                                reference={register({
                                    required: requiredField(),
                                    validate: {
                                        lessThan: (whereBug) =>
                                            whereBug.trim().length > 100
                                                ? "Max. length is 100 characters."
                                                : true,
                                        moreThan: (whereBug) =>
                                            whereBug.trim().length == 0
                                                ? "This field is required"
                                                : true,
                                    },
                                })}
                            />
                            {errors.where_bug && (
                                <small className="form-text text-danger">
                                    {errors.where_bug.message}
                                </small>
                            )}
                        </Col>
                        <Col sm={12} className="mb-3">
                            <label>Tell us more</label>
                            <textarea
                                type="text"
                                id="text-edit"
                                className="form-control"
                                name="description"
                                ref={register({
                                    validate: {
                                        lessThan: (desc) =>
                                            desc.trim().length > 150
                                                ? "Max. length is 150 characters."
                                                : true,
                                    },
                                })}
                            ></textarea>
                            {errors.description && (
                                <small className="form-text text-danger">
                                    {errors.description.message}
                                </small>
                            )}
                        </Col>
                        <Col sm={12} className={`mb-3`}>
                            <label>Priority*</label>
                            <select
                                className="form-control dropdown-bar"
                                name="priority"
                                ref={register({
                                    required: requiredField(),
                                })}
                            >
                                <option value="">select</option>
                                <option value="Low">Low</option>
                                <option value="Urgent">Urgent</option>
                                <option value="Emergency">Emergency</option>
                            </select>
                            {errors.priority && (
                                <small className="form-text text-danger">
                                    {errors.priority.message}
                                </small>
                            )}
                        </Col>
                        <Col sm={12} className={`mb-3`}>
                            <label htmlFor="issueFile" className="labelAdmin">
                                <div className="customImg">
                                    {issueFileName == "" ? (
                                        <>{"Provide any files related to the bug"}</>
                                    ) : (
                                        <div>{issueFileName}</div>
                                    )}
                                </div>
                                <Input
                                    type="file"
                                    className="form-control customStyle"
                                    onChangeHandler={uploadIssueFile}
                                    id="issueFile"
                                    reference={register({})}
                                />
                            </label>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="buttonSection">
                            <Button
                                disabled={!formState.isValid}
                                type="submit"
                                className="btn btn-sm btn-primary submitBtn"
                            >
                                Submit
                            </Button>
                            <Button
                                className="btn btn-sm btn-danger"
                                onClick={() => setBugModalVisible(false)}
                            >
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </form>
            </Modal.Body>
        </Modal>
    );
};

// const BugForm = ({ setBugModalVisible }) => {
// 	const empDetail = useRecoilValue(authState)
// 	const { mutateAsync: createBugMutateAsync } = useReportBug();

// 	const { setError, getValues, register, handleSubmit, formState: { errors }, formState } = useForm({
// 		mode: "onTouched"
// 	});
// 	const onSubmit = (data) => {
// 		const newData = {
// 			...data,
// 			"screenshot": issueFileState,
// 			"user_name": empDetail.email
// 		}
// 		createBugMutateAsync(newData)
// 		setBugModalVisible(false)
// 	}
// 	const uploadIssueFile = async (e) => {
// 		const file = e.target.files[0]
// 		const base64 = await convertBase64(file)
// 		setIssueFileState(base64)
// 		setIssueFileName(file.name)
// 	}
// 	const [issueFileState, setIssueFileState] = useState()
// 	const [issueFileName, setIssueFileName] = useState("")
// 	const convertBase64 = (file) => {
// 		return new Promise((resolve, reject) => {
// 			const fileReader = new FileReader();
// 			fileReader.readAsDataURL(file);
// 			fileReader.onload = () => {
// 				resolve(fileReader.result)
// 			}
// 			fileReader.onerror = (error) => {
// 				reject(error)
// 			}
// 		})
// 	}
// 	return (
// 		<>
// 			<form className='formBugForm' onSubmit={handleSubmit(onSubmit)}>
// 				<Row>
// 					<Col sm={12} className="mb-3">
// 						<label>Where*</label>
// 						<Input
// 							type="text"
// 							placeholder=""
// 							className="form-control"
// 							name="where_bug"
// 							reference={register({
// 								required: requiredField(),
// 								validate: {
// 									lessThan: whereBug => whereBug.trim().length > 100 ? 'Max. length is 100 characters.' : true,
// 								}
// 							})} />
// 						{errors.where_bug && (<small className="form-text text-danger">{errors.where_bug.message}</small>)}
// 					</Col>
// 					<Col sm={12} className="mb-3">
// 						<label>Tell us more</label>
// 						<textarea
// 							type="text"
// 							id='text-edit'
// 							className="form-control"
// 							name="description"
// 							ref={register({
// 								validate: {
// 									lessThan: desc => desc.trim().length > 150 ? 'Max. length is 150 characters.' : true,
// 								}
// 							})}
// 						>
// 						</textarea>
// 						{errors.description && (<small className="form-text text-danger">{errors.description.message}</small>)}
// 					</Col>
// 					<Col sm={12} className={`mb-3`}>
// 						<label>Priority*</label>
// 						<select
// 							className="form-control dropdown-bar"
// 							name="priority"
// 							ref={
// 								register({
// 									required: requiredField(),
// 								})
// 							}
// 						>
// 							<option value="">select</option>
// 							<option value="Low">Low</option>
// 							<option value="Urgent">Urgent</option>
// 							<option value="Emergency">Emergency</option>
// 						</select>
// 						{errors.priority && (<small className="form-text text-danger">{errors.priority.message}</small>)}
// 					</Col>
// 					<Col sm={12} className={`mb-3`}>
// 						<label htmlFor="issueFile" className='labelAdmin'>
// 							<div className='customImg'>
// 								{issueFileName == "" ? <>{'Provide any files related to the bug'}</> : <div>{issueFileName}</div>}
// 							</div>
// 							<Input
// 								type="file"
// 								className="form-control customStyle"
// 								onChangeHandler={uploadIssueFile}
// 								id="issueFile"
// 								reference={register({})} />
// 						</label>
// 					</Col>
// 				</Row>
// 				<Row>
// 					<Col className='buttonSection'>
// 						<button disabled={!formState.isValid} type='submit' className="btn btn-sm btn-primary submitBtn">Submit</button>
// 						<button className="btn btn-sm btn-outline-danger closeBtn" >Cancel12</button>
// 					</Col>
// 				</Row>
// 			</form>
// 		</>
// 	)
// }
export default Index;
