
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../../../components/Breadcrumb'
import { Row, Col, Button, Table, Badge, Form, } from "react-bootstrap"

import { useUpdateTicketStatus } from '../../../../query/helpdesk/updateHelpDesk/updateHelpdeskQuery'
import './style.scss'
import Moment from 'moment';
import { RiFilterLine, RiLayoutGridLine, RiUser3Line, RiMenu3Fill, RiExternalLinkFill, RiUserAddLine, RiGitMergeLine, RiThumbUpFill, RiDeleteBin2Line } from 'react-icons/ri'
import { useGetAllHrTicket } from '../../../../query/hrHelpdesk/getHelpdesk/getHelpdeskQuery'
import { useNavigate } from 'react-router-dom'
const Card = React.lazy(() => import('./card/Index'))

const Index = () => {

	const { data: allTicketsForHrDashboard, isLoading } = useGetAllHrTicket()
	const { mutateAsync: updateMutateAsync } = useUpdateTicketStatus();
	const navigate = useNavigate();
	const [layout, setLayout] = useState('min');
	const [filterMode, setFilterMode] = useState(false);
	const [backButtonVisiblity, setBackButtonVisiblity] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState({})
	const [ids, setIds] = useState("");
	const handleSelectedTicket = (id, empId, subject, assignedTo, email, description) => {
		const val = {
			"id": id,
			"empId": empId,
			"empEmail": email,
			"assignedTo": assignedTo,
			"subject": subject,
			"ticketDescription": description ? description : ""
		}
		setSelectedTicket(val);
	}

	const filterClickHandler = () => {
		setFilterMode(true);
		setBackButtonVisiblity(true);
	}
	const backClickHandler = () => {
		setFilterMode(false);
		setBackButtonVisiblity(false);
	}

	const selectRow = {
		mode: 'checkbox',
		clickToSelect: true,
		classes: 'selection-row',
	};

	const handleOnClose = () => {
		const closeData = selectedTicket;
		closeData['ticketStatus'] = "Closed";
		updateMutateAsync(closeData)
	}

	const handleOnAssign = () => {
		const assignData = selectedTicket;
		assignData['ticketStatus'] = "Assign";
	}

	const handleOnDelete = () => {
		const deleteData = selectedTicket;
		deleteData['ticketStatus'] = "Delete";
		// updateMutateAsync(deleteData)
	}

	const handleOnMerge = () => {
		const mergeData = selectedTicket;
		mergeData['ticketStatus'] = "Merge";
		// updateMutateAsync(mergeData)
	}

	const handleOnEscalate = () => {
		const escalateData = selectedTicket;
		escalateData['ticketStatus'] = "In Progress";
		updateMutateAsync(escalateData)
	}

	return (
		<>
			<Row className='nav mb-2'>
				<Col xs={4}>
					<Breadcrumb />
				</Col>
				<Col xs={8} className="filter-buttons mb-2">
					<div className='list'>
						{/* <Button size='sm' variant='outline-secondary' onClick={layoutButtonClickHandler}>{layout === 'min' ? <RiLayoutGridLine /> : <RiMenu3Fill />}</Button> */}
						<Button size='sm' variant='outline-primary' onClick={filterClickHandler}><RiFilterLine /> Filter</Button>
						{
							backButtonVisiblity ?
								<Button size='sm' variant='outline-primary' onClick={backClickHandler}><RiExternalLinkFill /></Button>
								: ''
						}
					</div>
				</Col>
			</Row>
			<div className='allTickets'>
				{
					filterMode ?
						<Row className='tools-list mb-2'>
							<div className='list'>
								<button className='assign' onClick={handleOnAssign}><RiUserAddLine /> Assign</button>
								<button className='merge' onClick={handleOnMerge}><RiGitMergeLine /> Merge</button>
								<button className='escalate' onClick={handleOnEscalate}><RiMenu3Fill /> Escalate</button>
								<button className='close' onClick={handleOnClose}><RiThumbUpFill /> Close</button>
								<button className='delete' onClick={handleOnDelete}><RiDeleteBin2Line /> Delete</button>
							</div>
						</Row>
						:
						''
				}
				{
					// layout == 'grid' ?
					<>
						<Row className='cardHeader'>
							<Col className='cols casesCol'>Cases</Col>
							<Col className='cols categoryCol'>Category</Col>
							<Col className='cols statusCol'>Status</Col>
						</Row>
						{
							allTicketsForHrDashboard && allTicketsForHrDashboard.hr_ticket?.map(
								({ email, assigne_name, priority, subjectStatus, emp_name, office_id, status, hr_admin_ticket, profile_picture, uuid }) => {
									return <Row className={`card ${priority === 'Low' ? 'lowColor' : priority === 'Medium' ? 'mediumColor' : 'highColor'}`} onClick={() => navigate(`/helpDesk/hr/request/${hr_admin_ticket?.uuid}`, { state: { access: 'itAdmin' } })}>
										<Col className="cols nameCol">
											{/* <input className='checkbox' type='radio' name='ticket' onChange={(e) => {
												if (e.target.checked) {
													setIds(id);
													handleSelectedTicket(id, empId, subject, assignedTo, email, description);
													setFilterMode(true);
												} else {
													setFilterMode(false);
													setIds("")
												}
											}} /> */}
											<div className='headPic'>
												<img src={profile_picture} alt="" />
											</div>
											<div>
												<div>{office_id} - {assigne_name}</div>
											</div>
										</Col>
										<Col className='cols categoryCol'>
											HR Help Desk
										</Col>
										<Col className='cols statusCol' onClick={() => { }}>
											<p className={status == 'Open' ? 'badge openBadgeStyle' : status == 'Closed' ? 'badge closedBadgeStyle' : 'badge inProgressBadgeStyle'}>{'Open'}</p>
										</Col>
									</Row>
								})
						}
					</>
				}
			</div>
		</>
	)
}

export default Index