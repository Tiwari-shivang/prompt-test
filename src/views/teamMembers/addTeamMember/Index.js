import React, { useEffect } from 'react';
import { Button, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumb from '../../../components/Breadcrumb';
import { useGetAllMembers } from "../../../query/members/allMembers/allMembersQuery";
import { useCreateTeamMember } from '../../../query/projects/addProjects/addProjectsQuery';
import { Input } from '../../widgets/formComponents/Input';
// import { useGetContactsById } from '../../../query'
import { useForm } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { resetAddMemberState } from '../../../recoil/resetFormRecoil';
import { requiredField } from '../../../utilits/validation';
import './style.scss';
import { useAddMembersInProjectPhase } from '../../../query/members/addMembers/addMembersQuery';

const Index = () => {
	const params = useParams();
	const navigate = useNavigate()
	const location = useLocation()
	const { register, handleSubmit, formState, errors, reset } = useForm({
		mode: "onTouched"
	});
	const setResetAddTeamMember = useSetRecoilState(resetAddMemberState)
	const useResetAddTeamMember = useRecoilValue(resetAddMemberState)
	const { data, isLoading, mutateAsync } = useAddMembersInProjectPhase()
	const { data: allMember } = useGetAllMembers();

	useEffect(() => {
		reset(data);
	}, [data]);

	const handleOnSubmit = (data) => {
		const newTeamData = {
			uuid: params?.id,
			phase: location.state.phaseNo,
			phase_uuid: location.state.phaseUuid,
			employee_uuid: data.employee_id,
			is_shadow: data.is_shadow=="true"?true:false,
			member_start_working_date: data.member_start_working_date,
			is_active: true,
			allocation: parseInt(data.allocation),
			billable: parseInt(data.billable),
			role: data.role,
		}
		mutateAsync(newTeamData)
		setResetAddTeamMember(false)
	}

	useEffect(() => {
		if (useResetAddTeamMember) {
			reset({})
		}
	}, [useResetAddTeamMember])

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
								min="2010-01-01"
								max="2050-01-02"
								className="form-control"
								name="member_start_working_date"
								reference={register({ required: requiredField(), })} />
							{errors.member_start_working_date && (<small className="form-text text-danger">{errors.member_start_working_date.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3">
							<label className={`${errors.allocation ? "text-danger" : ""}`}>Allocation *</label>
							<input
								type="number"
								placeholder="Allocation"
								className="form-control"
								name="allocation"
								min="1"
								ref={register({
									required: requiredField(),
								})}
							/>
							{errors.allocation && (<small className="form-text text-danger">{errors.allocation.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3">
							<label className={`${errors.billable ? "text-danger" : ""}`}>Billable *</label>
							<input
								type="number"
								placeholder="Allocation"
								className="form-control"
								name="billable"
								max="100"
								ref={register({
									required: requiredField(),
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
								placeholder="Role"
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
							<Button disabled={!formState.isValid} variant="primary" type='submit'>Create</Button>
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
