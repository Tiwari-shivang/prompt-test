import React, { useState } from 'react'
import { Button, Col, Modal, Row } from "react-bootstrap"
import BootstrapTable from 'react-bootstrap-table-next'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Input } from '../../widgets/formComponents/Input'
import { useRecoilValue } from 'recoil'
import Breadcrumb from '../../../components/Breadcrumb'
import { requiredField, emailPattern, PhonePattern } from '../../../utilits/validation'
import { useAddAskForTraineeRating } from '../../../query/members/addMembers/addMembersQuery'
import { useGetAllTraineesForRating } from '../../../query/members/allMembers/allMembersQuery'
import { authState } from '../../../recoil/authRecoil'
import './style.scss'

const Index = () => {
	const navigate = useNavigate();
	const empDetail = useRecoilValue(authState)
	const [addPeriodModalOpen, setAddPeriodModalOpen] = useState(false)
	const [getRating, setGetRating] = useState(false)
	const { data: getAllTraineeForRating, isLoading: isLoadingAllClient } = useGetAllTraineesForRating();

	const handleAddPeriod = (row, e) => {
		setGetRating(row)
		setAddPeriodModalOpen(true)
	}

	const columns = [
		{
			dataField: 'trainee_name',
			text: 'Trainee Name',
			formatter: (cellContent, row) => (
				<div className="traineeNameCol">
					{cellContent}
				</div>
			),
		},
		{
			dataField: 'mentor_name',
			text: 'Mentor',
			formatter: (cellContent, row) => (
				<div className="mentorNameCol">
					{cellContent}
				</div>
			),
		},
		{
			dataField: 'reporting_manager_name',
			text: 'Project Manager',
			formatter: (cellContent, row) => (
				<div className="penNameCol">
					{cellContent}
				</div>
			),
		},
		{
			// dataField: '',
			text: 'Action',
			formatter: (cellContent, row) => (
				<div className="actionCol">
					<button className='btn btn-primary' onClick={(e) => handleAddPeriod(row, e)}>Request rating</button>
				</div>
			),
		},
		{
			// dataField: '',
			text: 'Ratings',
			formatter: (cellContent, row) => (
				<div className="ratingsCol">
					<button className='btn btn-outline-primary' onClick={() => { navigate(`/hrAccess/traineeInfo/${row.emp.uuid}`, { state: { "name": row.trainee_name } }) }}>Full details</button>
				</div>
			),
		},
	]

	return (
		<>
			<Row className='nav mb-2'>
				<Col xs={4}>
					<Breadcrumb />
				</Col>
			</Row>
			<div className='traineeFeedback'>
				<BootstrapTable
					keyField="id"
					data={getAllTraineeForRating ? getAllTraineeForRating : []}
					columns={columns}
					condensed
				/>
			</div>
			<AskForTraineeRating
				ratingModalOpen={addPeriodModalOpen}
				updateModalClose={() => setAddPeriodModalOpen(false)}
				dataForRating={getRating}
			/>
		</>
	)
}

export const AskForTraineeRating = (props) => {
	const { ratingModalOpen, updateModalClose, dataForRating } = props
	const { register, handleSubmit, errors, formState } = useForm({
		mode: "onTouched"
	});
	const { mutateAsync } = useAddAskForTraineeRating()

	const addUpdatePeriodHandler = (data) => {
		const details = {
			...data,
			trainee_id: dataForRating.emp.uuid,
			mentor_id: dataForRating.mentor_id,
			reporting_manager: dataForRating.reporting_manager_id,
			// start_date:"2022-12-30",
			// end_date: "2023-01-31", 
		}
		mutateAsync(details)
		updateModalClose()
	}

	return (
		<>
			<Modal
				className="commonModal"
				show={ratingModalOpen}
				onHide={updateModalClose}
				centered
			>
				<Modal.Header closeButton >
					<Modal.Title>Rating Trainee Period</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit(addUpdatePeriodHandler)}>
						<Row className="my-3">
							<Col sm={12}>
								<label className={`${errors.start_date ? "text-danger" : ""}`}>From *</label>
								<Input type="date" placeholder="From" className="form-control datePick" name="start_date" max="9999-12-31" reference={register({ required: requiredField(), })} />
								{errors.start_date && (<small className="form-text text-danger">{errors.start_date.message}</small>)}
							</Col>
						</Row>
						<Row className="my-3">
							<Col sm={12}>
								<label className={`${errors.end_date ? "text-danger" : ""}`}>To *</label>
								<Input type="date" placeholder="To" className="form-control datePick" name="end_date" max="9999-12-31" reference={register({ required: requiredField(), })} />
								{errors.end_date && (<small className="form-text text-danger">{errors.end_date.message}</small>)}
							</Col>
						</Row>
						<Row className="mt-4 mb-2">
							<Col sm={12} className='buttonSection'>
								<Button disabled={!formState.isValid} variant="primary" type='submit'>Send</Button>
								<Button variant="outline-danger" onClick={updateModalClose}>Cancel</Button>
							</Col>
						</Row>
					</form>
				</Modal.Body>
			</Modal>
		</>
	)
}

export default Index