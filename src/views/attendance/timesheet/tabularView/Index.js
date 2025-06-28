import Moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from "react-bootstrap"
import BootstrapTable from 'react-bootstrap-table-next'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import Breadcrumb from '../../../../components/Breadcrumb'
import { useGetAttendanceListView } from '../../../../query/attendance/attendanceQuery'
import { authState } from '../../../../recoil/authRecoil'

import './style.scss'


const Index = () => {
	const navigate = useNavigate()
	const empDetail = useRecoilValue(authState)
	const [bugModalVisible, setBugModalVisible] = useState(false);
	const [key, setKey] = useState('listView');
	const [credential, setCredential] = useState({
		"empUuid": "",
		"startDate": "",
		"endDate": ""
	});

	useEffect(() => {
		var curr = new Date;
		var first = curr.getDate() - curr.getDay();
		var last = first + 6;

		var sundayDate = new Date(curr.setDate(first));
		var saturdayDate = new Date(curr.setDate(last));
		setCredential({ "empUuid": empDetail && empDetail.uuid, "startDate": Moment(sundayDate).format('DD-MM-YYYY'), "endDate": Moment(saturdayDate).format('DD-MM-YYYY') })
	}, [])


	const data = [
		{
			day: 'asfasfd',
			title: '00:00am',
			weekend: true,
		},
		{
			day: 'asfasfd',
			title: '00:00am',
			weekend: false,
		},
		{
			day: 'asfasfd',
			title: '00:00am',
			weekend: false,
		},
		{
			day: 'asfasfd',
			title: '00:00am',
			weekend: false,
		},
		{
			day: 'asfasfd',
			title: '00:00am',
			weekend: false,
		},
		{
			day: 'asfasfd',
			title: '00:00am',
			weekend: false,
		},
		{
			day: '1',
			title: '00:00am',
			weekend: true,
		}
	]
	
	const columnTabularView = [
		{
			// dataField: 'day',
			text: 'Date',
			formatter: (cellContent, row) => (
				<div className='dateCol'>
					Mon, 19-Mar-2023
				</div>
			),
		},
		{
			dataField: 'title',
			text: 'First In',
			formatter: (cellContent, row) => (
				<div className='checkInCol'>
					00:00am
				</div>
			),
		},
		{
			dataField: 'title',
			text: 'Last Out',
			formatter: (cellContent, row) => (
				<div className='checkInCol'>
					00:00am
				</div>
			),
		},
		{
			dataField: '',
			text: 'Total hours',
			formatter: (cellContent, row) => (
				<div className="totalHoursCol" >
					00:00
				</div>
			),
		},
		{
			dataField: '',
			text: 'Payable hours',
			formatter: (cellContent, row) => (
				<div className="payableHoursCol" >
					00:00
				</div>
			),
		},
		{
			dataField: '',
			text: 'Status',
			formatter: (cellContent, row) => (
				<div className="statusCol" >
					Weekend
				</div>
			),
		},
		{
			dataField: '',
			text: 'Shift',
			formatter: (cellContent, row) => (
				<div className="shiftCol" >
					General (10 : 00 AM-07 : 00 PM)
				</div>
			),
		},

		{
			dataField: '',
			text: 'Regularisation',
			formatter: (cellContent, row) => (
				<div className='regularisationCol'>
					-
				</div>
			),
		},

	]

	return (
		<Container>
			<Row className='nav mb-2'>
				<Col xs={6}>
					<Breadcrumb />
				</Col>
				<Col xs={6} className="">
				</Col>
			</Row>
			<Row className='timesheet'>
				<Col xs={12} className='headerRowMain'>
					<div className='dateNav'>
						<Button><FaChevronLeft /></Button>
						<div className='dateInfo'>01-Jan-2022 - 31-Dec-2022</div>
						<Button><FaChevronRight /></Button>
					</div>
					<BootstrapTable
						keyField="employee_id"
						wrapperClasses='tabularTable'
						data={data}
						columns={columnTabularView}
						condensed
						bordered={false}
					/>
				</Col>
			</Row>
		</Container>
	)
}

export default Index
