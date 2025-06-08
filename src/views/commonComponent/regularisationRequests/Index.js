
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../../components/Breadcrumb'
import { Row, Col, Button, Table, Badge, Form, SplitButton } from "react-bootstrap"
import BootstrapTable from 'react-bootstrap-table-next'
import avatar1 from '../../../assets/images/avatars/1.jpg'
import { BsTrash, BsGrid } from "react-icons/bs"
import { FaFilter, FaEllipsisH, FaChevronLeft, FaChevronRight, FaArrowAltCircleRight, FaArrowRight } from 'react-icons/fa'
import { BiEdit } from "react-icons/bi"
import './style.scss'
import Moment from 'moment';
import { RiFilterLine, RiLayoutGridLine, RiUser3Line, RiMenu3Fill, RiExternalLinkFill, RiUserAddLine, RiGitMergeLine, RiThumbUpFill, RiDeleteBin2Line } from 'react-icons/ri'
import { useGetRegularizationByPmId, useUpdateRegularizationRequest } from '../../../query/regularization/regularizationQuery'
import { useRecoilValue } from 'recoil'
import { authState } from '../../../recoil/authRecoil'

const Index = () => {
	const empDetail = useRecoilValue(authState);
	const { data: regularizationList, isLoading } = useGetRegularizationByPmId({ emp_uuid: empDetail && empDetail.uuid, isRequest: true });
	const { isLoadingRequest, mutateAsync } = useUpdateRegularizationRequest()

	const updateRequest = (state, data) => {
		const details = {
			id: data.attendance_id,
			pm_review: state,
			emp_uuid: data.employee.id
		}
		mutateAsync(details)
	}

	const columns = [
		{
			text: 'Employee',
			formatter: (cellContent, row) => (
				<div className="employeeCol">
					<div className='headPic'>
						{
							<img src={row && row.employee && row.employee.profile_picture} alt="" />
						}
					</div>
					{row && row.employee && row.employee.first_name} {row && row.employee && row.employee.last_name}
				</div>
			),
		},
		{
			dataField: 'reg_date',
			text: 'Attendance Day',
			formatter: (cellContent, row) => (
				<div className='attendanceDayCol'>
					{row && row.reg_date}
				</div>
			),
		},
		{
			text: (
				<div className='hourHeader'>
					<div>HOUR(s)</div>
					<div>(Old - New)</div>
				</div>
			),
			formatter: (cellContent, row) => (
				<>
					{row.prev_total_time} - {row.reg_total_time}
				</>
			),
		},
		{
			// dataField: 'state',
			text: (
				<div className='statusHeader'>
					<div>Status</div>
					<div>(Old - New)</div>
				</div>
			),
			formatter: (cellContent, row) => (
				<>
					{row.prev_attendance_Status} - {row.reg_attendance_status}
				</>
			),
		},
		{
			dataField: 'reason',
			text: 'Reason',
			formatter: (cellContent, row) => (
				<div className='reasonCol'>
					{cellContent}
				</div>
			),
		},
		{
			text: 'Action',
			formatter: (cellContent, row) => (
				<div className='actionCol'>
					<button className='approveBtn btn btn-primary btn-sm' onClick={() => updateRequest("Approved", row)}>Approve</button>
					<button className='rejectBtn btn btn-danger btn-sm' onClick={() => updateRequest("Rejected", row)}>Reject</button>
				</div>
			),
		},
	]

	return (
		<>
			<Row className='nav mb-2'>
				<Col xs={4}>
					<Breadcrumb />
				</Col>
				<Col xs={8} className="filter-buttons mb-2">
				</Col>
			</Row>
			<div className='allrequestsPage'>
				<div className='headerRowMain'>
					<div className='myRequestsText'>
						<div className="cardCustomTitle">
							Regularisation Requests
						</div>
					</div>
					<div className='dateNav'>
						<button><FaChevronLeft /></button>
						<div className='dateInfo'>01-Jan-2022 - 31-Dec-2022</div>
						<button><FaChevronRight /></button>
					</div>
					<div className='headerButtons'>
						<button class="filterBtn btn btn-outline-primary btn-sm" ><FaFilter /></button>
						<button class="ellipsisBtn btn btn-outline-primary btn-sm" ><FaEllipsisH /></button>
					</div>
				</div>
				<BootstrapTable
					keyField="id"
					data={regularizationList ? regularizationList : []}
					columns={columns}
					condensed
				/>
			</div>
		</>
	)
}

export default Index