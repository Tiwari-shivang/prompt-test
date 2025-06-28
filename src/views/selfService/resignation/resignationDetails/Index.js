import { Select } from 'antd';
import React, { useState } from 'react';
import { Button, Row, Col } from "react-bootstrap"
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../../../../recoil/authRecoil';
import './style.scss';
import { requiredField } from '../../../../utilits/validation'
import { useUpdateResignationWithdraw } from '../../../../query/resignation/updateResignation/updateResignationQuery';

const Index = () => {
	const navigate = useNavigate();
	const empDetail = useRecoilValue(authState)
	const [withdrawClicked, setWithdrawClicked] = useState(false);
	const withdrawClickHandler = () => {
		setWithdrawClicked(prev => !prev);
	}
	const locationData = useLocation()
	const dataOfRegination = locationData && locationData.state.details
	const {  register, handleSubmit, formState: { errors } } = useForm({
		mode: "onTouched"
	});
	const { mutateAsync: withdrawMutateAsync } = useUpdateResignationWithdraw()

	const onSubmit = (data) => {
		const val = {
			...data,
			id: dataOfRegination.id
		}

		withdrawMutateAsync(val)
		navigate(-1);
	}
	return (
		<div className="resignationDetails">
			<div className='cardCustomTitle'>Edit details</div>
			<div className='infoTable'>
				<table class="table">
					<tbody>
						<tr>
							<td>Employee ID</td>
							<td>{empDetail.office_id}</td>
						</tr>
						<tr>
							<td>Date of Resignation</td>
							<td>{dataOfRegination.date_of_resignation}</td>
						</tr>
						<tr>
							<td>Requested last working day</td>
							<td>{dataOfRegination.requested_last_date}</td>
						</tr>
						<tr>
							<td>Reason for leaving</td>
							<td>{dataOfRegination.reason_for_leaving}</td>
						</tr>
						<tr>
							<td>Reason</td>
							<td>{dataOfRegination.reason}</td>
						</tr>
						<tr>
							<td>Personal email ID</td>
							<td>{dataOfRegination.email}</td>
						</tr>
						<tr>
							<td>Permanent Address</td>
							<td>{dataOfRegination.permanent_address.address}</td>
						</tr>
						<tr>
							<td>Correspondence Address</td>
							<td>{dataOfRegination.correspondance_address.address}</td>
						</tr>
						<tr>
							<td>Contact Number</td>
							<td>{dataOfRegination.mobile_no}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className='buttonWithdrawSection'>
				{
					!withdrawClicked ?
						<button type='button' className={`btn btn-primary btn-sm`} onClick={withdrawClickHandler}>Withdraw</button> : ''
				}
				{
					withdrawClicked ?
						<form onSubmit={handleSubmit(onSubmit)}>
							<Row>
								<Col sm={12}>
									<textarea
										type="text"
										id='text-edit'
										placeholder="Reason for withdrawal"
										className="textBox form-control"
										name='withdraw_reason'
										ref={register({
											required: requiredField(),
										})}
									></textarea>
									{errors.withdraw_reason && (<small className="form-text text-danger">{errors.withdraw_reason.message}</small>)}
								</Col>
								{
									withdrawClicked ?
										<Col sm={12} className='buttonSection'>
											<Button variant='primary' size='sm' type="submit">Submit</Button>
											<Button variant='danger' size='sm' onClick={() => setWithdrawClicked(false)}>Cancel</Button>
										</Col>
										: ''
								}

							</Row>
						</form>
						: ''
				}
				{
					!withdrawClicked ?
						<Button size='sm' variant='danger' className="ms-2" onClick={() => navigate(-1)}>Cancel</Button>
						: ''
				}
			</div>
		</div>
	)
}

export default Index