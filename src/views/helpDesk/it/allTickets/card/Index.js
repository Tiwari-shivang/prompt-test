import React, { useEffect } from 'react'
import './style.scss'
import avatar1 from '../../../../../assets/images/avatars/1.jpg'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'

const Index = ({ handleSelectedTicket, setIds, setFilterMode, subject, priority, assignedTo, subjectStatus, date, name, empId, ticketNo, status, id, email, description, office_id, profile_picture }) => {
	const getHexColor = () => status == 'Open' ? '#0275d8' : status == 'Closed' ? '#343a40' : status == 'In Progress' ? '#f0ad4e' : '#d9534f'
	const getPriorityColor = () => priority == 'Low' ? '#6dd400' : priority == 'Medium' ? '#276ffa' : priority == 'High' ? '#ffd012' : '#ff6262';
	const navigate = useNavigate()

	return (
		<>
			<Row className={`card ${priority === 'Low' ? 'lowColor' : priority === 'Medium' ? 'mediumColor' : 'highColor'}`} onClick={() => navigate(`/helpDesk/it/request/${id}`, { state: { access: 'itAdmin' } })}>
				<Col className="requesterCol">
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
						{
							profile_picture ?
								<img src={profile_picture} alt="" />
								:
								<img src={avatar1} alt="" />
						}
					</div>
					<div>{office_id} {name}</div>
				</Col>
				<Col className='subjectCol other-col'>
					<p className='badge overdueBadgeStyle' >{subjectStatus}</p>
					<div>{subject}</div>
					<div style={{ color: getHexColor() }}><b>Ticket No.{ticketNo}</b></div>
				</Col>
				<Col className='dateCol other-col'>{date}</Col>
				<Col className='categoryCol other-col'>IT Help Desk</Col>
				<Col className='priorityCol other-col'><b>{priority}</b></Col>
				<Col className='assignedToCol other-col'>{assignedTo ? assignedTo : "Yet to assign..."}</Col>
				<Col className='statusCol other-col'>
					<p className={status == 'Open' ? 'badge openBadgeStyle' : status == 'Closed' ? 'badge closedBadgeStyle' : 'badge inProgressBadgeStyle'}>{status}</p>
				</Col>
			</Row>
		</>
	)
}

export default Index
