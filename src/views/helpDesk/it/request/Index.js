import React, { useState } from 'react'
import { ButtonGroup, Col, Row } from 'react-bootstrap'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import avatar1 from '../../../../assets/images/avatars/1.jpg'
import './style.scss'
// import { requiredField } from '../../../utilits/validation'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { useCreateItNote, useCreateMessage } from '../../../../query/helpdesk/addHelpdesk/addHelpdeskQuery'
import { useGetAllAdminDetailsByTicketId, useGetAllMessagesByTicketId } from '../../../../query/helpdesk/getHelpdesk/getHelpdeskQuery'
import { useUpdateAssignedTo, useUpdateItNote, useUpdateTicketStatus } from '../../../../query/helpdesk/updateHelpDesk/updateHelpdeskQuery'
import { useGetAllTicketsById } from '../../../../query/members/allMembers/allMembersQuery'
import { authRoleState, authState } from '../../../../recoil/authRecoil'
// import {Input}
import { useGetAllByEmployeeDepartmentId } from '../../../../query/department/directory/query'
import RoleAccess from '../../../../utilits/RoleAccess'

const Index = () => {
	const params = useParams();
	const getRole = useRecoilValue(authRoleState)
	const authRoles = getRole && getRole?.Role
	const navigate = useNavigate();
	const [writeSwitch, setWriteSwitch] = useState('reply');
	const { register, handleSubmit, errors, reset, setValue, getValues, watch, clearErrors } = useForm();
	const empDetails = useRecoilValue(authState);
	const { data: createMessage, mutateAsync: createMessageMutateAsync } = useCreateMessage()
	const { data: createNote, mutateAsync: createNoteMutateAsync } = useCreateItNote()
	const { data: itNoteData, isLoading: isITNoteUpdateLoading, mutateAsync: updateITNoteMutateAsync } = useUpdateItNote()
	const { data, isLoading, mutateAsync: updateTicketMutateAsync } = useUpdateTicketStatus()
	const { data: assignedTo, isLoading: isLoadingAssignedTo, mutateAsync: updateAssignedMutateAsync } = useUpdateAssignedTo()
	const { data: allAdminDetailsCurTicket, isLoading: isAllAdminDetailsLoading } = useGetAllAdminDetailsByTicketId(params?.id)
	const { data: allMessages, isLoading: isLoadingAllMessages } = useGetAllMessagesByTicketId(params?.id)
	const { data: allItAdminEmployeesAssignTo, isLoading: isLoadingAllItAdminEmployees } = useGetAllByEmployeeDepartmentId({ id: 9 })
	const { data: myRequests, isLoading: isLoadingMyRequests } = useGetAllTicketsById(empDetails?.uuid);

	const [assignTo, setAssignTo] = useState("")

	const handleOnSubmitMessage = (data) => {
		if ((writeSwitch === 'note' && data.messageNote.trim().length === 0) || (writeSwitch === 'reply' && data.messageReply.trim().length === 0)) {
			return;
		}
		let newData = {}
		if (writeSwitch === 'note') {
			newData = {
				note: writeSwitch === 'note' ? data.messageNote : data.messageReply
			}
		} else {
			newData = {
				message: writeSwitch === 'note' ? data.messageNote : data.messageReply
			}
		}

		const val = {
			...newData,
			"emp_uuid": empDetails?.uuid,
			"uuid": params?.id,
		}
		if (writeSwitch === "reply") {
			createMessageMutateAsync(val)
		} else {
			createNoteMutateAsync(val)
		}
		reset("")
	}

	const itArrowClickHandler = (direction, curTicketId) => {
		const curIndex = myRequests.findIndex(({ id }) => id === curTicketId);
		if ((curIndex === 0 && direction === -1) || (curIndex === (myRequests.length - 1) && direction === 1))
			return;
		const nextTicketId = myRequests[(direction + curIndex + myRequests.length) % myRequests.length]?.uuid;
		navigate(`/helpDesk/it/request/${nextTicketId}`);
	}

	const statusChangeHandler = (e) => {
		const val = {
			"itAdmin_uuid": params?.id,
			"current_ticket_tatus": e.target.value,
			"previous_ticket_status": allAdminDetailsCurTicket?.it_admin_ticket?.ticket_status,
			"emp_uuid": empDetails?.uuid,
			"emp_email": allAdminDetailsCurTicket?.email,
			"assignedTo": allAdminDetailsCurTicket?.it_admin_ticket?.assigned_to,
			"subject": allAdminDetailsCurTicket?.it_admin_ticket.subject ? allAdminDetailsCurTicket?.it_admin_ticket.subject : '',
			"ticketDescription": allAdminDetailsCurTicket?.it_admin_ticket?.ticket_description
		}
		if (allAdminDetailsCurTicket?.it_admin_ticket?.assigned_to)
			updateTicketMutateAsync(val)
	}

	const assignedToChangeHandler = (assignedTo) => {
		setAssignTo(assignedTo)
		const val = {
			"uuid": params?.id,
			"assigned_to": assignedTo
		}
		updateAssignedMutateAsync(val)
	}

	return (
		<>
			<Row className='row'>
				<Col className='col order-sm-2 order-md-1' xs={12} md={9}>
					<div className='request'>
						<div className='firstCard'>
							<div className='info'>
								<div className='headPic'>
									<img src={empDetails.profile_picture} alt="" />
								</div>
								<p className='ticketNo'>{allAdminDetailsCurTicket?.it_admin_ticket?.ticket_id}</p>
								<p className='subject'>{allAdminDetailsCurTicket?.it_admin_ticket?.subject}</p>
							</div>
							<div className='buttons'>
								<button className='progressBtn'>{allAdminDetailsCurTicket?.it_admin_ticket?.ticket_status}</button>
								<button className={`arrows leftArrow ${myRequests?.findIndex(({ id }) => id === allAdminDetailsCurTicket?.it_admin_ticket?.id) == 0 ? 'd-none' : ''}`} onClick={() => itArrowClickHandler(-1, allAdminDetailsCurTicket?.it_admin_ticket?.id)}><RiArrowLeftLine /></button>
								<button className={`arrows rightArrow ${myRequests?.findIndex(({ id }) => id === allAdminDetailsCurTicket?.it_admin_ticket?.id) == myRequests?.length - 1 ? 'd-none' : ''}`} onClick={() => itArrowClickHandler(1, allAdminDetailsCurTicket?.it_admin_ticket?.id)}><RiArrowRightLine /></button>
							</div>
						</div>
						<div className='cards'>
							{
								allMessages && allMessages.map((item, index) => (
									<div className='cardElement'>
										<div className='headPic'>
											<img src={item.profile_picture} alt="" />
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
										className={writeSwitch === 'reply' ? 'selectedButton' : 'unselectedButton'}
									>Reply</button>
									<button
										onClick={() => {
											setWriteSwitch('note');
										}}
										className={writeSwitch === 'note' ? 'selectedButton' : 'unselectedButton'}
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
									defaultValue={allAdminDetailsCurTicket?.it_admin_ticket?.note}
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
								<button className='submitButton' type='submit' >Submit</button>
							</form>
						</div>
					</div>
				</Col>
				<Col className='col order-sm-1 order-md-2' xs={12} md={3}>
					<div className='sideBar'>
						<Row>
							<Col className='info' sm={6} xs={12} md={12} >
								<div>
									<div className='header'>
										Category
									</div>
									<div className='content'>
										IT Help Desk
									</div>
								</div>
								<div>
									<div className='header'>
										Change Status
									</div>
									<div className='content drop'>
										<select
											disabled={RoleAccess(authRoles, "adminFilter") ? false : true}
											className="dropdown-bar"
											value={allAdminDetailsCurTicket?.it_admin_ticket?.ticket_status}
											onChange={(e) => statusChangeHandler(e)}
										>
											<option >select</option>
											<option value="Open">Open</option>
											<option value="Pending">Pending</option>
											<option value="On Hold">On Hold</option>
											<option value="In Progress">In Progress</option>
											<option value="Closed">Closed</option>
										</select>
									</div>
								</div>
								<div>
									<div className='header'>
										Priority
									</div>
									<div className='content'>
										{allAdminDetailsCurTicket?.it_admin_ticket?.priority}
									</div>
								</div>
								<div>
									<div className='header'>
										Source of request
									</div>
									<div className='content'>
										Web
									</div>
								</div>
							</Col>
							<Col className='agentsList' sm={6} xs={12} md={12}>
								<p className='header'>Assigned To</p>
								<ul variant='flush' className='agents-list '>
									<li className='agents'>
										<div className='headPic'>
											<img src={avatar1} alt="" />
										</div>
										<p className='name'>{allAdminDetailsCurTicket?.name} ({allAdminDetailsCurTicket?.office_id})</p>
									</li>
								</ul>
								<div className='content'>
									<select
										type='select'
										className="dropdown-bar"
										// defaultValue={allAdminDetails?.it_admin_ticket?.emp_uuid}
										onChange={({ target: { value } }) => assignedToChangeHandler(value)}
										disabled={RoleAccess(authRoles, "adminFilter") ? false : true}
									>
										<option >Change Assignee</option>
										{allItAdminEmployeesAssignTo && allItAdminEmployeesAssignTo.employees.length > 0 ?
											allItAdminEmployeesAssignTo && allItAdminEmployeesAssignTo.employees && allItAdminEmployeesAssignTo.employees.map((item) => (
												<option value={item.uuid}>{item.first_name} {item.last_name}</option>
											))
											: <div>

											</div>
										}
									</select>
								</div>
							</Col>
						</Row>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default Index
