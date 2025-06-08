import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from "react-bootstrap"
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { useAddIdentityDetails } from '../../../query/identity/addIdentity/addIdentityQuery'
import { useGetIdentityById } from '../../../query/identity/allIdentity/allIdentityQuery'
import { useUpdateIdentity } from '../../../query/identity/updateIdentity/updateIdentityQuery'
import { useGetAllMembers } from '../../../query/members/allMembers/allMembersQuery'
import { authState } from '../../../recoil/authRecoil'
import { requiredField } from '../../../utilits/validation'
import { Input } from '../../widgets/formComponents/Input'
import Moment from 'moment'
import './style.scss'


const Index = () => {
	const navigate = useNavigate();
	const empDetail = useRecoilValue(authState);
	const location = useLocation();
	const [memberId, setMemberId] = useState(empDetail && empDetail.uuid);
	const [dateChange, setDateChange] = useState({});
	const { data: allMembers, isLoading: isAllMembersLoading } = useGetAllMembers()
	const { data: selectedMember, isLoading: isLoadinggetIdentity } = useGetIdentityById(memberId);
	const { mutateAsync: updateIdentityMutateAsync, isLoading: isLoadingUpdateIdentity } = useUpdateIdentity()
	const { data: addIdentityDet, isLoading: isLoadingAddIdentityDetails, mutateAsync: addIdentityMutateAsync } = useAddIdentityDetails()
	const { setError, getValues, reset, register, handleSubmit, formState: { errors, isValid } } = useForm({
		mode: "onTouched"
	});
	const selectMemberId = (e) => {
		setMemberId("")
		setMemberId(e.target.value)
	}


	useEffect(() => {
		setDateChange(
			{
				...selectedMember,
				"passport_valid_until": Moment(selectedMember?.passport_valid_until).format('YYYY-MM-DD')
			})
	}, [selectedMember])

	useEffect(() => {
		reset(dateChange)
	}, [dateChange])


	const onSubmit = (data) => {
		const val = {
			"emp_uuid": data.employeeUuid,
			"uan": data.uan,
			"pan": data.pan,
			"aadhaar": data.aadhar,
			"passport": data.passport,
			"passport_valid_until": data.passportValidUntil,
			"other": "other"
		}
		if (selectedMember && selectedMember.id) {
			updateIdentityMutateAsync(data)
		}
		else {
			addIdentityMutateAsync(data);
		}
	}


	if (isLoadinggetIdentity) {
		return <p>loader..</p>
	}

	if (isAllMembersLoading) {
		return <p>loader..</p>
	}

	return (
		<>
			<div className='editPersonalInformation '>
				<div className='cardCustomTitle'>
					Edit Personal Information
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Row>
						<Col sm={12} md={6} className="mb-3">
							<label>Employee *</label>
							<select
								className="form-control dropdown-bar"
								name="emp_uuid"
								value={memberId}
								onChange={(e) => { selectMemberId(e) }}
								disabled={isAllMembersLoading}
								ref={register({
									required: requiredField(),
								})}
							>
								<option value="">select</option>
								{
									allMembers && allMembers.employees && allMembers.employees.map((item, index) => (
										<option value={item.uuid}>{item.first_name} {item.last_name} {item.office_id}</option>
									))
								}
							</select>
							{errors.emp_uuid && (<small className="form-text text-danger">{errors.emp_uuid.message}</small>)}
						</Col>
						<Col sm={12} md={6} className="mb-3">
							<label>UAN *</label>
							<Input
								type="text"
								className="form-control"
								//defaultValue={selectedMember.uan}
								name="uan"
								reference={register({
									required: requiredField(),
									validate: {
										equalTo: v => /[0-9]{12}$/.test(v) ? true : 'UAN is invalid.',

									}
								})} />
							{errors.uan && (<small className="form-text text-danger">{errors.uan.message}</small>)}
						</Col>
						<Col sm={12} md={6} className="mb-3">
							<label>PAN *</label>
							<Input
								type="text"
								className="form-control"
								name="pan"
								//defaultValue={selectedMember.pan}
								reference={register({
									required: requiredField(),
									validate: {
										equalTo: v => /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(v) ? true : 'PAN is invalid.',
									}
								})} />
							{errors.pan && (<small className="form-text text-danger">{errors.pan.message}</small>)}
						</Col>
						<Col sm={12} md={6} className="mb-3">
							<label>Aadhar *</label>
							<Input
								type="text"
								className="form-control"
								name="aadhaar"
								//defaultValue={selectedMember.aadhaar}
								reference={register({
									required: requiredField(),
									validate: {
										equalTo: v => /^[0-9]{12}$/.test(v) ? true : 'Aadhar number is invalid.',
									}
								})} />
							{errors.aadhaar && (<small className="form-text text-danger">{errors.aadhaar.message}</small>)}
						</Col>
						<Col sm={12} md={6} className="mb-3">
							<label>Passport </label>
							<Input
								type="text"
								className="form-control"
								name="passport"
								//defaultValue={selectedMember?.passport}
								reference={register({
									validate: {
										// equalTo: v => /^[A-Z][0-9]{8}$/.test(v) ? true : 'Passport number is invalid.',
									}
								})} />
							{errors.passport && (<small className="form-text text-danger">{errors.passport.message}</small>)}
						</Col>
						<Col sm={12} md={6} className="mb-3">
							<label>Passport Valid Until *</label>
							<Input
								type="date"
								className='form-control'
								name='passport_valid_until'
								min={new Date()}
								max="9999-12-31"
								error={errors.date}
								reference={
									register({
										required: requiredField(),
										valueAsDate: true,
										validate: {
											greaterThan: date => new Date(date) < new Date() ? 'Passport is expired.' : true,
										}
									})
								} />
							{errors.passport_valid_until && (<small className="form-text text-danger">{errors.passport_valid_until.message}</small>)}
						</Col>
						<Col sm={12} className='buttonSection'>
							<Button variant='primary' disabled={!isValid || (selectedMember?.id ? isLoadingUpdateIdentity : isLoadingAddIdentityDetails)} size='sm' type='submit'>Update</Button>
							<Button variant='danger' size='sm' className='closeBtn' onClick={() => navigate(-1)}>
								Cancel
							</Button>
						</Col>
					</Row>
				</form>
			</div >
		</>
	)
}

export default Index
