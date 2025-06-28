import React, { useState } from 'react'
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import avatar1 from '../../../../assets/images/avatars/1.jpg'
import './style.scss'
// import { requiredField } from '../../../utilits/validation'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { useGetAllByEmployeeDepartmentId } from '../../../../query/department/directory/query'
import { useCreateFinanceMessage, useCreateFinanceNotes } from '../../../../query/financeHelpdesk/addHelpdesk/addHelpdeskQuery'
import { useGetAllFinanceMessagesByTicketId, useGetAllFinanceTicketByEmpId, useGetAllFinanceTicketDetailsById, useGetNoteFinanceByEmpId } from '../../../../query/financeHelpdesk/getHelpdesk/getHelpdeskQuery'
import { useUpdateFinanceAssignedTo, useUpdateFinanceNotes, useUpdateFinanceTicketStatus } from '../../../../query/financeHelpdesk/updateHelpDesk/updateHelpdeskQuery'
import { authState } from '../../../../recoil/authRecoil'

const Index = () => {
	const params = useParams();
	const location = useLocation();
	const empDetails = useRecoilValue(authState);
	const navigate = useNavigate();
	const [writeSwitch, setWriteSwitch] = useState('reply');
	const { register, handleSubmit, errors, reset, formState, setValue, getValues, watch, clearErrors } = useForm({
		mode: "onTouched"
	});
	const { data: createMessage, mutateAsync: createMessageMutateAsync } = useCreateFinanceMessage()
	const { data, isLoading, mutateAsync: updateTicketMutateAsync } = useUpdateFinanceTicketStatus()
	const { data: updateNote, mutateAsync: updateNoteMutateAsync } = useUpdateFinanceNotes()
	const { data: createNote, mutateAsync: createNoteMutateAsync } = useCreateFinanceNotes()
	const { data: assignedTo, isLoading: isLoadingAssignedTo, mutateAsync: updateAssignedMutateAsync } = useUpdateFinanceAssignedTo()
	const { data: allAdminDetails, isLoading: isAllAdminDetailsLoading } = useGetAllFinanceTicketDetailsById(params?.id)
	const { data: allMessages, isLoading: isLoadingAllMessages } = useGetAllFinanceMessagesByTicketId(params?.id)
	const dataForNote = {
		"empId": empDetails.uuid,
		"ticketUuid": params?.id
	}
	const { data: notesById, isLoading: isLoadingnotesById } = useGetNoteFinanceByEmpId(dataForNote)
	const { data: allFinanceAdminEmployees, isLoadingFinance } = useGetAllByEmployeeDepartmentId({ id: 8 })
	const [assgnTo, setAssgnTo] = useState("")
	const { data: myRequests, isLoading: isLoadingMyRequests } = useGetAllFinanceTicketByEmpId(empDetails?.uuid);
	const enabledStyle = {
		background: '#F9FAFA 0% 0% no-repeat padding-box',
		borderBottom: '2px solid #176FFA',
	}
	const disabledStyle = {
		background: '#ffffff 0% 0% no-repeat padding-box',
		borderBottom: '1px solid #B4B7B9',
	}
	const financeArrowClickHandler = (direction, curTicketId) => {
		const curIndex = myRequests.findIndex(({ uuid }) => uuid === params.id);
		if ((curIndex === 0 && direction === -1) || (curIndex === (myRequests.length - 1) && direction === 1))
			return;
		const nextTicketId = myRequests[(direction + curIndex + myRequests.length) % myRequests.length]?.uuid;
		navigate(`/helpDesk/finance/request/${nextTicketId}`);
	}

	const handleOnSubmitMessage = (data) => {
		if ((writeSwitch === 'note' && data.messageNote.trim().length === 0) || (writeSwitch === 'reply' && data.messageReply.trim().length === 0)) {
			return;
		}
		const valMessage = {
			"message": writeSwitch === 'note' ? data.messageNote : data.messageReply,
			"emp_uuid": empDetails?.uuid,
			"uuid": params?.id,
		}
		const valNote = {
			"note": writeSwitch === 'note' ? data.messageNote : data.messageReply,
			"emp_uuid": empDetails?.uuid,
			"uuid": params?.id,
		}
		if (writeSwitch == "reply") {
			createMessageMutateAsync(valMessage)
		} else {
			createNoteMutateAsync(valNote)
		}
		reset("")
	}

	const statusChangeHandler = (e) => {
		const val = {
			"id": params?.id,
			"current_ticket_tatus": e.target.value,
			"previous_ticket_status": allAdminDetails?.it_admin_ticket?.ticket_status,
			"empId": allAdminDetails?.it_admin_ticket?.emp.uuid,
			"empEmail": allAdminDetails?.email,
			"assignedTo": allAdminDetails?.it_admin_ticket?.assigned_to,
			"subject": allAdminDetails?.it_admin_ticket?.subject,
			"ticketDescription": allAdminDetails?.it_admin_ticket?.description
		}
		//	if (allAdminDetails?.it_admin_ticket?.assigned_to) {
		updateTicketMutateAsync(val)
		//	}
	}

	const assignedToChangeHandler = (assignedTo) => {
		const val = {
			"uuid": params?.id,
			"emp_uuid": empDetails?.uuid,
			"assigned_to": assignedTo
		}
		updateAssignedMutateAsync(val)
	}

	return (
		<>
			<Row className='row'>
				<Col className='col order-2 order-sm-2 order-md-1' xs={12} md={9}>
					<div className='request'>
						<div className='firstCard'>
							<div className='info'>
								<div className='headPic'>
									<img src={empDetails.profile_picture} alt="" />
								</div>
								<p className='ticketNo'>{allAdminDetails?.finance_admin_ticket?.ticket_id}</p>
								<p className='subject'>{allAdminDetails?.finance_admin_ticket?.subject}</p>
							</div>
							<div className='buttons'>
								<button className='progressBtn'>{allAdminDetails?.it_admin_ticket?.ticket_status}</button>
								<button className={`arrows leftArrow ${myRequests?.findIndex(({ uuid }) => uuid === params.id) == 0?'d-none':''}`} onClick={() => financeArrowClickHandler(-1, params?.id)}><RiArrowLeftLine /></button>
								<button className={`arrows rightArrow  ${myRequests?.findIndex(({ uuid }) => uuid === params.id) == myRequests?.length-1?'d-none':''}`} onClick={() => financeArrowClickHandler(1, params?.id)}><RiArrowRightLine /></button>
							</div>
						</div>
						<div className='cards'>
							{
								allMessages && allMessages.map((item, index) => (
									<div className='cardElement'>
										<div className='headPic'>
											<img src={avatar1} alt="" />
										</div>
										<div className='content'>
											<div className='titleAndSubject'>
												<p className='title'>{item.office_id} - {item.employee_name}</p>
												<p className='subject'>{item.message}</p>
											</div>
											<div className='time'>
												<p>{item.message_created_at}</p>
											</div>
										</div>
									</div>
								))
							}

							<div className='write'>
								<ButtonGroup className='buttons'>
									<button
										onClick={() => {
											setWriteSwitch('reply');
										}}
										style={writeSwitch === 'reply' ? enabledStyle : disabledStyle}
									>Reply</button>
									<button
										onClick={() => {
											setWriteSwitch('note');
										}}
										style={writeSwitch === 'note' ? enabledStyle : disabledStyle}
									>Note</button>
								</ButtonGroup>
							</div>
							<form onSubmit={handleSubmit(handleOnSubmitMessage)}>
								<textarea
									type="text"
									id='text-edit'
									placeholder="Write a Note"
									className={`textBox form-control ${writeSwitch === 'note' ? '' : 'hideme'}`}
									name="messageNote"
									ref={register({})}
								></textarea>
								<textarea
									type="text"
									id='text-edit'
									placeholder="Write a Reply"
									className={`textBox form-control ${writeSwitch === 'reply' ? '' : 'hideme'}`}
									name="messageReply"
									ref={register({})}
								></textarea>
								<Button disabled={!formState.isValid} className='submitButton' type='submit' >Submit</Button>
							</form>
						</div>
					</div>
				</Col>
				<Col className='col order-1 order-sm-1 order-md-2' xs={12} md={3}>
					<div className='sideBar'>
						<Row>
							<Col className='info' sm={6} xs={12} md={12} >
								<p className='header category'>Category</p>
								<p className='content'>Finance Help Desk</p>
								<p className='header status'>Change Status</p>
								<p className='content drop'><select
									className="form-control dropdown-bar"
									value={allAdminDetails?.it_admin_ticket?.ticket_status}
									onChange={(e) => statusChangeHandler(e)}
									// disabled={location.state.access == "employee"}
								>
									<option >select</option>
									<option value="Open">Open</option>
									<option value="Pending">Pending</option>
									<option value="On Hold">On Hold</option>
									<option value="In Progress">In Progress</option>
									<option value="Closed">Closed</option>

								</select>	</p>
								<p className='header priority'>Priority</p>
								<p className='content'>{allAdminDetails?.it_admin_ticket?.priority}</p>
								<p className='header sourceOfRequest'>Source of request</p>
								<p className='content'>Web</p>
							</Col>
							<Col className='agentsList' sm={6} xs={12} md={12}>
								<p className='header'>Assigned To</p>
								<ul variant='flush' className='agents-list '>
									<li className='agents'>
										<div className='headPic'>
											<img src={avatar1} alt="" />
										</div>
										<p className='name'>{allAdminDetails?.assigne_name} ({allAdminDetails?.office_id})</p>
									</li>
								</ul>
								<p className='content'>
									<select
										className="form-control dropdown-bar"
										value={allAdminDetails?.assigne_name}
										onChange={({ target: { value } }) => assignedToChangeHandler(value)}
										// disabled={location.state.access == "employee"}
									>
										<option >Change Assigne</option>
										<option value={allAdminDetails?.it_admin_ticket?.assigned_to} >{allAdminDetails?.assigne_name}</option>
										{
											allFinanceAdminEmployees && allFinanceAdminEmployees.employees && allFinanceAdminEmployees.employees.map((item) => (
												<option value={item.department_uuid}>{item.first_name} {item.last_name}</option>
											))
										}
									</select>
								</p>
							</Col>
						</Row>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default Index
