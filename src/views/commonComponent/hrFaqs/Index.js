import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Modal, Row, Tabs, Tab } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import { useForm } from 'react-hook-form'
import { BiEdit } from "react-icons/bi"
import { requiredField } from '../../../utilits/validation'
import { BsTrash } from "react-icons/bs"
import { useRecoilValue } from 'recoil'
import ITDeclaration from '../../../assets/images/emp/IT-Declaration.svg'
import Breadcrumb from '../../../components/Breadcrumb'
import { useAddFaqs } from '../../../query/faqs/addFaqs/addFaqsQuery'
import { useGetAllFaqs, useGetAllUnansweredFaqs } from '../../../query/faqs/getFaqs/getFaqsQuery'
import { authState } from '../../../recoil/authRecoil'
import { Input } from '../../widgets/formComponents/Input'
import './style.scss'
import { useUpdateFaqs } from '../../../query/faqs/updateFaqs/updateFaqsQuery'
import { useDeleteFaqs } from '../../../query/faqs/deleteFaqs/deleteFaqsQuery'

const FAQs = () => {
	const [updateModalOpen, setUpdateModalOpen] = useState(false)
	const [updateFaqData, setUpdateFaqData] = useState({})
	const [faqId, setfaqId] = useState("")
	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const [addFaqModalOpen, setAddFaqModalOpen] = useState(false)
	const { data: allFaqs, isLoadingFaqs } = useGetAllFaqs();
	const { data: allUnansweredFaqs, isLoadingUnansweredFaqs } = useGetAllUnansweredFaqs();
	const [answerFaqModalOpen, setAnswerFaqModalOpen] = useState(false)
	const [key, setKey] = useState('answered');

	const openPopup = (row) => {
		setUpdateFaqData(row)
		setUpdateModalOpen(true)
	}

	const openDeletePopup = (row) => {
		setfaqId(row.uuid)
		setDeleteModalOpen(true)
	}
	const handleAddFAQ = () => {
		setAddFaqModalOpen(true)
	}

	const columnsAnswered = [
		{
			dataField: 'id',
			text: 'Q no.',
			formatter: (cellContent, row, index) => (
				<div className='qNoCol'>
					{index+1}
				</div>
			),
		},
		{
			dataField: 'title',
			text: 'Question',
		},
		{
			dataField: 'summary',
			text: 'Answer',
		},
		{
			dataField: 'count',
			text: 'Document',
			formatter: (cellContent, row) => (
				<div className='documentCol'>
					<a key={0} className='QuickAccess' download="Quick_Access" href={'file'} >
						<div className='pic pink'>
							<img src={row.documents ? ITDeclaration : "No Document Available"} alt="" />
						</div>
					</a>
				</div>
			),
		},
		{
			dataField: '',
			text: 'Action',
			headerStyle: (colum, colIndex) => {
				return { width: '30px' };
			},
			formatter: (cellContent, row) => (
				<div className="ActionIcon">
					<a className="editIcon" onClick={(e) => openPopup(row, e)}>
						<BiEdit className='icon' />
					</a>
					<a className="deleteIcon" onClick={(e) => openDeletePopup(row, e)}>
						<BsTrash className='icon' />
					</a>
				</div>
			),
		},
	]
	const columnsUnanswered = [
		{
			text: 'Q no.',
			formatter: (cellContent, row, index) => (
				<div className='qNoCol'>
					{index +1}
				</div>
			),
		},
		{
			dataField: 'title',
			text: 'Question',
		},
		{
			text: 'Action',
			formatter: (cellContent, row) => (
				<div className="ActionIcon" onClick={(e) => openPopup(row)}>
					<a className="editIcon" >
						<BiEdit className='icon' />
					</a> Answer
				</div>
			),
		},
	]

	return (
		<div className="faq">
			<Row>
				<Col xs={6}>
					<Breadcrumb />
				</Col>
				<Col xs={6} className="ButtonGroup">
					<Button className='addButton' variant='primary' onClick={handleAddFAQ}>Add FAQ</Button>
				</Col>
			</Row>
			<Row>
				<Col xs={12}>
					<Card>
						<div className='card-body'>
							{/* <BootstrapTable
								keyField="employee_id"
								data={allFaqs ? allFaqs : []}
								columns={columnA}
								condensed
							/> */}
							<Tabs
								id="controlled-tab-example"
								activeKey={key}
								onSelect={(k) => setKey(k)}
								className="mb-3"
							>
								<Tab eventKey="answered" title="Answered">
									<BootstrapTable
										keyField="employee_id"
										data={allFaqs ? allFaqs : []}
										columns={columnsAnswered}
										condensed
									/>
								</Tab>
								<Tab eventKey="unanswererd" title="Unanswered">
									<BootstrapTable
										keyField="employee_id"
										data={allUnansweredFaqs ? allUnansweredFaqs : []}
										columns={columnsUnanswered}
										condensed
									/>
								</Tab>
							</Tabs>
						</div>
					</Card>
				</Col>
			</Row>

			<UpdateFaqModal
				key={key}
				updateModalOpen={updateModalOpen}
				updateModalClose={() => setUpdateModalOpen(false)}
				updateId={updateFaqData}
			/>

			<DeleteFaqModal
				deleteModalOpen={deleteModalOpen}
				deleteModalClose={() => setDeleteModalOpen(false)}
				faqId={faqId}
			/>

			<AddFaqModal
				answerModalOpen={addFaqModalOpen}
				answerModalClose={() => setAddFaqModalOpen(false)}
			/>
		</div>
	)
}

export const DeleteFaqModal = (props) => {
	const { deleteModalOpen, deleteModalClose, faqId } = props
	const { error, isError, mutateAsync } = useDeleteFaqs();
	const deleteFaqHandler = (e) => {
		e.preventDefault()
		mutateAsync(faqId)
		deleteModalClose()
	}
	return (
		<>
			<Modal
				className="commonModal"
				show={deleteModalOpen}
				onHide={deleteModalClose}
				centered
			>
				<Modal.Header closeButton >
					<Modal.Title>Delete FAQ</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row className="my-3">
						<Col sm={12}>
							<p>Are you sure want to delete this FAQ?</p>
						</Col>
					</Row>
					<Row className="mt-4 mb-2">
						<Col sm={12}>
							<div className='buttonSection'>
								<Button variant="primary" onClick={(e) => deleteFaqHandler(e)}>
									Yes
								</Button>
								<Button variant="outline-danger" onClick={deleteModalClose}>
									Cancel
								</Button>
							</div>
						</Col>
					</Row>
				</Modal.Body>
			</Modal>
		</>
	)
}

export const UpdateFaqModal = (props) => {
	const { key, updateModalOpen, updateModalClose, updateId } = props
	const { data: allFaqs, isLoading: isLoadingFaqs } = useGetAllFaqs();
	const { data: allUnansweredFaqs, isLoading: isLoadingUnansweredFaqs } = useGetAllUnansweredFaqs();

	const [formData, setFormData] = useState(
		key == 'answered' ?
			allFaqs?.find(faq => faq.id == updateId) :
			allUnansweredFaqs?.find(faq => faq.id == updateId)
	)
	const { mutateAsync: updateFaqsDataMutateAsync } = useUpdateFaqs()
	const [empId, setEmpId] = useState("")
	const [issueFileState, setIssueFileState] = useState()
	const [issueFileName, setIssueFileName] = useState("")
	const { register, handleSubmit, getValues, reset, errors, formState } = useForm({
		mode: "onTouched"
	});
	const handleSelectEmployee = (e) => {
		setEmpId(e.target.value)
	}

	useEffect(() => {
		reset(formData);
	}, [formData]);

	useEffect(() => {
		setIssueFileState(updateId?.documents)
		reset(updateId);
	}, [updateId]);
	const updateDepartmentHandler = (data) => {
		const details = {
			...data,
			"documents": issueFileState,
			"uuid": updateId.uuid
		}
		updateFaqsDataMutateAsync(details)
		updateModalClose()
	}
	const uploadIssueFile = async (e) => {
		const file = e.target.files[0]
		const base64 = await convertBase64(file)
		setIssueFileState(base64)
		setIssueFileName(file.name)
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
		<>
			<Modal
				className="commonModal"
				show={updateModalOpen}
				onHide={updateModalClose}
				centered
			>
				<Modal.Header closeButton >
					<Modal.Title>Update FAQ</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row className="mb-3">
						<Col sm={12}>
							<form onSubmit={handleSubmit(updateDepartmentHandler)}>
								<Row className="my-3">
									<Col sm={12} className="mb-3">
										<label>Title *</label>
										<Input type="text" placeholder="Title" className="form-control" defaultValue={updateId?.title} name="title" reference={register({ required: requiredField(), })} />
										{errors.title && (<small className="form-text text-danger">{errors.title.message}</small>)}
									</Col>
									<Col sm={12} className="mb-3">
										<label>Sumary *</label>
										<textarea type="text" placeholder="Summary" className="form-control" defaultValue={updateId?.summary} name="summary" ref={register({ required: requiredField(), })} />
										{errors.summary && (<small className="form-text text-danger">{errors.summary.message}</small>)}
									</Col>
									<Col>
										<label>Add a file</label>
										<Input
											type="file"
											name='file'
											className="form-control customStyle"
											onChangeHandler={uploadIssueFile}
											defaultValue={issueFileState}
											id="issueFile"
											reference={register({})} />
									</Col>
								</Row>
								<Row className="mt-4 mb-2">
									<Col sm={12} className='buttonSection'>
										<Button variant="primary" disabled={!formState.isValid} type='submit'>Update</Button>
										<Button variant="outline-danger" onClick={updateModalClose}>
											Cancel
										</Button>
									</Col>
								</Row>
							</form>
						</Col>
					</Row>
					{/* <Row className="mt-4 mb-2">
						<Col sm={12}>
							<div className='buttonSection'>
								<Button variant="primary" disabled={empId === "" ? true : false} onClick={(e) => updateDepartmentHandler(e)}>
									Update
								</Button>
								<Button variant="outline-danger" onClick={updateModalClose}>
									Cancel
								</Button>
							</div>
						</Col>
					</Row> */}
				</Modal.Body>
			</Modal>
		</>
	)
}

export const AddFaqModal = (props) => {
	const { answerModalOpen, answerModalClose } = props
	const empDetails = useRecoilValue(authState);
	const { register, handleSubmit, getValues, reset, errors, formState } = useForm({
		mode: "onTouched"
	});
	const { mutateAsync: addFaqsMutateAsync } = useAddFaqs()
	const [issueFileState, setIssueFileState] = useState()
	const [issueFileName, setIssueFileName] = useState("")

	const uploadIssueFile = async (e) => {
		const file = e.target.files[0]
		const base64 = await convertBase64(file)
		setIssueFileState(base64)
		setIssueFileName(file.name)
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

	const addFaqsHandler = (data) => {
		const addFaqsModel = {
			...data,
			"emp_uuid": empDetails.uuid,
			"documents": issueFileState,
		}
		addFaqsMutateAsync(addFaqsModel)

		reset("")
		answerModalClose()
	}

	const addModalClose = () => {
		reset("")
		answerModalClose()
	}

	return (
		<>
			<Modal
				className="commonModal"
				show={answerModalOpen}
				onHide={addModalClose}
				centered
			>
				<Modal.Header closeButton >
					<Modal.Title>Add an FAQ</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit(addFaqsHandler)}>
						<Row className="my-3">
							{/* <Col sm={12} className="mb-3">
								<label>Category</label>
								<select type='select' className="form-control" name="first_name">
									<option>select</option>
									<option>IT</option>
									<option>Finance</option>
									<option>Bugs</option>
								</select>
							</Col>
							<Col sm={12} className="mb-3">
								<label>Subategory</label>
								<select type='select' className="form-control" name="first_name">
									<option>select</option>
									<option>IT</option>
									<option>Finance</option>
									<option>Bugs</option>
								</select>
							</Col> */}
							<Col sm={12} className="mb-3">
								<label>Question *</label>
								<textarea type="text" placeholder="Question" className="form-control" name="title" ref={register({ required: requiredField(), })} />
								{errors.title && (<small className="form-text text-danger">{errors.title.message}</small>)}
							</Col>
							<Col sm={12} className="mb-3">
								<label>Answer *</label>
								<textarea type="text" placeholder="Answer" className="form-control" name="summary" ref={register({ required: requiredField(), })} />
								{errors.summary && (<small className="form-text text-danger">{errors.summary.message}</small>)}
							</Col>
							<Col>
								<label>Add a file</label>
								<Input
									type="file"
									className="form-control customStyle"
									onChangeHandler={uploadIssueFile}
									id="issueFile"
									reference={register({})} />
							</Col>
						</Row>
						<Row className="mt-4 mb-2">
							<Col sm={12} className='buttonSection'>
								<Button variant="primary" type='submit'>Add</Button>
								<Button variant="outline-danger" onClick={addModalClose}>Cancel</Button>
							</Col>
						</Row>
					</form>
				</Modal.Body>
			</Modal>
		</>
	)
}

// export const AnswerFaqModal = (props) => {
// 	const { answerModalOpen, answerModalClose } = props
// 	const { answerFaqModalOpen, answerFaqModalClose } = props
// 	const [departmentId, setDepartmentId] = useState()
// 	const [employeeId, setemployeeId] = useState()
// 	const { data: allDepartmentWithoutDir } = useGetDepartmentsWithoutDirector()
// 	const { data: allEmpOfDepartment } = useGetAllByEmployeeDepartmentId({ id: departmentId })
// 	const { mutateAsync } = useUpdateDeleteDirector()
// 	const { register, handleSubmit, getValues, reset, errors } = useForm({
// 		mode: "onTouched"
// 	});
// 	const [issueFileState, setIssueFileState] = useState()
// 	const [issueFileName, setIssueFileName] = useState("")

// 	const uploadIssueFile = async (e) => {
// 		const file = e.target.files[0]
// 		const base64 = await convertBase64(file)
// 		setIssueFileState(base64)
// 		setIssueFileName(file.name)
// 	}
// 	const convertBase64 = (file) => {
// 		return new Promise((resolve, reject) => {
// 			const fileReader = new FileReader();
// 			fileReader.readAsDataURL(file);
// 			fileReader.onload = () => {
// 				resolve(fileReader.result)
// 			}

// 			fileReader.onerror = (error) => {
// 				reject(error)
// 			}
// 		})
// 	}

// 	const addDepartmentHandler = (data) => {
// 		const addDepartment = {
// 			id: departmentId,
// 			directorId: data.empName
// 		}
// 		mutateAsync(addDepartment)

// 		reset("")
// 		setemployeeId("")
// 		setDepartmentId("")
// 		answerModalOpen()
// 	}

// 	const addModalClose = () => {
// 		reset("")
// 		setemployeeId("")
// 		setDepartmentId("")
// 		addDepartModalClose()
// 	}

// 	return (
// 		<>
// 			<Modal
// 				className="commonModal"
// 				show={addFaqModalOpen}
// 				onHide={addModalClose}
// 				centered
// 			>
// 				<Modal.Header closeButton >
// 					<Modal.Title>Add an FAQ</Modal.Title>
// 				</Modal.Header>
// 				<Modal.Body>
// 					<form onSubmit={handleSubmit(addFaqHandler)}>
// 						<Row className="my-3">
// 							<Col sm={12} className="mb-3">
// 								<label>Category</label>
// 								<select type='select' className="form-control" name="first_name">
// 									<option>select</option>
// 									<option>IT</option>
// 									<option>Finance</option>
// 									<option>Bugs</option>
// 								</select>
// 							</Col>
// 							<Col sm={12} className="mb-3">
// 								<label>Subategory</label>
// 								<select type='select' className="form-control" name="first_name">
// 									<option>select</option>
// 									<option>IT</option>
// 									<option>Finance</option>
// 									<option>Bugs</option>
// 								</select>
// 							</Col>
// 							<Col sm={12} className="mb-3">
// 								<label>Question</label>
// 								<textarea disabled type="text" placeholder="Question" className="form-control" name="first_name" />
// 							</Col>
// 							<Col sm={12} className="mb-3">
// 								<label>Answer</label>
// 								<textarea type="text" placeholder="Answer" className="form-control" name="first_name" />
// 							</Col>
// 							<Col>
// 								<label>Add a file</label>
// 								<Input
// 									type="file"
// 									className="form-control customStyle"
// 									onChangeHandler={uploadIssueFile}
// 									name="issue_file"
// 									id="issueFile"
// 									reference={register({})} />
// 							</Col>
// 						</Row>
// 						<Row className="mt-4 mb-2">
// 							<Col sm={12} className='buttonSection'>
// 								<Button variant="primary" type='submit' disabled={employeeId ? false : true}>Add</Button>
// 								<Button variant="outline-danger" onClick={addModalClose}>Cancel</Button>
// 							</Col>
// 						</Row>
// 					</form>
// 				</Modal.Body>
// 			</Modal>
// 		</>
// 	)
// }
export default FAQs