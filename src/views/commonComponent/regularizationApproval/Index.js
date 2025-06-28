import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Breadcrumb from '../../../components/Breadcrumb';
import './style.scss';
const Index = () => {
	return (
		<>
			<Row className='nav mb-2'>
				<Col xs={4}>
					<Breadcrumb />
				</Col>
				<Col xs={8} className="filter-buttons mb-2">

				</Col>
			</Row>
			<div className="regularizationApproval">
				<div className='basicInfo'>
					<div className='cardCustomTitle'>Regularization Approval</div>
					<div className='infoTable'>
						<table class="table">
							<tbody>
								<tr>
									<td>Employee</td>
									<td>Vaishnav - E01234</td>
								</tr>
								<tr>
									<td>Date</td>
									<td>29-Nov-2022</td>
								</tr>
								<tr>
									<td>Attendance Day</td>
									<td>29-Nov-2022</td>
								</tr>
							</tbody>
						</table>
						<table class="table">
							<tbody>
								<tr>
									<td>Check-In</td>
									<td><b>Old: </b> 05:43 PM</td>
									<td><b>New: </b> 07:43 PM</td>
									<td></td>
								</tr>
								<tr>
									<td>Check-Out</td>
									<td><b>Old: </b> 05:43 PM</td>
									<td><b>New: </b> 07:43 PM</td>
									<td></td>
								</tr>
								<tr>
									<td>Hours</td>
									<td><b>Old: </b> 05:43</td>
									<td><b>New: </b> 07:43</td>
									<td></td>
								</tr>
								<tr>
									<td>Status</td>
									<td><b>Old: </b> Half Day Present</td>
									<td><b>New: </b> Present</td>
								</tr>
							</tbody>
						</table>
						<table class="table">
							<tbody>
								<tr>
									<td>Reason</td>
									<td>Forgot to check-out</td>
								</tr>
								<tr>
									<td>Description</td>
									<td>-</td>
								</tr>
								<tr>
									<td>Approval Status</td>
									<td>Approved</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	)
}



export default Index
