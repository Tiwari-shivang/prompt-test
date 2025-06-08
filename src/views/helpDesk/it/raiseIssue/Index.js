import React, {useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {FaUserAlt} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import Breadcrumb from "../../../../components/Breadcrumb";
import {useGetAllByEmployeeDepartmentId} from "../../../../query/department/directory/query";
import {useCreateTicket} from "../../../../query/helpdesk/addHelpdesk/addHelpdeskQuery";
import {authState} from "../../../../recoil/authRecoil";
import {requiredField} from "../../../../utilits/validation";
import {Input} from "../../../widgets/formComponents/Input";
import Loader from "../../../widgets/loader/Loader";
import "./style.scss";

const Index = () => {
    const navigate = useNavigate();
    const [issueFileState, setIssueFileState] = useState();
    const [issueFileName, setIssueFileName] = useState("");
    const authDetail = useRecoilValue(authState);
    const {register, handleSubmit, errors, reset, formState} = useForm({
        mode: "onTouched",
    });

    const {data: createTicketData, mutateAsync: createTicketMutateAsync} = useCreateTicket();
    const {data: adminEmp, isLoading: isAdminEmpLoading} = useGetAllByEmployeeDepartmentId({id: 9});

    const uploadIssueFile = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setIssueFileState(base64);
        setIssueFileName(file.name);
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

    const raiseIssueHandler = (data) => {
        const raiseIssue = {
            ...data,
            emp_uuid: authDetail.uuid,
            issue_file: issueFileState,
        };
        createTicketMutateAsync(raiseIssue);
        setIssueFileName("");
        reset();
    };
    return (
        <>
            <Row className="nav mb-2">
                <Col xs={8}>
                    <Breadcrumb />
                </Col>
                <Col xs={4} className="buttons">
                    <div class="list">
                        <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => {
                                navigate("/helpDesk/it/myRequest");
                            }}
                        >
                            My Requests
                        </Button>
                    </div>
                </Col>
            </Row>
            <div className="raiseIssue">
                <h6 className="raiseIssueTitle cardCustomTitle">Raise Issue</h6>
                <Row className="mb-2">
                    <Col
                        xs={{span: 12, order: 2}}
                        lg={{span: 6, order: 1}}
                        xl={{span: 6, order: 1}}
                        className="mb-3 px-2 form-col"
                    >
                        <form onSubmit={handleSubmit(raiseIssueHandler)}>
                            <Row>
                                <Col sm={12} lg={6} className="mb-3">
                                    <label className={`${errors.subcategory ? "text-danger" : ""}`}>
                                        Category *
                                    </label>
                                    <select
                                        className="form-control dropdown-bar"
                                        name="subcategory"
                                        ref={register({
                                            required: requiredField(),
                                        })}
                                    >
                                        <option value="">Select</option>
                                        <option value="incident-hardware">Incident-Hardware</option>
                                        <option value="incident-software">Incident-Software</option>
                                        <option value="incident-printer">Incident-Printer</option>
                                        <option value="incident-network">Incident-Network</option>
                                        <option value="incident-database">Incident-Database</option>
                                        <option value="request-software installation">
                                            Request-Software Installation
                                        </option>
                                        <option value="others">Others</option>
                                    </select>
                                    {errors.subcategory && (
                                        <small className="form-text text-danger">
                                            {errors.subcategory.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={12} lg={6} className="mb-3">
                                    <label className={`${errors.priority ? "text-danger" : ""}`}>
                                        Priority *
                                    </label>
                                    <select
                                        className="form-control dropdown-bar"
                                        name="priority"
                                        ref={register({
                                            required: requiredField(),
                                        })}
                                    >
                                        <option value="">Select</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                    {errors.priority && (
                                        <small className="form-text text-danger">
                                            {errors.priority.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={12} className="mb-3">
                                    <label className={`${errors.subject ? "text-danger" : ""}`}>
                                        Subject *
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Subject"
                                        className="form-control"
                                        name="subject"
                                        reference={register({
                                            required: requiredField(),
                                            validate: (v) =>
                                                v.trim().length > 100
                                                    ? "Subject should be max. 100 letters"
                                                    : true,
                                        })}
                                    />
                                    {errors.subject && (
                                        <small className="form-text text-danger">
                                            {errors.subject.message}
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
                                        name="ticket_description"
                                        ref={register({
                                            validate: (v) =>
                                                v.trim().length > 150
                                                    ? "Description should be max. 150 letters"
                                                    : true,
                                        })}
                                    ></textarea>
                                    {errors.ticket_description && (
                                        <small className="form-text text-danger">
                                            {errors.ticket_description.message}
                                        </small>
                                    )}
                                </Col>
                                <Col sm={12} className="mb-4">
                                    <label htmlFor="issueFile" className="labelAdmin">
                                        <div className="customImg">
                                            <AiOutlineCloudUpload className="icons" />{" "}
                                            {issueFileName == "" ? (
                                                <p>Upload from Computer or Other</p>
                                            ) : (
                                                <div>{issueFileName}</div>
                                            )}
                                        </div>
                                        <Input
                                            type="file"
                                            className="form-control customStyle"
                                            onChangeHandler={uploadIssueFile}
                                            name="issue_file"
                                            id="issueFile"
                                            reference={register({})}
                                        />
                                    </label>
                                </Col>
                                <Col sm={12} className="buttonSection">
                                    <Button
                                        disabled={!formState.isValid}
                                        variant="primary"
                                        type="submit"
                                    >
                                        Create
                                    </Button>
                                    <Button variant="outline-danger" onClick={() => navigate(-1)}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    </Col>
                    <Col
                        xs={{span: 12, order: 1}}
                        lg={{span: 6, order: 2}}
                        xl={{span: 6, order: 1}}
                        className="mb-3 description-col"
                    >
                        <Row>
                            <Col xs={12} sm={6} lg={12} className="mb-3">
                                <div className="agentDetailSection mb-2">
                                    <h5>IT support</h5>
                                    <p className="pb-2">
                                        Support related to technical issues related to their
                                        computer hardware, software, network, or other technological
                                        equipment will be provided.
                                    </p>
                                </div>
                                <div className="agentDetailSection">
                                    <h5>Agent Details:</h5>
                                    {isAdminEmpLoading ? (
                                        <Loader />
                                    ) : !adminEmp ||
                                      (adminEmp && adminEmp?.employees?.length === 0) ? (
                                        <div className="emptyListText">No IT Admins found.</div>
                                    ) : (
                                        adminEmp &&
                                        adminEmp?.employees?.length > 0 &&
                                        adminEmp?.employees?.map((item, i) => (
                                            <div className="agentDetail">
                                                <div className="agentDetailPic">
                                                    {item && item.profile_picture ? (
                                                        <img src={item.profile_picture} alt="" />
                                                    ) : (
                                                        <FaUserAlt className="userIcon" />
                                                    )}
                                                </div>
                                                <p>
                                                    {item.first_name} {item.last_name}{" "}
                                                    {item.office_id}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </Col>
                            <Col xs={12} sm={6} lg={12} className="agentDetailSection">
                                <h5>Category</h5>
                                <p className="mb-1 pb-1">
                                    Incident-Hardware, Incident-Software, Incident-Printer,
                                    Incident-Network, Incident-Database, Request-Software
                                    Installation
                                </p>
                                <h5>Status</h5>
                                <p className="mb-1 pb-1">Open, Inprogress, closed</p>
                                <h5>Priority</h5>
                                <p className="mb-1 pb-1">Low, Medium, High</p>
                                <h5>Source of request</h5>
                                <p>Web</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Index;
