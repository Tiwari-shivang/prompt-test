import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Row } from "react-bootstrap";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import { Input } from '../../widgets/formComponents/Input';
import Breadcrumb from '../../../components/Breadcrumb';
import { requiredField } from '../../../utilits/validation';
import "./style.scss";

const AddUpcomingProject = () => {
	const { register, handleSubmit, control, errors, watch, formState, clearErrors, reset, setValue, getValues } = useForm();
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'dynamicFields',
	});
	const navigate = useNavigate()

	useEffect(() => {
		append({ value: '' })
	}
	, []);


	const onSubmit = (data) => {
		// console.log(data);
	};

	return (
		<>
			<Row className='mb-2'>
				<Col xs={6}>
					<Breadcrumb />
				</Col>
				<Col xs={6} className="">
				</Col>
			</Row>
			<form onSubmit={handleSubmit(onSubmit)} className='addUpcomingProject'>
				<Row>
					<Col sm={5} className="mb-3">
						<label className={`${errors.upcoming_project ? "text-danger" : ""}`}>Upcoming Project Name *</label>
						<Input
							type="text"
							placeholder="Project Name"
							className="form-control"
							name="upcoming_project"
							reference={register({
								required: requiredField(),
							})}
						/>
						{errors.upcoming_project && (<small className="form-text text-danger">{errors.upcoming_project.message}</small>)}
					</Col>
					<Col sm={5} className="mb-3">
						<label className={`${errors.upcoming_project ? "text-danger" : ""}`}>Is Client Side*</label>
						<Input
							type="text"
							placeholder="Is Client Side"
							className="form-control"
							name="upcoming_project"
							reference={register({
								required: requiredField(),
							})}
						/>
						{errors.upcoming_project && (<small className="form-text text-danger">{errors.upcoming_project.message}</small>)}
					</Col>
				</Row>
				<Row>
					{fields.map((field, index) => (
						<div key={field.id}>
							<Row>
								<Col sm={5} className="mb-3">
									<label className={`${errors.required_role ? "text-danger" : ""}`}>Required Role*</label>
									<select
										className="form-control customScroll"
										name="required_role"
										ref={register({
											required: requiredField(),
										})}
									>
										<option value="">
											Select Role
										</option>
										{/* {dataAllClient &&
									dataAllClient?.clients?.map((option) => (
										<option key={option.client_id} value={option.client_id}>
											{option.name}
										</option>
									))} */}
									</select>
									{errors.required_role && (<small className="form-text text-danger">{errors.required_role.message}</small>)}
								</Col>
								<Col sm={5} className="mb-3">
									<label className={`${errors.allocation ? "text-danger" : ""}`}>Allocation*</label>
									<Input
										type="text"
										placeholder="Allocation"
										className="form-control"
										name="allocation"
										reference={register({
											required: requiredField(),
										})}
									/>
									{errors.allocation && (<small className="form-text text-danger">{errors.allocation.message}</small>)}
								</Col>
								<Col sm={2} className="pt-4">
									<a className="editIcon" >
										<AiOutlineMinusCircle className='icon' onClick={() => remove(index)} />
									</a>
									<a className="viewIcon" >
										<AiOutlinePlusCircle className='icon' onClick={() => append({ value: '' })} />
									</a>
								</Col>
							</Row>
							{/* <input
							  type="text"
							  name={`dynamicFields[${index}].value`}
							  defaultValue={field.value} // or use value={field.value} if needed
							  ref={register} // register the input with react-hook-form
						  /> */}


						</div>

					))}
				</Row>
				<Row className="mt-4 mb-2">
					<Col sm={12} className='buttonSection'>
						<Button
							variant="primary" type='submit'>Add Upcoming Project</Button>
						<Button variant="outline-danger" onClick={() => { navigate(-1) }}>
							Cancel
						</Button>
					</Col>
				</Row>
			</form>
		</>);
};

export default AddUpcomingProject;
