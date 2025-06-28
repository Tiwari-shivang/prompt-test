import React, { useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import { FaUserAlt } from 'react-icons/fa'
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import empProductivity from '../../../assets/images/empProductivity.svg'
import keyPerformer from '../../../assets/images/keyPerformer.svg'
import { useGetAllTrainees, useGetEmployeeCount, useGetEmployeeProductivity, useGetHexaviewBuzz, useGetNewHireTrendGraph, useGetNewJoinee, useGetTopPerformer } from '../../../query/members/allMembers/allMembersQuery'
import { useUpdateTraneeApproval } from '../../../query/members/updateMembers/updateMembersQuery'
import { authState } from "../../../recoil/authRecoil"
import Attendance from "../../commonComponent/attendance/Index"
import BirthdayCard from '../../commonComponent/birthdayCard/Index'
import Employee from '../../commonComponent/employee/Index'
import HexaviewBuzz from '../../commonComponent/hexaviewBuzzSlider/Index'
import LeaveApply from '../../commonComponent/leaveApply/Index'
import LeaveApproval from '../../commonComponent/leaveApproval/Index'
import ListOfEmployee from '../../commonComponent/listOfEmployee/Index'
import OnLeave from '../../commonComponent/onLeave/Index'
import PlacementDriveLinedUp from '../../commonComponent/placementDriveLinedUp/Index'
import QuickAccess from "../../commonComponent/quickAccess/Index"
import ResignationList from '../../commonComponent/resignationList/Index'
import TodoCard from '../../commonComponent/todoList/Index'
import TopPerformer from '../../commonComponent/topPerformer/Index'
import UpcomingHolidays from '../../commonComponent/upcomingHolidays/Index'
import WeatherAttendance from '../../commonComponent/weatherAttendance/Index'
import WorkAnniversary from '../../commonComponent/workAnniversary/Index'
import EmployeeStackedChart from '../../widgets/charts/employeStackedChart/StackedChart'

import './style.scss'
import CommonHeading from '../commonHeading/Index'

const HrDashboard = () => {
	const navigate = useNavigate()

	const [showTraineeModal, setShowTraineeModal] = useState(false)
	const [traineeId, setTraineeId] = useState()
	const [yearValue, setYearValue] = useState(2023)

	const { data: hiredTrend } = useGetNewHireTrendGraph(yearValue)
	const { data: newJoinee, isNewJoineeLoading } = useGetNewJoinee();
	const { data: allTrainees, isAllTraineesLoading } = useGetAllTrainees();
	const { data: totalEmployee, isLoading } = useGetEmployeeCount();
	const { data: topPerformerList, isLoading: istopPerformerList } = useGetTopPerformer();
	const { data: employeeProductivity, isLoading: isemployeeProductivity } = useGetEmployeeProductivity();
	const { data: hexaviewBuzz, isLoading: ishexaviewBuzz } = useGetHexaviewBuzz();
	const empDetail = useRecoilValue(authState)

	// table of new joinee
	const newJoineecolumns = [
		{
			text: 'Name',
			formatter: (cellContent, row) => (
				<div className='projectManager' >
					<div className='projectManagerPic'>
						{
							row && row?.profile_picture ? <img src={row?.profile_picture} alt="" /> : <FaUserAlt className='userIcon' />
						}
					</div>
					{/* <OverlayTrigger
						placement="top"
						delay={{ show: 250, hide: 400 }}
						overlay={
							<Tooltip id="button-tooltip">
								{row.first_name} {row.last_name}
							</Tooltip>
						}
					> */}
						<span>{row?.first_name} {row?.last_name}</span>
					{/* </OverlayTrigger> */}
				</div>
			),
		},
		{
			text: 'Position',
			headerStyle: {
				textAlign: "center"
			},
			formatter: (cellContent, row) => (

				// <OverlayTrigger
				// 	placement="top"
				// 	delay={{ show: 250, hide: 250 }}
					
				// >
					<div className="position">
						<div className='newJoineePosition'>{row?.designation_short_form}</div>
					</div>
				// </OverlayTrigger>

			),
		},
		{
			dataField: 'reporting_manager_name',
			text: 'Manager',
			formatter: (cellContent, row) => (
				<div className='projectManagerName'>
					{/* <OverlayTrigger
						placement="top"
						delay={{ show: 250, hide: 400 }}
						overlay={
							<Tooltip id="button-tooltip">
								{row.reporting_manager_name}
							</Tooltip>
						}
					> */}
						<span>{row?.reporting_manager_name}</span>
					{/* </OverlayTrigger> */}
				</div>
			),
		},
		{
			dataField: 'date_of_joining',
			text: 'Date of Joining',
		},
	]

	const handleNewJoineeDetail = (id) => {
		navigate(`/members/memberDetail/${id}`)
	}

	const traineeApproved = (e, id) => {
		if (e.target.checked) {
			setShowTraineeModal(true)
			setTraineeId(id)
		}
	}
	//   trainee status 
	const traineeApproval = [
		{
			//   dataField: 'first_name',
			text: 'Name',
			formatter: (cellContent, row) => (
				<div className="name" onClick={() => handleNewJoineeDetail(row.uuid)}>
					{/* <OverlayTrigger
						placement="top"
						delay={{ show: 250, hide: 400 }}
						overlay={
							<Tooltip id="button-tooltip">
								{row?.first_name} {row?.last_name}
							</Tooltip>
						}
					> */}
						{row.first_name} {row.last_name}
					{/* </OverlayTrigger> */}

				</div>
			),
		},
		{
			dataField: 'date_of_joining',
			text: 'Date of Joining',
		},
		{
			dataField: 'date_of_confirmation',
			text: 'Date of Completion',
		},
		{
			//   dataField: 'status',
			text: 'Status',
			formatter: (cellContent, row) => (
				<div className="toggleButton">
					<div class="form-check form-switch">
						<input class="form-check-input" type="checkbox" checked={false} onClick={(e) => traineeApproved(e, row.uuid)} />
					</div>
				</div>
			),
		},
	]

	const handleNewHiredTrend = (e) => {
		setYearValue(e.target.value)
	}

	return (
		<div className="hrDashboard">
			<Row>
			    <CommonHeading/>
				<Col xs={4} md={6} className="px-2 mb-3 mb-lg-0">
					<LeaveApply />
				</Col>
				<Col xs={8} md={6} className="mb-3">
					< WeatherAttendance />
				</Col>
				<Col xs={12} sm={12} md={6} lg={6} xl={4} className="px-2 mb-3">
					<Employee />
				</Col>
				<Col xs={12} sm={12} md={6} lg={6} xl={5} className="px-2 mb-3">
					<div className='totalProject cardShadow'>
						<div className='totalEmployeeSection'>
							<div className='title'>
								<p onClick={() => navigate('/members/memberList')}>New Hired Trend</p>
							</div>
							<div className='total'>
								<p>Employee Count: {totalEmployee?.total}</p>
							</div>
						</div>
						<div className='currentProject'>
							{/* <p>Currently running <span>13 projects</span></p> */}
							<div className='selctDuration'>
								<p>Year</p>
								<select
									className="form-control"
									name="departmentHead"
									onChange={(e) => { handleNewHiredTrend(e) }}
								>
									<option value="2023">2023</option>
									<option value="2022">2022</option>
									<option value="2021">2021</option>
									<option value="2020">2020</option>
									<option value="2019">2019</option>
									<option value="2018">2018</option>
									<option value="2017">2017</option>
									<option value="2016">2016</option>
									<option value="2015">2015</option>
									<option value="2014">2014</option>
									<option value="2013">2013</option>
									<option value="2012">2012</option>
									<option value="2011">2011</option>
								</select>
							</div>
						</div>
						<EmployeeStackedChart data={hiredTrend ? hiredTrend : []} />
					</div>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12} xl={3} className="px-2 mb-3">
					<div className='productivityKeySection cardShadow'>
						<div className='employeeProductivity'>
							<div className='img'>
								<img src={empProductivity} alt="" />
							</div>
							<div className='detail'>
								<p>Employee Productivity</p>
								<p><span>{parseFloat(employeeProductivity).toFixed(2)}%</span> Increased</p>
							</div>
						</div>
						<div className='employeeProductivity'>
							<div className='img'>
								<img src={keyPerformer} alt="" />
							</div>
							<div className='detail'>
								<p>Key Performer</p>
								<p><span>4%</span> Increased</p>
							</div>
						</div>
					</div>
				</Col>
				<Col xs={12} sm={12} md={12} lg={8} xl={6} className="px-2 mb-3">
					<HexaviewBuzz />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
					<TodoCard />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
					<LeaveApproval />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className=" workCol px-2 mb-3">
					<WorkAnniversary />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
					<BirthdayCard />
				</Col>

				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
					<Attendance />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
					<QuickAccess />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
					<ListOfEmployee />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
					<ResignationList />
				</Col>
				<Col xs={12} sm={12} md={12} lg={8} xl={6} className="px-2 mb-3">
					<div className='projectSummary cardShadow'>
						<div className='titleSection'>
							<div className='cardCustomTitle'>
								New Joinee
							</div>
							<div className="hiddenDiv"></div>
						</div>
						<div className='summaryTable'>
							<BootstrapTable
								keyField="id"
								data={newJoinee ? newJoinee : []}
								columns={newJoineecolumns}
								condensed
							/>
						</div>
					</div>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12} xl={9} className="px-2 mb-3">
					<PlacementDriveLinedUp isFullPage={false} />
				</Col>
				<Col xs={12} sm={12} md={12} lg={12} xl={9} className="px-2 mb-3">
					<div className='projectSummary cardShadow'>
						<div className='titleSection'>
							<div className='cardCustomTitle'>
								Trainee Approval
							</div>
						</div>
						{(allTrainees && allTrainees.length > 0) ?
							<div className='summaryTable'>
								<BootstrapTable
									keyField="id"
									data={allTrainees ? allTrainees : []}
									columns={traineeApproval}
									condensed
								/>
							</div>
							:
							<div className='dataNotFound'>
								<p>No Trainee for approval</p>
							</div>
						}
					</div>
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
					<TopPerformer />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
					<OnLeave />
				</Col>
				<Col xs={12} sm={12} md={6} lg={4} xl={3} className="px-2 mb-3">
					<UpcomingHolidays />
				</Col>

			</Row>
			<TraineeApprovedModal
				modalOpen={showTraineeModal}
				modalClose={() => setShowTraineeModal(false)}
				id={traineeId}
			/>
		</div>
	)
}

export const TraineeApprovedModal = (props) => {
	const { modalOpen, modalClose, id } = props

	const { data, isLoading, mutateAsync } = useUpdateTraneeApproval()

	const traineApprovalHandler = (e) => {
		e.preventDefault()
		mutateAsync(id)
		modalClose()
	}
	return (
		<>
			<Modal
				className="commonModal"
				show={modalOpen}
				onHide={modalClose}
				centered
			>
				<Modal.Header closeButton >
					<Modal.Title>Trainee Approval</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row className="my-3">
						<Col sm={12}>
							<p>Are you sure want to approve this trainee ?</p>
						</Col>
					</Row>
					<Row className="mt-4 mb-2">
						<Col sm={12}>
							<div className='buttonSection'>
								<Button variant="primary" onClick={(e) => traineApprovalHandler(e)}>
									Yes
								</Button>
								<Button variant="outline-danger" onClick={modalClose}>
									Cancel
								</Button>
							</div>
						</Col>
					</Row>
				</Modal.Body>
			</Modal>
		</>
	)
}

export default HrDashboard