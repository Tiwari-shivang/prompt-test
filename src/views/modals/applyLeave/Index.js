import Moment from "moment";
import React, {useState} from "react";
import {Button, Col, Modal, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {useRecoilValue} from "recoil";
import {useGetAllHolidays} from "../../../query/holidays/holidaysQuery";
import {useAddLeaveApply} from "../../../query/leave/addLeaves/addLeavesQuery";
import {authState} from "../../../recoil/authRecoil";
import {requiredField} from "../../../utilits/validation";
import {Input} from "../../widgets/formComponents/Input";
import "./style.scss";
import {Select} from "antd";

const Index = ({applyLeaveModalVisible, setApplyLeaveModalVisible, leaveType}) => {
    const empDetail = useRecoilValue(authState);

    const {
        setError,
        getValues,
        register,
        handleSubmit,
        formState: {errors},
        watch,
        formState,
    } = useForm({
        mode: "onTouched",
    });
    const dateFrom = watch("dateFrom");
    const dateTo = watch("dateTo");
    const [getAllLeaves, setGetAllLeaves] = useState({
        // "id": empDetail.uuid,
        "type": "upcoming",
    });
    const {data: allHolidays, isLoading: isAllHolidaysLoading} = useGetAllHolidays(getAllLeaves);

    const onSubmit = (data) => {
        const val = {
            "emp_uuid": empDetail.uuid,
            "reporting_manager_uuid": empDetail.reporting_manager_uuid
                ? empDetail.reporting_manager_uuid
                : 3,
            "leave_type": "Casual Leave",
            "leave_from_date": data.dateFrom
                ? Moment(data.dateFrom).format("YYYY-MM-DD")
                : data.birthday,
            "reason": leaveDesc,
            "leave_day_type":
                leaveType == "Birthday Leave"
                    ? "Full Day"
                    : data.dayType === ""
                    ? "Full Day"
                    : data.dayType,
            "leave_to_date":
                leaveType == "Birthday Leave"
                    ? data.birthday
                    : Moment(data.dateTo).format("YYYY-MM-DD"),
        };
        addMutateAsync(val);
        setApplyLeaveModalVisible(false);
    };

    const {
        data: addLeave,
        isLoading: isLoadingAddLeave,
        mutateAsync: addMutateAsync,
    } = useAddLeaveApply();

    const [leaveDay, setLeaveDay] = useState("");
    const [leaveDesc, setLeaveDesc] = useState();
    const [type, setType] = useState(leaveType);

    const leaveTypeChangeHandler = (val) => {
        setType(val);
    };

    const leaveDayChangeHandler = (val) => {
        setLeaveDay(val);
    };
    return (
        <Modal
            className="applyLeaveModal commonModal"
            show={applyLeaveModalVisible}
            onHide={() => setApplyLeaveModalVisible(false)}
        >
            <Modal.Header>
                <Modal.Title>Apply Leave</Modal.Title>
            </Modal.Header>
            <Modal.Body closebutton='true' className="customScroll">
                    <form className="container formApplyLeave" onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col sm={12} className="mb-3">
                                <label>Employee ID *</label>
                                <select
                                    className="form-control dropdown-bar"
                                    name="empId"
                                    ref={register({
                                        required: requiredField(),
                                    })}
                                >
                                    <option value="E01234">
                                        {empDetail.first_name} {empDetail.last_name} (
                                        {empDetail.office_id})
                                    </option>
                                </select>
                                {errors.empId && (
                                    <small className="form-text text-danger">
                                        {errors.empId.message}
                                    </small>
                                )}
                            </Col>
                            {/* <Col sm={12} className="mb-3 ">
                                <label>Leave Type *</label>
                                <select
                                    className="form-control dropdown-bar"
                                    name="leaveType"
                                    ref={register({
                                        required: requiredField(),
                                    })}
                                    value={leaveType}
                                    onChange={({target: {value}}) => leaveTypeChangeHandler(value)}
                                >
                                    <option value="">select</option>
                                    <option value="Birthday Leave">Birthday Leave</option>
                                    <option value="Carried forward Comp offs">
                                        Carried forward Comp Offs
                                    </option>
                                    <option value="Casual Leave">Casual Leave</option>
                                    <option value="Compensatory Off">Compensatory Off</option>
                                    <option value="Earned Leave">Earned Leave</option>
                                    <option value="Loss of Pay">Loss of Pay</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                </select>
                                {errors.leaveType && (
                                    <small className="form-text text-danger">
                                        {errors.leaveType.message}
                                    </small>
                                )}
                            </Col> */}
                            <Col
                                sm={12}
								hidden={leaveType !== "Birthday Leave"}
                                className={`mb-3  ${
                                    leaveType !== "Birthday Leave" ? "hideme" : ""
                                }`}
                            >
                                <label>Applicable days *</label>
                                <select
                                    className="form-control dropdown-bar"
                                    name="birthday"
                                    ref={register({
                                        required:
                                            leaveType === "Birthday Leave" ? requiredField() : null,
                                    })}
                                >
                                    <option value="">select</option>
                                    <option value={Moment(empDetail.dob).format("YYYY-MM-DD")}>
                                        {new Date(
                                            Moment(empDetail.dob).format("YYYY-MM-DD")
                                        ).getDay()}{" "}
                                        {new Date(
                                            Moment(empDetail.dob).format("YYYY-MM-DD")
                                        ).toLocaleDateString("en-us", {month: "long"})}{" "}
                                    </option>
                                </select>
                                {errors.birthday && (
                                    <small className="form-text text-danger">
                                        {errors.birthday.message}
                                    </small>
                                )}
                            </Col>
                        </Row>
                        <Row className={`mb-3  ${leaveType === "Birthday Leave" ? "hideme" : ""}`}>
                            <Col className="dateCol from">
                                <label>Start date *</label>
                                <Input
                                    type="date"
                                    className="form-control"
                                    name="dateFrom"
                                    max="9999-12-31"
                                    reference={register({
                                        required:
                                            leaveType !== "Birthday Leave"
                                                ? requiredField()
                                                : false,
                                    })}
                                />
                                {errors.dateFrom && (
                                    <small className="form-text text-danger">
                                        {errors.dateFrom.message}
                                    </small>
                                )}
                            </Col>
                            <Col className="dateCol to">
                                <label>End date *</label>
                                <Input
                                    type="date"
                                    className="form-control"
                                    name="dateTo"
                                    max="9999-12-31"
                                    reference={register({
                                        required:
                                            leaveType !== "Birthday Leave"
                                                ? requiredField()
                                                : false,
                                        validate: {
                                            greaterThan: (v) => {
                                                if (dateFrom && new Date(dateFrom) > new Date(v)) {
                                                    return "End date is not valid.";
                                                } else return true;
                                            },
                                            // equalTo: v => {
                                            // 	allHolidays.forEach(h => {
                                            // 	})
                                            // 	if (dateTo && allHolidays && allHolidays.some(holiday => { return new Date(holiday.date) == new Date(dateTo) })) {
                                            // 		return 'a Holiday.';
                                            // 	}
                                            // 	else return true;
                                            // },
                                        },
                                    })}
                                />
                                {errors.dateTo && (
                                    <small className="form-text text-danger">
                                        {errors.dateTo.message}
                                    </small>
                                )}
                            </Col>
                            <Col>
                                <div>
                                    <label>Day Type *</label>
                                    <select
                                        className="form-control dropdown-bar"
                                        name="dayType"
                                        ref={register({
                                            required:
                                                leaveType !== "Birthday Leave"
                                                    ? requiredField()
                                                    : false,
                                        })}
                                        onChange={({target: {value}}) =>
                                            leaveDayChangeHandler(value)
                                        }
                                    >
                                        <option key='1' value="">select</option>
                                        <option key='2' value="Full Day">Full Day</option>
                                        <option key='3' value="1st half">1st half</option>
                                        <option key='4' value="2nd half">2nd half</option>
                                    </select>
                                    {errors.dayType && (
                                        <small className="form-text text-danger">
                                            {errors.dayType.message}
                                        </small>
                                    )}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mb-3 ">
                                <label>Team email ID *</label>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="form-control"
                                    name="emailId"
                                    reference={register({
                                        required: requiredField(),
                                    })}
                                />
                                {errors.emailId && (
                                    <small className="form-text text-danger">
                                        {errors.emailId.message}
                                    </small>
                                )}
                            </Col>
                            {/* <Col
                                sm={12}
                                className={`mb-3  ${
                                    leaveType !== "Compensatory Off" ? "hideme" : ""
                                }`}
                            >
                                <label>Compensate with</label>
                                <select
                                    className="form-control dropdown-bar"
                                    name="compensateWith"
                                    ref={register({
                                        //required: leaveType === 'Compensatory Off' ? requiredField() : null,
                                    })}
                                >
                                    <option value="">select</option>
                                </select>
                            </Col> */}
                            <Col
                                sm={12}
                                className={`mb-3  ${leaveType == "Birthday Leave" ? "hideme" : ""}`}
                            >
                                <label>Reason of Leave</label>
                                <textarea
                                    type="text"
                                    id="text-edit"
                                    className="form-control"
                                    name="reason"
                                    onChange={({target: {value}}) => setLeaveDesc(value)}
                                    ref={register({
                                        validate: (reason) =>
                                            reason.trim().length > 150
                                                ? "Reason must be max. 150 characters."
                                                : true,
                                    })}
                                ></textarea>
                                {errors.reason && (
                                    <small className="form-text text-danger">
                                        {errors.reason.message}
                                    </small>
                                )}
                            </Col>
                            {/* <Col
                            sm={12}
                            className={`mb-3`}
                        >
                            <label>Mentions</label>
                            <Select
                                mode="multiple"
                                style={{width: "100%"}}
                                placeholder="Select Employee"
                                className="form-control"
                                name="mention"
                            >
                                <option value="" disabled>
                                    Select Employee
                                </option>
                            </Select>
                            {errors.reason && (
                                <small className="form-text text-danger">
                                    {errors.mention.message}
                                </small>
                            )}
                        </Col> */}
                            {/* <small className="form-text text-danger">
                                {(empDetail && empDetail.employee_status == "Full-time Employee") ||
                                (empDetail && empDetail.employee_status == "Notice Period")
                                    ? "* full time Employees can avail 2 leaves at a time."
                                    : "* Employees under training can avail 1 leave at a time"}
                            </small> */}
                            <Col sm={12} className="buttonSection mb-3">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    type="submit"
                                    className="addBtn"
                                >
                                    Apply
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="closeBtn"
                                    onClick={() => setApplyLeaveModalVisible(false)}
                                >
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </form>
                {/* <div className="applyLeaveForm">
                </div> */}
            </Modal.Body>
        </Modal>
    );
};

// const ApplyLeaveForm = ({setApplyLeaveModalVisible, type}) => {
//     const empDetail = useRecoilValue(authState);

//     const {
//         setError,
//         getValues,
//         register,
//         handleSubmit,
//         formState: {errors},
//         watch,
//         formState,
//     } = useForm({
//         mode: "onTouched",
//     });
//     const dateFrom = watch("dateFrom");
//     const dateTo = watch("dateTo");
//     const [getAllLeaves, setGetAllLeaves] = useState({
//         // "id": empDetail.uuid,
//         "type": "upcoming",
//     });
//     const {data: allHolidays, isLoading: isAllHolidaysLoading} = useGetAllHolidays(getAllLeaves);

//     const onSubmit = (data) => {
//         const val = {
//             "emp_uuid": empDetail.uuid,
//             "reporting_manager_uuid": empDetail.reporting_manager_uuid
//                 ? empDetail.reporting_manager_uuid
//                 : 3,
//             "leave_type": data.leaveType,
//             "leave_from_date": data.dateFrom
//                 ? Moment(data.dateFrom).format("YYYY-MM-DD")
//                 : data.birthday,
//             "reason": leaveDesc,
//             "leave_day_type":
//                 leaveType == "Birthday Leave"
//                     ? "Full Day"
//                     : data.dayType === ""
//                     ? "Full Day"
//                     : data.dayType,
//             "leave_to_date":
//                 leaveType == "Birthday Leave"
//                     ? data.birthday
//                     : Moment(data.dateTo).format("YYYY-MM-DD"),
//         };
//         addMutateAsync(val);
//         setApplyLeaveModalVisible(false);
//     };

//     const {
//         data: addLeave,
//         isLoading: isLoadingAddLeave,
//         mutateAsync: addMutateAsync,
//     } = useAddLeaveApply();

//     const [leaveDay, setLeaveDay] = useState("");
//     const [leaveDesc, setLeaveDesc] = useState();
//     const [leaveType, setLeaveType] = useState(type);

//     const leaveTypeChangeHandler = (val) => {
//         setLeaveType(val);
//     };

//     const leaveDayChangeHandler = (val) => {
//         setLeaveDay(val);
//     };

//     return (
//         <>
//             <div className="applyLeaveForm">
//                 <form className="formApplyLeave" onSubmit={handleSubmit(onSubmit)}>
//                     <Row>
//                         <Col sm={12} className="mb-3 ">
//                             <label>Employee ID *</label>
//                             <select
//                                 className="form-control dropdown-bar"
//                                 name="empId"
//                                 disabled="true"
//                                 ref={register({
//                                     required: requiredField(),
//                                 })}
//                             >
//                                 <option value="E01234">
//                                     {empDetail.first_name} {empDetail.last_name} (
//                                     {empDetail.office_id})
//                                 </option>
//                             </select>
//                             {errors.empId && (
//                                 <small className="form-text text-danger">
//                                     {errors.empId.message}
//                                 </small>
//                             )}
//                         </Col>
//                         <Col sm={12} className="mb-3 ">
//                             <label>Leave Type *</label>
//                             <select
//                                 className="form-control dropdown-bar"
//                                 name="leaveType"
//                                 ref={register({
//                                     required: requiredField(),
//                                 })}
//                                 value={leaveType}
//                                 onChange={({target: {value}}) => leaveTypeChangeHandler(value)}
//                             >
//                                 <option value="">select</option>
//                                 <option value="Birthday Leave">Birthday Leave</option>
//                                 <option value="Carried forward Comp offs">
//                                     Carried forward Comp Offs
//                                 </option>
//                                 <option value="Casual Leave">Casual Leave</option>
//                                 <option value="Compensatory Off">Compensatory Off</option>
//                                 <option value="Earned Leave">Earned Leave</option>
//                                 <option value="Loss of Pay">Loss of Pay</option>
//                                 <option value="Sick Leave">Sick Leave</option>
//                             </select>
//                             {errors.leaveType && (
//                                 <small className="form-text text-danger">
//                                     {errors.leaveType.message}
//                                 </small>
//                             )}
//                         </Col>
//                         <Col
//                             sm={12}
//                             className={`mb-3  ${leaveType !== "Birthday Leave" ? "hideme" : ""}`}
//                         >
//                             <label>Applicable days *</label>
//                             <select
//                                 className="form-control dropdown-bar"
//                                 name="birthday"
//                                 ref={register({
//                                     required:
//                                         leaveType === "Birthday Leave" ? requiredField() : null,
//                                 })}
//                             >
//                                 <option value="">select</option>
//                                 <option value={Moment(empDetail.dob).format("YYYY-MM-DD")}>
//                                     {new Date(Moment(empDetail.dob).format("YYYY-MM-DD")).getDay()}{" "}
//                                     {new Date(
//                                         Moment(empDetail.dob).format("YYYY-MM-DD")
//                                     ).toLocaleDateString("en-us", {month: "long"})}{" "}
//                                 </option>
//                             </select>
//                             {errors.birthday && (
//                                 <small className="form-text text-danger">
//                                     {errors.birthday.message}
//                                 </small>
//                             )}
//                         </Col>
//                     </Row>
//                     <Row className={`mb-3  ${leaveType === "Birthday Leave" ? "hideme" : ""}`}>
//                         <Col className="dateCol from">
//                             <label>Start date *</label>
//                             <Input
//                                 type="date"
//                                 className="form-control"
//                                 name="dateFrom"
//                                 max="9999-12-31"
//                                 reference={register({
//                                     required:
//                                         leaveType !== "Birthday Leave" ? requiredField() : false,
//                                 })}
//                             />
//                             {errors.dateFrom && (
//                                 <small className="form-text text-danger">
//                                     {errors.dateFrom.message}
//                                 </small>
//                             )}
//                         </Col>
//                         <Col className="dateCol to">
//                             <label>End date *</label>
//                             <Input
//                                 type="date"
//                                 className="form-control"
//                                 name="dateTo"
//                                 max="9999-12-31"
//                                 reference={register({
//                                     required:
//                                         leaveType !== "Birthday Leave" ? requiredField() : false,
//                                     validate: {
//                                         greaterThan: (v) => {
//                                             if (dateFrom && new Date(dateFrom) > new Date(v)) {
//                                                 return "End date is not valid.";
//                                             } else return true;
//                                         },
//                                         // equalTo: v => {
//                                         // 	allHolidays.forEach(h => {
//                                         // 	})
//                                         // 	if (dateTo && allHolidays && allHolidays.some(holiday => { return new Date(holiday.date) == new Date(dateTo) })) {
//                                         // 		return 'a Holiday.';
//                                         // 	}
//                                         // 	else return true;
//                                         // },
//                                     },
//                                 })}
//                             />
//                             {errors.dateTo && (
//                                 <small className="form-text text-danger">
//                                     {errors.dateTo.message}
//                                 </small>
//                             )}
//                         </Col>
//                         <Col>
//                             <div>
//                                 <label>Day Type *</label>
//                                 <select
//                                     className="form-control dropdown-bar"
//                                     name="dayType"
//                                     ref={register({
//                                         required:
//                                             leaveType !== "Birthday Leave"
//                                                 ? requiredField()
//                                                 : false,
//                                     })}
//                                     onChange={({target: {value}}) => leaveDayChangeHandler(value)}
//                                 >
//                                     <option value="">select</option>
//                                     <option value="Full Day">Full Day</option>
//                                     <option value="1st half">1st half</option>
//                                     <option value="2nd half">2nd half</option>
//                                 </select>
//                                 {errors.dayType && (
//                                     <small className="form-text text-danger">
//                                         {errors.dayType.message}
//                                     </small>
//                                 )}
//                             </div>
//                         </Col>
//                     </Row>
//                     <Row>
//                         <Col className="mb-3 ">
//                             <label>Team email ID *</label>
//                             <Input
//                                 type="email"
//                                 placeholder="Enter your email"
//                                 className="form-control"
//                                 name="emailId"
//                                 reference={register({
//                                     required: requiredField(),
//                                 })}
//                             />
//                             {errors.emailId && (
//                                 <small className="form-text text-danger">
//                                     {errors.emailId.message}
//                                 </small>
//                             )}
//                         </Col>
//                         <Col
//                             sm={12}
//                             className={`mb-3  ${leaveType !== "Compensatory Off" ? "hideme" : ""}`}
//                         >
//                             <label>Compensate with</label>
//                             <select
//                                 className="form-control dropdown-bar"
//                                 name="compensateWith"
//                                 ref={register({
//                                     //required: leaveType === 'Compensatory Off' ? requiredField() : null,
//                                 })}
//                             >
//                                 <option value="">select</option>
//                             </select>
//                         </Col>
//                         <Col
//                             sm={12}
//                             className={`mb-3  ${leaveType == "Birthday Leave" ? "hideme" : ""}`}
//                         >
//                             <label>Reason of Leave</label>
//                             <textarea
//                                 type="text"
//                                 id="text-edit"
//                                 className="form-control"
//                                 name="reason"
//                                 onChange={({target: {value}}) => setLeaveDesc(value)}
//                                 reference={register({
//                                     validate: (reason) =>
//                                         reason.trim().length > 150
//                                             ? "Reason must be max. 150 characters."
//                                             : true,
//                                 })}
//                             ></textarea>
//                             {errors.reason && (
//                                 <small className="form-text text-danger">
//                                     {errors.reason.message}
//                                 </small>
//                             )}
//                         </Col>
//                         {/* <Col
//                             sm={12}
//                             className={`mb-3`}
//                         >
//                             <label>Mentions</label>
//                             <Select
//                                 mode="multiple"
//                                 style={{width: "100%"}}
//                                 placeholder="Select Employee"
//                                 className="form-control"
//                                 name="mention"
//                             >
//                                 <option value="" disabled>
//                                     Select Employee
//                                 </option>
//                             </Select>
//                             {errors.reason && (
//                                 <small className="form-text text-danger">
//                                     {errors.mention.message}
//                                 </small>
//                             )}
//                         </Col> */}
//                         <small className="form-text text-danger">
//                             {(empDetail && empDetail.employee_status == "Full-time Employee") ||
//                             (empDetail && empDetail.employee_status == "Notice Period")
//                                 ? "* full time Employees can avail 2 leaves at a time."
//                                 : "* Employees under training can avail 1 leave at a time"}
//                         </small>
//                         <Col sm={12} className="buttonSection">
//                             <Button variant="primary" size="sm" type="submit" className="addBtn">
//                                 Apply
//                             </Button>
//                             <Button
//                                 variant="danger"
//                                 size="sm"
//                                 className="closeBtn"
//                                 onClick={() => setApplyLeaveModalVisible(false)}
//                             >
//                                 Cancel
//                             </Button>
//                         </Col>
//                     </Row>
//                 </form>
//             </div>
//         </>
//     );
// };
export default Index;
