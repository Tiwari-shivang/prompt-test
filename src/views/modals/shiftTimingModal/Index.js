import React from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Input } from '../../widgets/formComponents/Input'
import { requiredField } from '../../../utilits/validation'
import './style.scss'
import { useCreateShiftTiming } from '../../../query/shiftTiming/shiftTimingQuery'


const Index = (props) => {
	const { shiftTimingPopupOpen, shiftTimingPopupClose } = props
	const { register, handleSubmit, errors, formState } = useForm({
		mode: "onTouched"
	});
	const { data, isLoading, mutateAsync } = useCreateShiftTiming()

	const handleOnSubmit = (data) => {
		mutateAsync(data)
		shiftTimingPopupClose()
	}
	return (
		<>
			<Modal
				className="shiftTiming"
				show={shiftTimingPopupOpen}
				onHide={shiftTimingPopupClose}
				centered
			>
				<Modal.Header closeButton >
					<Modal.Title>Add Shift Timing</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit(handleOnSubmit)}>
						<Row className="my-3">
							<Col sm={12}>
								<label className={`${errors.start_time ? "text-danger" : ""}`}>Start Time*</label>
								<Input
									type="time"
									//step="1"
									name="start_time"
									className="form-control"
									reference={register({
										required: requiredField(),
									})}
								/>
								{errors.start_time && (<small className="form-text text-danger">{errors.start_time.message}</small>)}
							</Col>
							<Col sm={12}>
								<label className={`${errors.end_time ? "text-danger" : ""}`}>End Time*</label>
								<Input
									type="time"
									//step="1"
									name="end_time"
									className="form-control"
									reference={register({
										required: requiredField(),
									})}
								/>
								{errors.end_time && (<small className="form-text text-danger">{errors.end_time.message}</small>)}
							</Col>
						</Row>
						<Row className="mt-4 mb-2">
							<Col sm={12} className='buttonSection'>
								<Button disabled={!formState.isValid} variant="primary" type="submit">
									Add
								</Button>
								<Button variant="outline-danger" onClick={shiftTimingPopupClose}>
									Cancel
								</Button>
							</Col>
						</Row>
					</form>
				</Modal.Body>
			</Modal>
		</>
	)
}

export default Index
