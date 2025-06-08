import { React, useState } from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useUploadHolidays } from '../../../query/holidays/holidaysQuery'
import { toaster } from '../../../utilits/toast'
import { requiredField } from '../../../utilits/validation'
import { Input } from '../../widgets/formComponents/Input'
import './style.scss'

const Index = (props) => {
	const { uploadHolidaysPopupOpen, uploadHolidaysPopupClose } = props
	const [file, setFile] = useState(null);
	const { register, handleSubmit, errors ,formState} = useForm({
		mode: "onTouched"
	});
	const { data, isLoading, mutateAsync } = useUploadHolidays()

	const onChangePicture = async (e) => {
		const file = e.target.files[0]
		const imgType = file.name.match(/\.(csv)$/)
		if (imgType) {
			setFile(file);
		}
		else {
			toaster("error", "The File Type should be in jpg ,jpeg ,png");
		}
	};

	const handleOnSubmit = () => {
		const data = {
			"file": file
		}
		mutateAsync(data)
		uploadHolidaysPopupClose()
	}
	return (
		<>
			<Modal
				className="shiftTiming"
				show={uploadHolidaysPopupOpen}
				onHide={uploadHolidaysPopupClose}
				centered
			>
				<Modal.Header closeButton >
					<Modal.Title>Upload File</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit(handleOnSubmit)}>
						<Row className="my-3">
							<Col sm={12}>
								<label className={`${errors.email ? "text-danger" : ""}`}>Upload File*</label>
								<Input
									type="file"
									name="file"
									onChangeHandler={onChangePicture}
									className="form-control"
									reference={register({
										required: requiredField(),
									})}
								/>
								{errors.file && (<small className="form-text text-danger">{errors.file.message}</small>)}
							</Col>
						</Row>
						<Row className="mt-4 mb-2">
							<Col sm={12} className='buttonSection'>
								<Button disabled={!formState.isValid}  variant="primary" type="submit">
									Upload
								</Button>
								<Button variant="outline-danger" onClick={uploadHolidaysPopupClose}>
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
