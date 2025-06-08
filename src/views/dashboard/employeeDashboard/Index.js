
import React, { useState } from "react"
import { Col, Row } from 'react-bootstrap'
import { useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { authRoleState, authState } from "../../../recoil/authRecoil"
import BirthdayCard from '../../commonComponent/birthdayCard/Index'
import HexaviewBuzz from '../../commonComponent/hexaviewBuzzSlider/Index'
import LeaveApply from '../../commonComponent/leaveApply/Index'
import NewJoinee from '../../commonComponent/newJoinee/Index'
import UpcomingHolidays from '../../commonComponent/upcomingHolidays/Index'
import WeatherAttendance from '../../commonComponent/weatherAttendance/Index'
import QuickAccess from "../../commonComponent/quickAccess/Index"
import { useGetMembersById, useGetNewJoinee } from '../../../query/members/allMembers/allMembersQuery'
import { useGetAllquickAccess } from "../../../query/quickAccess/quickAccessQuery"
import RoleAccess from "../../../utilits/RoleAccess"
import Attendance from "../../commonComponent/attendance/Index"
import LeaveApproval from '../../commonComponent/leaveApproval/Index'
import ListOfEmployee from "../../commonComponent/listOfEmployee/Index"
import TodoList from "../../commonComponent/todoList/Index"
import TopPerformer from "../../commonComponent/topPerformer/Index"
import WorkAnniversary from "../../commonComponent/workAnniversary/Index"
import ListOfMentees from "../../commonComponent/listOfMentees/Index"
import ListOfMentors from '../../commonComponent/listOfMentors/Index'
import PendingRequests from "../../commonComponent/pendingrequests/Index"
import './style.scss'
import CommonHeading from "../commonHeading/Index"
import AssignedProjects from "../../commonComponent/assignedProjects/Index"

const EmployeeDashboard = () => {
	const navigate = useNavigate()
	const empDetail = useRecoilValue(authState)
	const { data: getByIdDetails, isLoading:MemberData, refetch } = useGetMembersById(empDetail && empDetail.uuid);
	const { data: newJoinee, isNewJoineeLoading } = useGetNewJoinee();
	const [showAddQuickModal, setShowAddQuickModal] = useState(false)
	const { data: dataAllQuickAccess } = useGetAllquickAccess();
	const getRole = useRecoilValue(authRoleState)
	const authRoles = getRole && getRole?.Role

	const goToList = (data) => {
		navigate('/dashboard/list', { state: data })
	}

	const handleNewJoineeDetail = (id) => {
		navigate(`/members/memberDetail/${id}`)
	}

	return (
		<div className="employeeDashboard container">
			<Row>
			<CommonHeading/>
				<Col xs={12} sm={12} md={12} lg={12} xl={12} className="px-2 mb-3 ">
					<AssignedProjects />
				</Col>
				{/* <Col xs={12} className="px-2 mb-3 mb-lg-0">
					<LeaveApply />
				</Col> */}
			</Row>
			{/* <Row>
				<Col xs={12} >
					<h6 className="heading">Welcome {empDetail.first_name} {empDetail.last_name}</h6>
				</Col>
				<Col xs={12} lg={4} className="px-2">
					<WeatherAttendance />
				</Col>
			</Row>
			<Row className="my-4">
				<Col xs={12} sm={12} md={12} lg={8} xl={6} className="px-2 mb-3 mb-xl-0">
					<HexaviewBuzz />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
					<NewJoinee />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
					<ListOfMentees />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
					<ListOfMentors />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
					<PendingRequests />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3 ">
					<WorkAnniversary />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
					<BirthdayCard />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3 ">
					<ListOfEmployee />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3 ">
					<TopPerformer />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3 mb-md-0">
					<QuickAccess />
				</Col>
				<Col xs={12} sm={6} lg={4} xl={3} className="px-2">
					<UpcomingHolidays />
				</Col>
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className=" px-2 mb-3">
					<TodoList />
				</Col>
				{
					RoleAccess(authRoles, "itHelpDesk") ? (
						<Col xs={12} sm={6} md={6} lg={4} xl={3} className=" px-2 mb-3">
							<LeaveApproval />
						</Col>
					) : ""
				}
				<Col xs={12} sm={6} md={6} lg={4} xl={3} className=" px-2 mb-3">
					<Attendance />
				</Col>
			</Row> */}
		</div>
	)
}

export default EmployeeDashboard