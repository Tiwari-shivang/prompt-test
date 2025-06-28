import React, { Suspense, useEffect, useState } from 'react'
import Breadcrumb from '../../../../components/Breadcrumb'
import { useRecoilValue } from "recoil"
import { authState } from '../../../../recoil/authRecoil'
import { Row, Col, Divider, Button, Table, Badge, Form, ListGroup } from "react-bootstrap"
import './style.scss'
import { RiFilterLine, RiLayoutGridLine, RiUser3Fill, RiMenu3Fill, RiExternalLinkFill, RiUserAddLine, RiGitMergeLine, RiThumbUpFill, RiDeleteBin2Line } from 'react-icons/ri'
import avatar1 from '../../../../assets/images/avatars/1.jpg'
import { useNavigate } from 'react-router-dom'
import Moment from 'moment';
import { Input } from '../../../widgets/formComponents/Input'
import { useParams } from 'react-router-dom'
import { useGetAllHrTicketByEmpId } from '../../../../query/hrHelpdesk/getHelpdesk/getHelpdeskQuery'
const Index = () => {
	const params = useParams();
	const navigate = useNavigate();
	const empDetail = useRecoilValue(authState)
	const [layout, setLayout] = useState('min');
	const { data: MyRequests, isLoading } = useGetAllHrTicketByEmpId(empDetail.uuid);
	const [filterMode, setFilterMode] = useState(false);
	const [backButtonVisiblity, setBackButtonVisiblity] = useState(false);
	const gridClickHandler = () => {
		setLayout('grid')
	}
	const minClickHandler = () => {
		setLayout('min')
	}
	const filterClickHandler = () => {
		setFilterMode(true);
		setBackButtonVisiblity(true);
	}
	const backClickHandler = () => {
		setFilterMode(false);
		setBackButtonVisiblity(false);
	}

	return (
		<>
			{/* <Sidebar /> */}
			<Row className='nav mb-2'>
				<Col xs={4}>
					<Breadcrumb />
				</Col>
				<Col xs={8} className="filter-buttons mb-2">
					<div class='list'>
						<Button size='sm' variant='outline-primary' onClick={filterClickHandler}><RiFilterLine /> Filter</Button>
						{
							backButtonVisiblity ?
								<Button size='sm' variant='outline-primary' onClick={backClickHandler}><RiExternalLinkFill /></Button>
								: ''
						}
					</div>
				</Col>
			</Row>
			<Row className='row'>
				<Col className='col order-2 order-sm-2 order-md-1' xs={12} md={filterMode ? 9 : 12}>
					<div className='my-request'>
						<Row className='cardHeader mb-2'>
							<Col className=''>REQUESTER</Col>
							<Col className=''>DATE</Col>
							<Col className=''>CATEGORY</Col>
							<Col className=''>PRIORITY</Col>
							<Col className=''>ASSIGNED TO</Col>
							<Col className=''>STATUS</Col>
						</Row>
						<Suspense>
							{
								MyRequests && MyRequests.map((item, index) => (
									<Card subcategory={item.subcategory} assignedTo={item.assigned_to} empId={item.emp_id} status={item.ticket_status} date={Moment(item.created_at).format('DD-MM-YYYY')} priority={item.priority} ticketNo={item.ticket_id} subject={item.subject} id={item.uuid} ></Card>
								))
							}
						</Suspense>

					</div>
				</Col>
				<Col className='col order-1 order-sm-1 order-md-2 filter' xs={12} md={filterMode ? 3 : 0}>
					{
						filterMode ?
							<>
								<Row>
									<Col sm={5} xs={12} md={12} className='filterRequest'>
										<p className='heading'>Filter Request</p>
										<Input className='searchBar px-2 mb-2' type="text" placeholder="Search in all tickets..." />
										<ul className='categories-list'>
											<li className='category' >Open<p className='badge badgeOpen'>15</p></li>
											<li className='category' >Pending<p className='badge badgePending'>15</p></li>
											<li className='category' >On hold<p className='badge badgeOnHold'>15</p></li>
											<li className='category' >Cancelled<p className='badge badgeCancelled'>15</p></li>
											<li className='category' >Closed<p className='badge badgeClosed'>15</p></li>
										</ul>
									</Col>
									<Col sm={7} xs={12} md={12} className='searchByAgent'>
										<p className='heading'>Search By Agent</p>
										<ul variant='flush' className='agents-list'>
											<li className='agents'>
												<div className='headPic'>
													<img src={avatar1} alt="" />
												</div>
												Vaishnav Dixit (E01234)
											</li>
											<li className='agents'>
												<div className='headPic'>
													<img src={avatar1} alt="" />
												</div>
												Vaishnav Dixit (E01234)
											</li>
											<li className='agents'>
												<div className='headPic'>
													<img src={avatar1} alt="" />
												</div>
												Vaishnav Dixit (E01234)
											</li>
											<li className='agents'>
												<div className='headPic'>
													<img src={avatar1} alt="" />
												</div>
												Vaishnav Dixit (E01234)
											</li>
											<li className='agents'>
												<div className='headPic'>
													<img src={avatar1} alt="" />
												</div>
												Vaishnav Dixit (E01234)
											</li>

										</ul>
									</Col>
								</Row>


							</> : ''
					}
				</Col>
			</Row>

		</>
	)
}

const Card = ({ subject, date, name, empId, ticketNo, status, subcategory, priority, assignedTo, id }) => {
	const getHexColor = () => status == 'Open' ? '#0275d8' : status == 'Closed' ? '#343a40' : status == 'In Progress' ? '#f0ad4e' : '#d9534f'
	const navigate = useNavigate();
	const overdueBadgeStyle = {
		border: '1px solid #ffdbe0',
		background: '#ffecf0',
		color: '#d14447',
	}
	const openBadgeStyle = {
		border: '1px solid #276ffa',
		background: 'none',
		color: '#276ffa',
	}
	const closedBadgeStyle = {
		border: '1px solid #767b80',
		background: 'none',
		color: '#767b80',
	}
	const inProgressBadgeStyle = {
		border: '1px solid #ffd52e',
		background: 'none',
		color: '#ffd52e',
	}
	return (
		<Row className='myRequestCardElement' onClick={() => navigate(`/helpDesk/hr/request/${id}`, { state: { access: 'employee' } })}>
			<Col className='cols first-col'>
				<div className='headPic'>
					<img src={avatar1} alt="" />
				</div>
				<div className='details' >
					{subject}
					<p>
						<b style={{ color: getHexColor() }}>Ticket No: {ticketNo}</b>
					</p>
				</div>
			</Col>
			<Col className='cols dateCol'>{date}</Col>
			<Col className='cols categoryCol'>{subcategory}</Col>
			<Col className='cols priorityCol'>{priority}</Col>
			<Col className='cols assignedToCol'>{assignedTo}</Col>
			<Col className='cols statusCol'>
				<p className='badge' style={
					status == 'Open' ? openBadgeStyle :
						status == 'Closed' ? closedBadgeStyle : inProgressBadgeStyle
				}>{status}</p>
			</Col>
		</Row>
	)
}

export default Index