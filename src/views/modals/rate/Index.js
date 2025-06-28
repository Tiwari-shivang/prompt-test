import Moment from 'moment'
import React from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { useRecoilValue } from 'recoil'
import { authState } from '../../../recoil/authRecoil'
import './style.scss'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAddLeaveApply } from '../../../query/leave/addLeaves/addLeavesQuery'
import { requiredField } from '../../../utilits/validation'
import { Input } from '../../widgets/formComponents/Input'
import { useUpdateMenteeRating } from '../../../query/members/updateMembers/updateMembersQuery'

const Index = ({ rateModalVisible, setRateModalVisible , traineeId }) => {

	return (
		<Modal
			className="rateModal"
			show={rateModalVisible}
			onHide={() => setRateModalVisible(false)}
		>
			<Modal.Header closeButton >
				<Modal.Title>Rate</Modal.Title>
			</Modal.Header>
			<Modal.Body closeButton>
				<Row className='gx-0'>
					<Col sm={12}>
						<RateForm className='rateContent customScroll' setRateModalVisible={setRateModalVisible} traineeId={traineeId} />
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	)
}

const RateForm = ({ setRateModalVisible , traineeId }) => {
	const empDetail = useRecoilValue(authState)
	const { mutateAsync: updateMenteeRatingMutateAsync } = useUpdateMenteeRating();
	const { setError, getValues, register, handleSubmit, formState: { errors }, formState } = useForm({
		mode: "onTouched"
	});

	const onSubmit = (data) => {
		const traineeData={
			...data,
			trainee_id:traineeId,
			rating_given_by:empDetail && empDetail.uuid
		}
		updateMenteeRatingMutateAsync(traineeData)
		setRateModalVisible(false);
	}

	return (
		<>
			<div className='rateForm'>
				<form className='formRate' onSubmit={handleSubmit(onSubmit)}>
					<Row>
						<Col sm={12} className="mb-3">
							<label>Technical*</label>
							<Input
								type="number"
							    placeholder="technical"
								className="form-control"
								name="technical"
								reference={register({
									required: requiredField(),
								})} />
							{errors.technical && (<small className="form-text text-danger">{errors.technical.message}</small>)}
						</Col>
						<Col sm={12} className="mb-3">
							<label>Team Player*</label>
							<Input
								type="number"
							    placeholder="Team Player"
								className="form-control"
								name="team_player"
								reference={register({
									required: requiredField(),
								})} />
							{errors.team_player && (<small className="form-text text-danger">{errors.team_player.message}</small>)}
						</Col>
						<Col sm={12} className="mb-3">
							<label>Ability To Work Independently*</label>
							<Input
								type="number"
								placeholder="Ability to work independently"
								className="form-control"
								name="ability_to_work_independent"
								reference={register({
									required: requiredField(),
								})} />
							{errors.ability_to_work_independent && (<small className="form-text text-danger">{errors.ability_to_work_independent.message}</small>)}
						</Col>
						<Col sm={12} className="mb-3">
							<label>Knowledge Gained Regarding The Project*</label>
							<Input
								type="number"
								placeholder="Knowledge gained regarding the project"
								className="form-control"
								name="knowledge_gained_about_project"
								reference={register({
									required: requiredField(),
								})} />
							{errors.knowledge_gained_about_project && (<small className="form-text text-danger">{errors.knowledge_gained_about_project.message}</small>)}
						</Col>
						<Col sm={12} className="mb-3">
							<label>Dedication Towards Work*</label>
							<Input
								type="number"
								placeholder="Dedication towards work*"
								className="form-control"
								name="dedication"
								reference={register({
									required: requiredField(),
								})} />
							{errors.dedication && (<small className="form-text text-danger">{errors.dedication.message}</small>)}
						</Col>
						<Col sm={12} className="mb-3">
							<label>Integrity*</label>
							<Input
								type="number"
								placeholder="Integrity"
								className="form-control"
								name="integrity"
								reference={register({
									required: requiredField(),
								})} />
							{errors.integrity && (<small className="form-text text-danger">{errors.integrity.message}</small>)}
						</Col>
						<Col sm={12} className="mb-3">
							<label>Communication Skills*</label>
							<Input
								type="number"
								placeholder="Communication skills"
								className="form-control"
								name="communication_skill"
								reference={register({
									required: requiredField(),
								})} />
							{errors.communication_skill && (<small className="form-text text-danger">{errors.communication_skill.message}</small>)}
						</Col>
						<Col sm={12} className="mb-3">
							<label>Overall Score*</label>
							<Input
								type="number"
								placeholder="Overall Score"
								className="form-control"
								name="over_all_rating"
								reference={register({
									required: requiredField(),
								})} />
							{errors.over_all_rating && (<small className="form-text text-danger">{errors.over_all_rating.message}</small>)}
						</Col>
						<Col sm={12} className="mb-3">
							<label>Feedback*</label>
							<textarea
								type="text"
								placeholder="Enter the feedback here. "
								className="form-control"
								name="feedback"
								reference={register({
									required: requiredField(),
								})} />
							{errors.feedback && (<small className="form-text text-danger">{errors.feedback.message}</small>)}
						</Col>
					</Row>
					<Row>
						<Col sm={12} className='buttonSection'>
							<Button variant='primary' size='sm' disabled={!formState.isValid} type='submit' className="submitBtn">Submit</Button>
							<Button variant='primary' size='sm' className="closeBtn" onClick={() => setRateModalVisible(false)}>Cancel</Button>
						</Col>
					</Row>
				</form>
			</div >
		</>
	)
}
export default Index
