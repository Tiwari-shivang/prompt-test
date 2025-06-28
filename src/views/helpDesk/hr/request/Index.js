import React, { useEffect } from 'react'
import avatar1 from '../../../../assets/images/avatars/1.jpg'
import './style.scss'
import { useNavigate } from 'react-router-dom'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap'
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useParams, useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { authState } from '../../../../recoil/authRecoil'
import { useGetAllHrMessagesByTicketId, useGetAllHrTicketByEmpId, useGetAllHrTicketDetailsById, useGetNoteByEmpId } from '../../../../query/hrHelpdesk/getHelpdesk/getHelpdeskQuery'
import { useCreateHrMessage, useCreateHrNote } from '../../../../query/hrHelpdesk/addHelpdesk/addHelpdeskQuery'
import { useUpdateHrNotes, useUpdateHrTicketAssignedTo, useUpdateHrTicketStatus } from '../../../../query/hrHelpdesk/updateHelpDesk/updateHelpdeskQuery'
import { useGetAllByEmployeeDepartmentId } from '../../../../query/department/directory/query'
const Index = () => {
	const params = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const { register, handleSubmit, errors, reset, setValue, getValues, watch, clearErrors } = useForm();
	const [writeSwitch, setWriteSwitch] = useState('reply');
	const [message, setMessage] = useState();
	const empDetails = useRecoilValue(authState);
	const { data: createMessage, mutateAsync: createMessageMutateAsync } = useCreateHrMessage()
	const { data, isLoading, mutateAsync: updateTicketMutateAsync } = useUpdateHrTicketStatus()
	const { data: updateNote, mutateAsync: updateNoteMutateAsync } = useUpdateHrNotes()
	const { data: createNote, mutateAsync: createNoteMutateAsync } = useCreateHrNote()
	const dataForNote = {
		"empId": empDetails.uuid,
		"ticketId": params?.id
	}
	const { data: notesById, isLoading: isLoadingnotesById } = useGetNoteByEmpId(dataForNote)
	const { data: assignedTo, isLoading: isLoadingAssignedTo, mutateAsync: updateAssignedMutateAsync } = useUpdateHrTicketAssignedTo()
	const { data: allAdminDetails, isLoading: isAllAdminDetailsLoading } = useGetAllHrTicketDetailsById(params?.id)
	const { data: allMessages, isLoading: isLoadingAllMessages } = useGetAllHrMessagesByTicketId(params?.id)
	const { data: allHrAdminEmployees, isLoadingHr } = useGetAllByEmployeeDepartmentId({ id: 5 })
	const { data: myRequests, isLoading: isMyRequestsLoading } = useGetAllHrTicketByEmpId(empDetails?.uuid);

	// const { data: allItAdminEmployees, isLoading: isLoadingAllItAdminEmployees } = useGetItAdminEmployees()
	// const { data: myRequests, isLoading: isLoadingMyRequests } = useGetAllHRTicketsById(empDetails?.id);
	const [assgnTo, setAssgnTo] = useState("")
	// const hrArrowClickHandler = (direction, curTicketId) => {

	// 	const curIndex = myRequests.findIndex(({ id }) => id == curTicketId);
	// 	if ((curIndex === 0 && direction === -1) || (curIndex === (myRequests.length - 1) && direction === 1))
	// 		return;
	// 	const nextTicketId = myRequests[(direction + curIndex + myRequests.length) % myRequests.length]?.id;
	// 	navigate(`/helpDesk/hr/request/${nextTicketId}`, { state: { access: 'employee' } });
	// }

	const hrArrowClickHandler = (direction, curTicketId) => {
		const curIndex = myRequests.findIndex(({ uuid }) => uuid === curTicketId);
		if ((curIndex === 0 && direction === -1) || (curIndex === (myRequests.length - 1) && direction === 1))
			return;
		const nextTicketId = myRequests[(direction + curIndex + myRequests.length) % myRequests.length]?.uuid;
		navigate(`/helpDesk/hr/request/${nextTicketId}`);
	}

	const enabledStyle = {
		background: '#F9FAFA 0% 0% no-repeat padding-box',
		borderBottom: '2px solid #176FFA',
	}
	const disabledStyle = {
		background: '#ffffff 0% 0% no-repeat padding-box',
		borderBottom: '1px solid #B4B7B9',
	}

	const handleOnSubmitMessage = (data) => {
		if ((writeSwitch === 'note' && data.messageNote.trim().length === 0) || (writeSwitch === 'reply' && data.messageReply.trim().length === 0)) {
			return;
		}
		const val = {
			"message": writeSwitch === 'note' ? data.messageNote : data.messageReply,
			"emp_uuid": empDetails?.uuid,
			"uuid": params?.id,
		}
		if (writeSwitch == "reply") {
			createMessageMutateAsync(val)
		} else {
			createNoteMutateAsync(val)
		}
		reset("")
	}

	const uploadMessage = async (e) => {
		setMessage(e.target.value)
	}

	const statusChangeHandler = (e) => {
		const val = {
			"uuid": params?.id,
			"current_ticket_tatus": e.target.value,
			"previous_ticket_status": allAdminDetails?.hr_ticket?.ticket_status,
			"priority": allAdminDetails?.hr_ticket?.priority,
			"empId": allAdminDetails?.hr_ticket?.emp_id,
			"empEmail": allAdminDetails?.email,
			"assignedTo": allAdminDetails?.hr_ticket?.assigned_to,
			"subject": allAdminDetails?.hr_ticket?.subject,
			"ticketDescription": allAdminDetails?.hr_ticket?.ticket_description,
		}
		updateTicketMutateAsync(val)
	}

	const assignedToChangeHandler = (assignedTo) => {
		const val = {
			"id": params?.id,
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
								<p className='ticketNo'>{allAdminDetails?.hr_ticket?.ticket_id}</p>
								<p className='subject'>{allAdminDetails?.hr_ticket?.subject}</p>
							</div>
							<div className='buttons'>
								<button className='progressBtn'>{allAdminDetails?.it_admin_ticket?.ticket_status}</button>
								<button className={`arrows leftArrow ${myRequests?.findIndex(({ uuid }) => uuid === params?.id) === 0 ? 'd-none' : ''}`} onClick={() => { hrArrowClickHandler(-1, params?.id) }}><RiArrowLeftLine /></button>
								<button className={`arrows rightArrow ${myRequests?.findIndex(({ uuid }) => uuid === params?.id) === myRequests?.length - 1 ? 'd-none' : ''}`} onClick={() => { hrArrowClickHandler(1, params?.id) }}><RiArrowRightLine /></button>
							</div>
						</div>
						<div className='cards'>
							{
								allMessages && allMessages.map((item, index) => (
									<div className='cardElement'>
										<div className='headPic'>
											<img src={item.sender_profile_photo} alt="" />
										</div>
										<div className='content'>
											<div className='titleAndSubject'>
												<p className='title'>{item.office_id} - {item.sender_full_name}</p>
												<p className='subject'>{item.hr_help_desk_message.message}</p>
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
								<Button className='submitButton' type='submit'>Submit</Button>
							</form>
						</div>
					</div>
				</Col>
				<Col className='col order-1 order-sm-1 order-md-2' xs={12} md={3}>
					<div className='sideBar'>
						<Row>
							<Col className='info' sm={6} xs={12} md={12} >
								<p className='header category'>Category</p>
								<p className='content'>HR Help Desk</p>
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
											allHrAdminEmployees && allHrAdminEmployees.employees && allHrAdminEmployees.employees.map((item) => (
												<option value={item.department_uuid}>{item.first_name} {item.last_name}</option>
											))
										}
									</select>
								</p>
							</Col>
						</Row>
					</div>
				</Col>
			</Row >
		</>
	)
}

export default Index
