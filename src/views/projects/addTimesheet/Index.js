import React, { useState } from 'react'
import { Button, Col, Row } from "react-bootstrap"
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { useGetCountries } from '../../../query/country/countriesQuery'
import { useGetAllProjectWithAssociatedEmployee } from '../../../query/projects/allProjects/allProjectsQuery'
import { useAddResignation } from '../../../query/resignation/addResignation/addResignationQuery'
import { authState } from '../../../recoil/authRecoil'
import { requiredField } from '../../../utilits/validation'
import { Input } from '../../widgets/formComponents/Input'
import './style.scss'
import { useCreateProjectTimesheet } from '../../../query/attendance/attendanceQuery'

const Index = () => {
	const navigate = useNavigate();
	const { setError, formState, getValues, reset, setValue, register, handleSubmit, formState: { errors } } = useForm({
		mode: "onTouched"
	});
	const empDetail = useRecoilValue(authState)
	const { data: addResign, isLoading: isLoadingAddResign, mutateAsync: addMutateAsync } = useCreateProjectTimesheet()
	const { data: countryList, isLoading: isLoadingCountryList, } = useGetCountries();
	const { data: projectsList, } = useGetAllProjectWithAssociatedEmployee({ empId: empDetail.uuid });
	const [fileName, setFileName] = useState("")
	const [file, setFile] = useState("")

	const onSubmit = (data) => {
		const val = {
			"project_uuid": "a0ecbed2",
			"emp_uuid": empDetail && empDetail.uuid,
			"work_item": data.work_item,
			"job_name": data.job_name,
			"date": data.date,
			"total_time": data.total_time,
			"attachment": file,
		}
		addMutateAsync(val)
		setFile("")
		setFileName("")
		reset("")
	}

	const uploadFile = async (e) => {
		const file = e.target.files[0]
		const base64 = await convertBase64(file)
		setFile(base64)
		setFileName(file.name)
	}

	const convertBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.onload = () => {
				resolve(fileReader.result)
			}

			fileReader.onerror = (error) => {
				reject(error)
			}
		})
	}

	return (
		<div className='projectTimesheet container'>
			<div className='headerRow cardCustomTitle mb-3'>
				Timesheet
			</div>
			<form className='formAddResignation' onSubmit={handleSubmit(onSubmit)}>
				<Row>
					<Col sm={12} md={6} className='mb-3'>
						<label>Project Name *</label>
						<select
							className="form-control"
							name="project_uuid"
						>
							<option value="">select</option>
							{
								projectsList?.project_with_employee?.map((item) =>
									<option value={item.project.project_uuid}>{item.project.project_name}</option>
								)
							}
						</select>
						{errors.reason_for_leaving && (<small className="form-text text-danger">{errors.reason_for_leaving.message}</small>)}
					</Col>
					<Col sm={12} md={6} className='mb-3'>
						<label>Job Name *</label>
						<Input
							type="text"
							className="form-control"
							name="job_name"
							reference={register({
								required: requiredField(),
							})} />
						{errors.period && (<small className="form-text text-danger">{errors.period.message}</small>)}
					</Col>
					<Col sm={12} md={6} className='mb-3'>
						<label>Work Item *</label>
						<Input
							type="text"
							className="form-control"
							name="work_item"
							reference={register({
								required: requiredField(),
							})} />
						{errors.employee && (<small className="form-text text-danger">{errors.employee.message}</small>)}
					</Col>
					<Col sm={12} md={6} className='mb-3'>
						<label>Date *</label>
						<Input
							type="date"
							className="form-control"
							name="date"
							reference={register({
								required: requiredField(),
							})} />
						{errors.employee && (<small className="form-text text-danger">{errors.employee.message}</small>)}
					</Col>
					<Col sm={12} md={6} className='mb-3'>
						<label>Description *</label>
						<Input
							type="text"
							className="form-control"
							name="description"
							reference={register({
								required: requiredField(),
							})} />
						{errors.employee && (<small className="form-text text-danger">{errors.employee.message}</small>)}
					</Col>
					<Col sm={12} md={6} className='mb-3'>
						<label>Hours *</label>
						<Input
							type="time"
							className="form-control"
							name="total_time"
							reference={register({
								required: requiredField(),
							})} />
						{errors.employee && (<small className="form-text text-danger">{errors.employee.message}</small>)}
					</Col>
					{/* <Col sm={6} className='mb-3'>
						<label>Check-In *</label>
						<Input
							type="time"
							className="form-control"
							name="check_in"
							reference={register({
								required: requiredField(),
								valueAsDate: true,
							})} />
						{errors.check_in && (<small className="form-text text-danger">{errors.check_in.message}</small>)}
					</Col>
					<Col sm={6} className='mb-3'>
						<label>Check-Out *</label>
						<Input
							type="time"
							className="form-control"
							name="check_out"
							reference={register({
								required: requiredField(),
								valueAsDate: true,
							})} />
						{errors.check_out && (<small className="form-text text-danger">{errors.check_out.message}</small>)}
					</Col> */}
					<Col sm={12} className='mb-3'>
						<label>File</label>
						<Input
							type="file"
							className="form-control"
							onChangeHandler={uploadFile}
							id="issueFile"
							reference={register({})} />
						{errors.employee && (<small className="form-text text-danger">{errors.employee.message}</small>)}
					</Col>
				</Row>
				<Row className="mt-4 mb-2">
					<Col sm={12} className="buttonSection">
						<Button variant="primary" type='submit'>Next</Button>
						<Button variant="outline-danger" onClick={() => { navigate(-1) }}>Cancel</Button>
					</Col>
				</Row>
			</form>
		</div >
	)
}

export default Index
