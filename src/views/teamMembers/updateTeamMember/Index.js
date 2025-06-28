import React, { useEffect } from 'react';
import { Button, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumb from '../../../components/Breadcrumb';
import { useGetAllMembers } from "../../../query/members/allMembers/allMembersQuery";
import { useGetProjectMemberById } from "../../../query/projects/allProjects/allProjectsQuery";
import { useUpdateTeamMember } from '../../../query/projects/updateProjects/updateProjectsQuery';
import { Input } from '../../widgets/formComponents/Input';
// import { useGetContactsById } from '../../../query'
import { useForm } from 'react-hook-form';
import { requiredField } from '../../../utilits/validation';
import './style.scss';


const Index = () => {
	const params = useParams();
	const navigate = useNavigate()
	const location = useLocation()
	const { register, formState, handleSubmit, watch, clearErrors, errors, reset } = useForm({
		mode: "onTouched"
	});
	const { data: allMember, isLoading: isLoadingAllMember, } = useGetAllMembers();
	const { data: dataList, isLoading: isLoadingList, } = useGetProjectMemberById(params.id);


	// contact api 
	const { data, isLoading, mutateAsync } = useUpdateTeamMember()

	const experienceFromWatch = watch('member_start_working_date')
	const experienceToWatch = watch('member_end_working_date')

	useEffect(() => {
		reset(dataList);
	}, [dataList]);

	const handleOnSubmit = (data) => {
		const updateTeamData = {
			"uuid": location.state.updateEmplyeeUuid,
			//"phase": location.state.id,
			"project_uuid": location.state.projectUuid,
			//"phase_uuid": location.state.phaseId,
			"employee_uuid": data.employee_id,
			"is_shadow": data.is_shadow=="true"?true:false,
			"member_start_working_date": data.member_start_working_date,
			"member_end_working_date": data.member_end_working_date,
			"is_active": true,
			"allocation": data.allocation,
			"billable": data.billable,
			"role": data.role,
			"department_id": true
		}
		mutateAsync(updateTeamData)
	}
	if (isLoadingAllMember) {
		return <p>loading...</p>
	}

	if (isLoadingList) {
		return <p>loading...</p>
	}

	return (
		<div className='client-POC'>
			<Row className='mb-2'>
				<Col xs={6}>
					<Breadcrumb />
				</Col>
			</Row>

			{/* control section  */}
			<div className="addclient">
				<form onSubmit={handleSubmit(handleOnSubmit)}>
					<Row>
						<Col sm={6} className="mb-3">
							<label className={`${errors.employee_id ? "text-danger" : ""}`}>Employee *</label>
							<select
								placeholder="Select Employee"
								className='form-control'
								name="employee_id"
								ref={register({
									required: requiredField(),
								})}
							>
								<option value="">Select Employee</option>
								{allMember &&
									allMember.employees && allMember.employees.map((option) => (
										<option key={option.uuid} value={option.uuid}>
											{option.first_name} {option.last_name}
										</option>
									))}
							</select>
							{errors.employee_id && (<small className="form-text text-danger">{errors.employee_id.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3">
							<label className={`${errors.member_start_working_date ? "text-danger" : ""}`}>Start Date *</label>
							<Input
								type="date"
								className="form-control"
								min="2010-01-01"
								max="2050-01-02"
								name="member_start_working_date"
								reference={register({
									required: isNaN(experienceToWatch) && isNaN(experienceFromWatch) ? false : 'Value required',
									validate: {
										lessThan: v => {
											if (!params.id) return true
											if (v === '' && isNaN(experienceToWatch)) return true
											if (experienceToWatch > Date(v)) {
												clearErrors('member_end_working_date')
											}
											return (isNaN(experienceToWatch) ? (experienceToWatch > (v) || `Should be less than ${isNaN(experienceToWatch) ? 'end date' : experienceToWatch}`):true)
										}
									},
								})}
							/>
							{errors.member_start_working_date && (<small className="form-text text-danger">{errors.member_start_working_date.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3" hidden={!params.id}>
							<label className={`${errors.member_end_working_date ? "text-danger" : ""}`}>End Date</label>
							<Input
								type="date"
								min="2010-01-01"
								max="2050-01-02"
								className="form-control"
								name="member_end_working_date"
								reference={register({
									// required: params.id ? (isNaN(experienceToWatch) && isNaN(experienceFromWatch) ? false : 'Value required') : false,
									validate: {
										greaterThan: v => {
											if (v === '' && isNaN(experienceFromWatch)) return true
											if (experienceFromWatch < Date(v)) {
												clearErrors('member_start_working_date')
											}
											return experienceFromWatch < Date(v) || `Should be greater than ${isNaN(experienceFromWatch) ? 'start date' : experienceFromWatch}`
										}
									},
								})}
							/>
							{errors.member_end_working_date && (<small className="form-text text-danger">{errors.member_end_working_date.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3">
							<label className={`${errors.allocation ? "text-danger" : ""}`}>Allocation *</label>
							<input
								type="text"
								placeholder="Allocation"
								className="form-control"
								name="allocation"
								min="1"
								ref={register({
									 required : requiredField(),
								})}
							/>
							{errors.allocation && (<small className="form-text text-danger">{errors.allocation.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3">
							<label className={`${errors.billable ? "text-danger" : ""}`}>Billable *</label>
							<input
								type="text"
								placeholder="Billable"
								className="form-control"
								name="billable"
								max="100"
								ref={register({
									 required : requiredField(),
								})}
							/>
							{errors.billable && (<small className="form-text text-danger">{errors.billable.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3">
							<label className={`${errors.role ? "text-danger" : ""}`}>Role *</label>
							<select
								placeholder="Role"
								className="form-control"
								name="role"
								ref={register({ required: requiredField(), })}>
								<option value="">Select Role</option>
								<option value="Frontend Developer">Frontend Developer</option>
								<option value="Backend Developer">Backend Developer</option>
								<option value="Full Stack Developer">Full Stack Developer</option>
								<option value="Quality Analyst">Quality Analyst</option>
								<option value="Data Engineer">Data Engineer</option>
								<option value="Project Manager">Project Manager</option>
								<option value="DevOps">DevOps</option>
								<option value="Business Analyst">Business Analyst</option>
								<option value="Backend Lead">Backend Lead</option>
							</select>
							{errors.role && (<small className="form-text text-danger">{errors.role.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3">
							<label className={`${errors.is_shadow ? "text-danger" : ""}`}>Employee Type *</label>
							<select
								placeholder="Is Shadow"
								className="form-control"
								name="is_shadow"
								ref={register({ required: requiredField(), })}>
								<option value="">Select Employe Type</option>
								<option value={true}>Shadow Employee</option>
								<option value={false}>Client Side Employee</option>
							</select>
							{errors.is_shadow && (<small className="form-text text-danger">{errors.is_shadow.message}</small>)}
						</Col>

					</Row>
					<Row className="my-2">
						<Col sm={12} className='buttonSection'>
							<Button variant="primary" type='submit'>Update</Button>
							<Button variant="outline-danger" onClick={() => { navigate(-1) }}>
								Cancel
							</Button>
						</Col>

					</Row>
				</form>
			</div>
		</div>
	)
}

export default Index
