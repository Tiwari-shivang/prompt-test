import { Select } from 'antd';
import React, { useState } from 'react';
import './style.scss';

const { Option } = Select;

const Index = () => {
	const currentPeriod = '';
	const [withdrawClicked, setWithdrawClicked] = useState(false);
	const withdrawClickHandler = () => {
		setWithdrawClicked(prev => !prev);
	}
	return (
		<div className="selfService">
			<div className='basicInfo'>
				<div className='title'>Edit {locationData.state.reason_for_leaving}</div>
				<div className='infoTable'>
					<table class="table">
						<tbody>
							<tr>
								<td>Employee ID</td>
								<td>E01234 {locationData.state.details}</td>
							</tr>
							<tr>
								<td>Date of Resignation</td>
								<td>15-12-2022</td>
							</tr>
							<tr>
								<td>Requested last working day</td>
								<td>15-12-2022</td>
							</tr>
							<tr>
								<td>Reason for leaving</td>
								<td>Higher Education</td>
							</tr>
							<tr>
								<td>Reason</td>
								<td>M.Tech</td>
							</tr>
							<tr>
								<td>Personal email ID</td>
								<td>vaishnavdixit99@gmail.com</td>
							</tr>
							<tr>
								<td>Permanent Address</td>
								<td>Jabalpur, M.P</td>
							</tr>
							<tr>
								<td>Correspondence Address</td>
								<td>Jabalpur, M.P</td>
							</tr>
							<tr>
								<td>Contact Number</td>
								<td>9235467485</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className='buttonWithdrawSection'>
					<button type='button' className={`btn ${withdrawClicked ? 'btn-primary' : 'btn-outline-primary'} btn-sm`} onClick={withdrawClickHandler}>Withdraw</button>
					{
						withdrawClicked ?

							<textarea
								type="text"
								id='text-edit'
								placeholder="Reason for withdrawal"
								className="textBox form-control"
							></textarea>
							: <button type="button" class="cancelBtn btn btn-sm btn-danger">Cancel</button>
					}
				</div>
				{
					withdrawClicked ?
						<div className='buttonsGrp'>
							<button type="button" class="updateBtn btn btn-sm btn-primary">Update</button>
							<button type="button" class="cancelBtn btn btn-sm btn-danger">Cancel</button>
						</div>
						: ''
				}
			</div>
		</div>
	)
}

export default Index