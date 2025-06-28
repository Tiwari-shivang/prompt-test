import React, { useState } from 'react'
import { Button, Col, Row } from "react-bootstrap"
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { useGetCountries, useGetStates } from '../../../../query/country/countriesQuery'
import { useAddResignation } from '../../../../query/resignation/addResignation/addResignationQuery'
import { authState } from "../../../../recoil/authRecoil"
import { emailPattern, PhonePattern, requiredField } from '../../../../utilits/validation'
import { Input } from '../../../widgets/formComponents/Input'
import './style.scss'

const Index = () => {
	const navigate = useNavigate();
	const { setError, formState, getValues,reset, setValue, register, handleSubmit, formState: { errors } } = useForm({
		mode: "onTouched"
	});
	const [countryName, setCountryName] = useState("")
	const empDetail = useRecoilValue(authState)
	const { data: addResign, isLoading: isLoadingAddResign, mutateAsync: addMutateAsync } = useAddResignation()
	const { data: countryList, isLoading: isLoadingCountryList, } = useGetCountries();
	const { data:stateList , isLoading: isLoadingStateList, } = useGetStates(countryName);
	
	const onSubmit = (data) => {
		const val = {
			...data,
			"office_id": empDetail.office_id,
			"emp_uuid": empDetail.uuid,
			"file": "file",
		}
		addMutateAsync(val)
		reset("")
	}
	const getStateList = (e) => {
		setCountryName(e.target.value)
	}
	const handleAddress = (e) => {
		if (e.target.checked) {
			setValue("correspondence_address.address", getValues("permanent_address.address"), { shouldValidate: true })
			setValue("correspondence_address.city", getValues("permanent_address.city"), { shouldValidate: true })
			setValue("correspondence_address.pin_code", getValues("permanent_address.pin_code"), { shouldValidate: true })
			setValue("correspondence_address.country", getValues("permanent_address.country"), { shouldValidate: true })
			setValue("correspondence_address.state", getValues("permanent_address.state"), { shouldValidate: true })
		} else {
			setValue("correspondence_address.address", "", { shouldValidate: true })
			setValue("correspondence_address.city", "", { shouldValidate: true })
			setValue("correspondence_address.pin_code", "", { shouldValidate: true })
			setValue("correspondence_address.country", "", { shouldValidate: true })
			setValue("correspondence_address.state", "", { shouldValidate: true })
		}
	}

	return (
		<div className='addResignation'>
			<div className='headerRow cardCustomTitle mb-3'>
				Add Resignation
			</div>
			<form className='formAddResignation' onSubmit={handleSubmit(onSubmit)}>
				<Row>
					<Col sm={12} md={6}>
						<Row>
							<Col sm={12} className="mb-3">
								<label>Employee ID *</label>
								<Input
									type="text"
									placeholder="Emp Id"
									className="form-control"
									name="office_id"
									disabled={true}
									value={empDetail.office_id}
								/>
							</Col>
							<Col sm={12} md={6} className='mb-3' >
								<label>Date of Resignation *</label>
								<Input
									type="date"
									className='form-control'
									name='date_of_resignation'
									reference={
										register({
											required: requiredField(),					
										})
									} />
								{errors.date_of_resignation && (<small className="form-text text-danger">{errors.date_of_resignation.message}</small>)}
							</Col>
							<Col sm={12} md={6} className='mb-3'>
								<label>Requested last working day *</label>
								<Input
									type="date"
									className='form-control'
									name='requested_last_date'
									reference={register({
										required: requiredField(),
									})} />
								{errors.requested_last_date && (<small className="form-text text-danger">{errors.requested_last_date.message}</small>)}
							</Col>
							<Col sm={12} className='mb-3'>
								<label>Reason for leaving *</label>
								<select
									className="form-control"
									name="reason_for_leaving"
									ref={register({
										required: requiredField(),
									})}
								>
									<option value="">select</option>
									<option value="Better opportunity">Better opportunity</option>
									<option value="Career Prospect">Career Prospect</option>
									<option value="Higher Education">Higher Education</option>
									<option value="Absconding">Absconding</option>
									<option value="Asked To Leave">Asked To Leave</option>
									<option value="Others">Others</option>
								</select>
								{errors.reason_for_leaving && (<small className="form-text text-danger">{errors.reason_for_leaving.message}</small>)}
							</Col>
							<Col sm={12} className="mb-3">
								<label>Description *</label>
								<Input
									type="text"
									className="form-control"
									name="reason"
									reference={register({
										required: requiredField(),
									})} />
								{errors.reason && (<small className="form-text text-danger">{errors.reason.message}</small>)}
							</Col>
							<Col sm={12} className="mb-3">
								<label>Personal email ID *</label>
								<Input
									type="email"
									placeholder="Enter your email"
									className="form-control"
									name="email"
									reference={register({
										required: requiredField(),
										pattern: emailPattern(),
									})} />
								{errors.email && (<small className="form-text text-danger">{errors.email.message}</small>)}
							</Col>

							<Col sm={12} className="mb-3">
								<label>Contact Number *</label>
								<Input
									type="number"
									placeholder="Mobile Number"
									className="form-control"
									name="mobile_no"
									reference={register({
										required: requiredField(),
										pattern: PhonePattern()
									})} />

								{errors.mobile_no && (<small className="form-text text-danger">{errors.mobile_no.message}</small>)}
							</Col>
						</Row>
					</Col>
					<Col sm={12} md={6}>
						<Row>
							<Col sm={12} className="mb-3">
								<label>Permanent Address *</label>
								<Input
									type="text"
									className="form-control"
									name="permanent_address.address"
									reference={register({
										required: requiredField(),
									})} />
								{/* {errors.permanent_address.address && (<small className="form-text text-danger">{errors.permanent_address.address.message}</small>)} */}
							</Col>
							<Col sm={6} className="mb-3">
								<label>City *</label>
								<Input
									type="text"
									placeholder="city"
									className="form-control"
									name="permanent_address.city"
									reference={register({
										required: requiredField(),
									})} />
								{/* {errors.permanent_address.city && (<small className="form-text text-danger">{errors.permanent_address.city.message}</small>)} */}
							</Col>
							<Col sm={6} className="mb-3">
								<label>Pin code *</label>
								<Input
									type="text"
									className="form-control"
									name="permanent_address.pin_code"
									reference={register({
										required: requiredField(),
									})} />
								{/* {errors.permanent_address.pin_code && (<small className="form-text text-danger">{errors.permanent_address.pin_code.message}</small>)} */}
							</Col>

							<Col sm={6} className="mb-3">
								<label>State *</label>
								<select
									className="form-control"
									name="permanent_address.state"
									ref={register({
										required: requiredField(),
									})}
								>
									<option value="">select</option>
									{stateList &&
										stateList.map((option) => (
											<option  value={option.name}>
												{option.name}
											</option>
										))}
								</select>
								{/* {errors.permanent_address.state && (<small className="form-text text-danger">{errors.permanent_address.state.message}</small>)} */}
							</Col>
							<Col sm={6} className="mb-3">
								<label>Country *</label>
								<select
									className="form-control"
									name="permanent_address.country"
									onChange={(e) => getStateList(e)}
									ref={register({
										required: requiredField(),
									})}
								>
									<option value="">Select Country</option>
									{countryList &&
										countryList.map((option) => (
											<option key={option.id} value={option.name}>
												{option.name}
											</option>
										))}
								</select>
								{/* {errors.permanent_address.country && (<small className="form-text text-danger">{errors.permanent_address.country.message}</small>)} */}
							</Col>

							<Col sm={12} className="mb-3">
								<label className='sameAsPermanent'>
									<Input
										type="checkbox"
										onChangeHandler={handleAddress}
									/>Same as permanent address
								</label>
							</Col>

							<Col sm={12} className="mb-3">
								<label>Correspondence Address *</label>
								<Input
									type="text"
									className="form-control"
									name="correspondence_address.address"
									reference={register({
										required: requiredField(),
									})}
								/>
								{/* {errors.correspondence_address.address && (<small className="form-text text-danger">{errors.correspondence_address.address.message}</small>)} */}
							</Col>

							<Col sm={6} className="mb-3">
								<label>City *</label>
								<Input
									type="text"
									placeholder="city"
									className="form-control"
									name="correspondence_address.city"
									reference={register({
										required: requiredField(),
									})} />
								{/* {errors.correspondence_address.city && (<small className="form-text text-danger">{errors.correspondence_address.city.message}</small>)} */}
							</Col>
							<Col sm={6} className="mb-3">
								<label>Pin code *</label>
								<Input
									type="text"
									className="form-control"
									name="correspondence_address.pin_code"
									reference={register({
										required: requiredField(),
									})} />
								{/* {errors.correspondence_address.pin_code && (<small className="form-text text-danger">{errors.correspondence_address.pin_code.message}</small>)} */}
							</Col>

							<Col sm={6} className="mb-3">
								<label>State *</label>
								<select
									className="form-control"
									name="correspondence_address.state"
									ref={register({
										required: requiredField(),
									})}
								>
									<option value="">select</option>
									{stateList &&
										stateList.map((option) => (
											<option  value={option.name}>
												{option.name}
											</option>
										))}
								</select>
								{/* {errors.correspondence_address.state && (<small className="form-text text-danger">{errors.correspondence_address.state.message}</small>)} */}
							</Col>
							<Col sm={6} className="mb-3">
								<label>Country *</label>
								<select
									className="form-control"
									name="correspondence_address.country"
									onChange={(e) => getStateList(e)}
									ref={register({
										required: requiredField(),
									})}
								>
									<option value="">Select Country</option>
									{countryList &&
										countryList.map((option) => (
											<option key={option.id} value={option.name}>
												{option.name}
											</option>
										))}
								</select>
								{/* {errors.correspondence_address.country && (<small className="form-text text-danger">{errors.correspondence_address.country.message}</small>)} */}
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className="mt-4 mb-2">
					<Col sm={12} className="buttonSection">
						<Button  variant="primary" type='submit'>Apply</Button>
						<Button variant="outline-danger" onClick={() => { navigate(-1) }}>Cancel</Button>
					</Col>
				</Row>
			</form>
		</div >
	)
}

export default Index
