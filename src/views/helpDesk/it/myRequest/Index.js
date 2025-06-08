import React, { useState } from 'react'
import { Button, Col, Row } from "react-bootstrap"
import { RiExternalLinkFill, RiFilterLine } from 'react-icons/ri'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from "recoil"
import avatar1 from '../../../../assets/images/avatars/1.jpg'
import Breadcrumb from '../../../../components/Breadcrumb'
import { useGetAllTicketsById } from '../../../../query/members/allMembers/allMembersQuery'
import { authState } from '../../../../recoil/authRecoil'
import { Input } from '../../../widgets/formComponents/Input'
import './style.scss'

const Index = () => {
	const params = useParams();
	const navigate = useNavigate();
	const empDetail = useRecoilValue(authState)

	const [layout, setLayout] = useState('min');
	const { data: MyRequests, isLoading } = useGetAllTicketsById(empDetail.uuid);
	const [filterMode, setFilterMode] = useState(false);
	const [backButtonVisiblity, setBackButtonVisiblity] = useState(false);
	const getHexColor = (status) => status == 'Open' ? '#0275d8' : status == 'Closed' ? '#343a40' : status == 'In Progress' ? '#f0ad4e' : '#d9534f'

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
						<Row className='cardHeader'>
							<Col className='cols requesterCol'>REQUESTER</Col>
							<Col className='cols dateCol'>DATE</Col>
							<Col className='cols categoryCol'>CATEGORY</Col>
							<Col className='cols priorityCol'>PRIORITY</Col>
							<Col className='cols assignedToCol'>ASSIGNED TO</Col>
							<Col className='cols statusCol'>STATUS</Col>
						</Row>
						{
							MyRequests && MyRequests.map((item, index) => (
								<>
									{/* <Card assignedTo={""} empId={item?.emp.uuid} status={item?.ticket_status} date={Moment(item?.it_admin_ticket?.created_at).format('DD-MM-YYYY')} priority={item?.it_admin_ticket?.priority} ticketNo={item?.it_admin_ticket?.ticket_id} subject={item?.it_admin_ticket?.subject} subcategory={item?.it_admin_ticket?.subcategory} id={item?.it_admin_ticket?.id} ></Card> */}
									<Row className='myRequestCardElement' onClick={() => navigate(`/helpDesk/it/request/${item.uuid}`, { state: { access: 'employee' } })}>
										<Col className='cols first-col'>
											<div className='headPic'>
												<img src={avatar1} alt="" />
											</div>
											<div className='details' >
												<p>{item.subject}</p>
												<p >
													<b style={{ color: getHexColor() }}>Ticket Number: {item.ticket_id}</b>
												</p>
											</div>
										</Col>
										<Col className='cols dateCol'>{item.created_at.substring(0, 10)}</Col>
										<Col className='cols categoryCol'>{item.subcategory}</Col>
										<Col className='cols priorityCol'>{item.priority}</Col>
										<Col className='cols assignedToCol'>{item.assigned_to}</Col>
										<Col className='cols statusCol'>
											{item.ticket_status}
										</Col>
									</Row>
								</>
							))
						}
					</div>
				</Col>
				<Col className='col order-1 order-sm-1 order-md-2 filter' xs={12} md={filterMode ? 3 : 0}>
					{
						filterMode ?
							<>
								<Row>
									<Col sm={5} xs={12} md={12} className='filterRequest'>
										<p className='heading'>Filter Request</p>
										<Input className='form-control search-bar' type="text" placeholder="Search in all tickets..." />
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

export default Index