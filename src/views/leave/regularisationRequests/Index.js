
import Moment from 'moment'
import React, { useState } from 'react'
import { Col, Row } from "react-bootstrap"
import BootstrapTable from 'react-bootstrap-table-next'
import { useRecoilValue } from 'recoil'
import avatar1 from '../../../assets/images/avatars/1.jpg'
import Breadcrumb from '../../../components/Breadcrumb'
import { authState } from '../../../recoil/authRecoil'
import './style.scss'

const Index = () => {
	const empDetail = useRecoilValue(authState)
	const [getAllLeaves, setGetAllLeaves] = useState({
		"id": empDetail.uuid,
		"type": "history",
	})
	const { data: allLeaves, isLoading: isLeavesLoading } = (getAllLeaves);
	const columns = [
		{
			text: 'Employee',
			formatter: (cellContent, row) => (
				<div className="requesterCol">
					<div className='headPic'>
						{
							empDetail && empDetail.profile_picture ? <img src={empDetail.profile_picture} alt="" /> : <img src={avatar1} alt="" />
						}
					</div>
					{empDetail.first_name} {empDetail.office_id}
				</div>
			),
		},
		{
			dataField: 'leave_type',
			text: 'Leave Type',
			formatter: (cellContent, row) => (
				<div className='leaveTypeCol'>
					{cellContent}
				</div>
			),
		},
		{
			dataField: 'reason',
			text: 'Reason',
			formatter: (cellContent, row) => (
				<div className='typeCol'>
					{cellContent}
				</div>
			),
		},
		{
			text: 'Leave Period',
			formatter: (cellContent, row) => (
				<div className='leavePeriodCol'>
					{Moment(row.leave_date).format('L')} - {Moment(row.leave_to_date).format('L')}
				</div>
			),
		},
		{
			dataField: 'days',
			text: 'Days',
			formatter: (cellContent, row) => (
				<div className='DaysHoursTakenCol'>
					{cellContent ? cellContent : ""}
				</div>
			),
		},
		{
			dataField: 'dateOfRequest',
			text: 'Date of Request',
			formatter: (cellContent, row) => (
				<div className='datOfRequestCol'>
					{cellContent}
				</div>
			),
		},
		{
			dataField: 'leave_status',
			text: 'Status',
			formatter: (cellContent, row) => (
				<div className='statusCol'>
					{cellContent}
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
			</Row>
			<div className='leaveApplications'>
				<BootstrapTable
					keyField="id"
					data={allLeaves ? allLeaves : []}
					columns={columns}
					condensed
				/>
			</div>
		</>
	)
}

export default Index