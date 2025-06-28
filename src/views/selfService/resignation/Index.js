
import React from 'react'
import { Button, Col, Row } from "react-bootstrap"
import BootstrapTable from 'react-bootstrap-table-next'
import { RiAddLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import Breadcrumb from '../../../components/Breadcrumb'
import { useGetResignation } from '../../../query/resignation/allResignation/allResignationQuery'
import { authState } from '../../../recoil/authRecoil'
import './style.scss'
// const Card = React.lazy(() => import('./allTickets/card/Index'))

const Index = () => {
	const navigate = useNavigate();
	const empDetail = useRecoilValue(authState)
	const { data: MyResignation, isLoading } = useGetResignation(empDetail && empDetail.uuid);
	const addRecordClickHandler = () => {
		navigate('/selfService/resignation/addResignation')
	}
	const data = [
		{
			status: 'Approved',
			dateOfResignation: '12-15-2022',
			reasonForLeaving: 'Higher Studies',
			requestedLastWorkingDay: '12-15-2022',
			withdraw: true,
		}
	]
	const columns = [
		{
			dataField: 'status',
			text: 'Status',
		},
		{
			dataField: 'date_of_resignation',
			text: 'Date of Resignation',
		},
		{
			dataField: 'reason_for_leaving',
			text: 'Reason for leaving',
		},
		{
			dataField: 'requested_last_date',
			text: 'Requested last working day',
		},
		{
			dataField: 'withdraw',
			text: 'Withdraw',
		},
		{
			// dataField: 'reasonForWithdrawal',
			text: 'Action',
			formatter: (cellContent, row) => (
				<div className="actionCol">
					<button type='button' className='btn btn-primary' onClick={() => {
						navigate('/selfService/resignation/resignationDetails', {
							state: {details:row }
						})
					}}>View Details</button>
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
					<Button size='sm' variant='outline-primary' onClick={addRecordClickHandler} ><RiAddLine /> Add Record</Button>
				</Col>
			</Row>
			<div className='resignation'>
				<BootstrapTable
					keyField="id"
					data={MyResignation ? MyResignation : []}
					columns={columns}
					condensed
				/>
			</div>

		</>
	)
}

export default Index