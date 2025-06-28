import { EditorState } from 'draft-js';
import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumb from '../../../components/Breadcrumb';
import { useGetAllClients } from '../../../query/clients/allClients/allClientsQuery';
import { useGetAllDepartments } from '../../../query/department/allDepartments/allDepartmentsQuery';
import { useGetAllRms } from '../../../query/members/allMembers/allMembersQuery';
import { useCreatePhase, useCreateProject } from '../../../query/projects/addProjects/addProjectsQuery';
import { useGetAllProjectDetailsByPhase, useGetProjectById } from '../../../query/projects/allProjects/allProjectsQuery';
import { useUpdatePhase } from '../../../query/projects/updateProjects/updateProjectsQuery';
import { requiredField } from '../../../utilits/validation';
import { Input } from '../../widgets/formComponents/Input';
import './style.scss';

const Index = () => {
	const params = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	// useGetProje
	const { register, handleSubmit, formState, errors, watch, clearErrors, reset, setValue, getValues } = useForm();
	const { data: projDetailInCurPhase, isLoading: isProjDetailInCurPhaseLoading } = useGetAllProjectDetailsByPhase({ projectId: params.id, phaseId: location?.state?.phaseId })
	const { data: projectData, isLoading } = useGetProjectById(params.id);
	const { data: dataAllClient, isLoading: isLoadingAllClient } = useGetAllClients();
	const { data: dataAllRm, isLoading: isLoadingAllRm } = useGetAllRms();
	const { mutateAsync: addPhaseMutateAsync } = useCreatePhase();
	const { mutateAsync: updatePhaseMutateAsync } = useUpdatePhase();
	const { data: Departments, isLoading: isLoadingDepartments } = useGetAllDepartments();

	const projectFromWatch = watch('project_start_date')
	const projectToWatch = watch('project_end_date')
	const handleOnSubmitPhase = (data) => {
		let newDataAdd = {
			uuid: params?.id,
			pm_uuid: data.pm_uuid,
			phase_description: data.phase_description,
			start_date: data.start_date,
			end_date: data.end_date,
			client_uuid: data.client_uuid,
			business_unit_id: data.business_unit_id,
			priority: data.priority,
			payment_status: data.payment_status,
		}

		let newDataUpdate = {
			uuid: params?.id,
			phase: location?.state?.id,
			project_phase_uuid: location?.state?.phaseId,
			is_current: true,
			start_date: data.start_date,
			end_date: data.end_date,
			phase_description: data.phase_description,
		}

		params.mode === 'add' ?
			addPhaseMutateAsync(newDataAdd) :
			updatePhaseMutateAsync(newDataUpdate);
	}

	useEffect(() => {
		reset(params.mode === 'update' ? { ...projDetailInCurPhase, project_name: projectData?.project_name, is_client: projectData?.is_client == true } : { project_name: projectData?.project_name, is_client: projectData?.is_client == true });
	}, [projDetailInCurPhase]);

	if (isLoadingAllRm) {
		return <p>loading---</p>
	}
	if (isLoadingAllClient) {
		return <p>loading---</p>
	}
	if (isProjDetailInCurPhaseLoading) {
		return <p>loading---</p>
	}
	if (isLoadingDepartments) {
		return <p>loading---</p>
	}

	return (
		<>
			<Row className='mb-2'>
				<Col xs={6}>
					<Breadcrumb />
				</Col>
				<Col xs={6} className="">

				</Col>
			</Row>
			<div className="addProject">
				<Row>
					<Col>
						<div className='cardCustomTitle'><h5>{params.mode === 'add' ? 'Add' : 'Update'} a new phase in {projectData.project_name}</h5> </div>
					</Col>
				</Row>
				<form onSubmit={handleSubmit(handleOnSubmitPhase)}>
					<Row>
						<Col sm={6} className="mb-3">
							<label className={`${errors.project_name ? "text-danger" : ""}`}>Project Name *</label>
							<Input
								type="text"
								disabled
								name='project_name'
								className="form-control"
								reference={register({
									// required: requiredField(),
								})}
							/>
							{errors.project_name && (<small className="form-text text-danger">{errors.project_name.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3">
							<label className={`${errors.client_uuid ? "text-danger" : ""}`}>Client Name *</label>
							<select
								className="form-control customScroll"
								name="client_uuid"
								ref={register({
									required: requiredField(),
								})}
								disabled={params.mode === 'update'}
							>
								<option value="">
									Select Client
								</option>
								{dataAllClient &&
									dataAllClient?.clients?.map((option) => (
										<option key={option.client_id} value={option.client_id}>
											{option.name}
										</option>
									))}
							</select>
							{errors.client_uuid && (<small className="form-text text-danger">{errors.client_uuid.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3">
							<label className={`${errors.pm_uuid ? "text-danger" : ""}`}>Project Manager *</label>
							<select
								className="form-control customScroll"
								name="pm_uuid"
								ref={register({
									required: requiredField(),
								})}
							>
								<option value="">
									Select PM
								</option>
								{dataAllRm &&
									dataAllRm.map((option) => (
										<option key={option.uuid} value={option.uuid}>
											{option.first_name} {option.last_name}
										</option>
									))}
							</select>
							{errors.pm_uuid && (<small className="form-text text-danger">{errors.pm_uuid.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3" hidden={params.id}>
							<label className={`${errors.allocation ? "text-danger" : ""}`}>PM Allocation *</label>
							<Input
								type="number"
								placeholder="PM Allocation"
								className="form-control"
								disabled
								min="1"
								max="100"
								reference={register({})}
							/>
							{errors.pm_allocation && (<small className="form-text text-danger">{errors.pm_allocation.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3">
							<label className={`${errors.project_start_date ? "text-danger" : ""}`}>Start Date *</label>
							<Input
								type="date"
								className="form-control"
								min="2010-01-01"
								max="2050-01-02"
								name="start_date"
								reference={register({
									required: requiredField(),
								})}
							/>
							{errors.start_date && (<small className="form-text text-danger">{errors.start_date.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3">
							<label className={`${errors.project_end_date ? "text-danger" : ""}`}>End Date *</label>
							<Input
								type="date"
								min="2010-01-01"
								max="2050-01-02"
								className="form-control"
								name="end_date"
								reference={register({})}
							/>
							{errors.project_end_date && (<small className="form-text text-danger">{errors.project_end_date.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3">
							<label className={`${errors.is_client ? "text-danger" : ""}`}>Project Type *</label>
							<select
								className="form-control"
								name="is_client"
								disabled
								ref={register({ required: requiredField(), })}>
								<option value="">Select Project Type</option>
								<option value={true}>Client Side</option>
								<option value={false}>Internal</option>
							</select>
							{errors.is_client && (<small className="form-text text-danger">{errors.is_client.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3">
							<label className={`${errors.priority ? "text-danger" : ""}`}>Priority *</label>
							<select
								className="form-control"
								name="priority"
								ref={register({ required: requiredField(), })}>
								<option value="">Select</option>
								<option value="Low">Low</option>
								<option value="Medium">Medium</option>
								<option value="High">High</option>
							</select>
							{errors.priority && (<small className="form-text text-danger">{errors.priority.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3">
							<label className={`${errors.payment_status ? "text-danger" : ""}`}>Payment Status *</label>
							<select
								className="form-control customScroll"
								name="payment_status"
								ref={register({
									required: requiredField(),
								})}
							>
								<option value="">Select Payment Status</option>
								<option value="Pending">Pending</option>
								<option value="Completed">Completed</option>
							</select>
							{errors.payment_status && (<small className="form-text text-danger">{errors.payment_status.message}</small>)}
						</Col>
						<Col sm={6} className="mb-3">
							<label className={`${errors.department_uuid ? "text-danger" : ""}`}>Department *</label>
							<select
								className="form-control customScroll"
								name="business_unit_id"
								ref={register({ required: requiredField(), })}
							>
								<option value="">Select Department</option>
								{Departments &&
									Departments.map((option) => (
										<option key={option.id} value={option.id}>
											{option.department_name}
										</option>
									))}
							</select>
							{errors.business_unit_id && (<small className="form-text text-danger">{errors.business_unit_id.message}</small>)}
						</Col>
						<Col sm={12}>
							<label>Description</label>
							<textarea
								placeholder="Description"
								className="form-control"
								name="phase_description"
								id='text-edit'
								ref={register({})}
							/>
						</Col>
					</Row>
					<Row className="mt-4 mb-2">
						<Col sm={12} className='buttonSection'>
							<Button variant="primary" type='submit'>{params.mode === 'add' ? 'Add' : "Update"} Phase</Button>
							<Button variant="outline-danger" onClick={() => { navigate(-1) }}>
								Cancel
							</Button>
						</Col>
					</Row>
				</form>
			</div>
		</>
	)
}

export default Index
