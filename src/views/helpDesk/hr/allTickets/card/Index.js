import React, { useEffect } from 'react'
import './style.scss'
import avatar1 from '../../../../../assets/images/avatars/1.jpg'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Index = ({ handleSelectedTicket, setIds, setFilterMode, subject, priority, assignedTo, subjectStatus, date, name, empId, ticketNo, status, id, email, description, office_id , profile_picture}) => {
	const getHexColor = () => status == 'Open' ? '#0275d8' : status == 'Closed' ? '#343a40' : status == 'In Progress' ? '#f0ad4e' : '#d9534f'
	const getPriorityColor = () => priority == 'Low' ? '#6dd400' : priority == 'Medium' ? '#276ffa' : priority == 'High' ? '#ffd012' : '#ff6262';
	const navigate = useNavigate()

	return (
		<>
			<div className={`card ${priority==='Low'?'lowColor':priority==='Medium'?'mediumColor':'highColor'}`} onClick={() => navigate(`/helpDesk/hr/request/${id}`,{state:{access:'itAdmin'}})}>
				<div className="cols nameCol">
				<input className='checkbox' type='radio' name='ticket' onChange={(e) => {
						if (e.target.checked) {
							setIds(id);
							handleSelectedTicket(id, empId, subject, assignedTo, email, description);
							setFilterMode(true);
						} else {
							setFilterMode(false);
							setIds("")
						}
					}} />
					<div className='headPic'>
						<img src={profile_picture} alt="" />
					</div>
					<div>
						<div>{office_id} - {name}</div>
					</div>
				</div>
				<div className='cols categoryCol'>
					HR Help Desk
				</div>
				<div className='cols statusCol' onClick={() => { }}>
					<p className={status == 'Open' ? 'badge openBadgeStyle' : status == 'Closed' ? 'badge closedBadgeStyle' : 'badge inProgressBadgeStyle'}>{'Open'}</p>
				</div>
			</div>
		</>
	)
}

export default Index
