import React, { useEffect } from 'react';
import Moment from 'moment';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { authState } from '../../../recoil/authRecoil';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAddRegularization } from '../../../query/regularization/regularizationQuery';
import { requiredField } from '../../../utilits/validation';
import { Input } from '../../widgets/formComponents/Input';
import './style.scss';

const Index = ({ regularisationModalVisible, setRegularisationModalVisible }) => {
	return (
		<Modal
			className="regularisationModal"
			show={regularisationModalVisible}
			onHide={() => setRegularisationModalVisible(false)
			}
		>
			<Modal.Header closeButton >
				<Modal.Title>Regularisation</Modal.Title>
			</Modal.Header>
			<Modal.Body closeButton>
				<Row className='gx-0'>
					<Col sm={12}>
						<RegularisationForm className='regularisationContent' setRegularisationModalVisible={setRegularisationModalVisible} />
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	)
}

const RegularisationForm = ({ setRegularisationModalVisible }) => {
	const [totalTime, setTotalTime] = useState("");
	const empDetail = useRecoilValue(authState)
	const [checkInState, setCheckInState] = useState(0);
	const [checkOutState, setCheckOutState] = useState(0);
	const { mutateAsync: addRegularizationMutateAsync } = useAddRegularization()
	const { register, watch, handleSubmit, formState: { errors }, reset , formState} = useForm({
		mode: "onTouched"
	});


	const onSubmit = (memberData) => {
		const newMemberData = {
			...memberData,
			"total_time": totalTime,
			"emp_uuid": empDetail.uuid,
			"pm_uuid": empDetail.reporting_manager_uuid,
			"regularization_date": Moment(memberData?.regularization_date).format('YYYY-MM-DD')
		}

		addRegularizationMutateAsync(newMemberData)
		reset({});
		setTotalTime("")
	}

	useEffect(() => {
		setCheckInState(watch("check_in"))
	}, [watch("check_in")])

	useEffect(() => {
		setCheckOutState(watch("check_out"))
	}, [watch("check_out")])

	useEffect(() => {
		getTotalWorkingHours(checkInState, checkOutState)
	}, [checkOutState])

	const getTotalWorkingHours = (start, end) => {
		if (start != 0) {
			start = start.split(":");
			end = end.split(":");
			var startDate = new Date(0, 0, 0, start[0], start[1], 0);
			var endDate = new Date(0, 0, 0, end[0], end[1], 0);
			var diff = endDate.getTime() - startDate.getTime();
			var hours = Math.floor(diff / 1000 / 60 / 60);
			diff -= hours * 1000 * 60 * 60;
			var minutes = Math.floor(diff / 1000 / 60);
			if (hours < 0) {
				hours = hours + 24;
			}
			setTotalTime((hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes);
		}
	}

	return (
		<>
			<div className='regularisationForm'>
				<form className='formRegularisation' onSubmit={handleSubmit(onSubmit)}>
					<Row>
						<Col sm={12} className='mb-3'>
							<label>Attendance Date *</label>
							<Input type="date" className='form-control' name='regularization_date'
								min={new Date()}
								error={errors.regularization_date}
								reference={
									register({
										required: requiredField(),
										valueAsDate: true,
										validate: {
											lessThan: date => new Date(date) > new Date() ? 'Cannot regularise a future date.' : true,
										}
									})
								} />
							{errors.regularization_date && (<small className="form-text text-danger">{errors.regularization_date.message}</small>)}
						</Col>
						<Col sm={12} className='mb-3'>
							<label>Check-in time *</label>
							<Input type="time" className='form-control' name='check_in'
								error={errors.check_in}
								reference={
									register({
										required: requiredField(),
									})
								} />
							{errors.check_in && (<small className="form-text text-danger">{errors.check_in.message}</small>)}
						</Col>
						<Col sm={12} className='mb-3'>
							<label>Check-out time *</label>
							<Input type="time" className='form-control' name='check_out'
								error={errors.check_out}
								reference={
									register({
										required: requiredField(),
									})
								} />
							{errors.check_out && (<small className="form-text text-danger">{errors.check_out.message}</small>)}
						</Col>
						<Col sm={12} className="mb-3">
							<label>Total Hours</label>
							<div>{totalTime == "" ? "00:00" : totalTime}</div>
						</Col>
						<Col sm={12} className='mb-3'>
							<label>Reason *</label>
							<select
								className="form-control dropdown-bar"
								name="reason"
								error={errors.reason}
								ref={register({
									required: requiredField(),
								})}
							>
								<option value="">Select</option>
								<option value="Forgot to check-in">Forgot to check-in</option>
								<option value="Forgot to check-out">Forgot to check-out</option>
								<option value="Others">Others</option>
							</select>
							{errors.reason && (<small className="form-text text-danger">{errors.reason.message}</small>)}
						</Col>
						<Col sm={12} className='mb-3'>
							<label>Description</label>
							<textarea
								id='text-edit'
								className="form-control"
								name="description"
								error={errors.description}
								ref={register({
									required: false,
									validate: desc => desc.trim().length > 150 ? 'Description shoud be max. 150 characters.' : true,
								})}
							/>
							{errors.description && (<small className="form-text text-danger">{errors.description.message}</small>)}
						</Col>
						<Col sm={12} className='buttonSection'>
							<Button variant='primary' size='sm' disabled={!formState.isValid} type='submit' className="addBtn">Apply</Button>
							<Button variant='danger' size='sm' className="closeBtn" onClick={() => setRegularisationModalVisible(false)} >Cancel</Button>
						</Col>
					</Row>
				</form>
			</div >
		</>
	)
}

export default Index
