import React, { useState } from 'react';
import { Accordion, Button, Card, Col, Dropdown, Modal, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { BiEdit } from "react-icons/bi";
import { requiredField } from '../../../utilits/validation'
import { BsTrash } from "react-icons/bs";
import ITDeclaration from '../../../assets/images/emp/IT-Declaration.svg';
import Breadcrumb from '../../../components/Breadcrumb';
import { useGetAllByEmployeeDepartmentId, useGetDepartmentsWithoutDirector } from "../../../query/department/directory/query";
import { useAskQuestionFaqs } from '../../../query/faqs/addFaqs/addFaqsQuery';
import { useGetAllFaqs, useGetAllUnansweredFaqs } from '../../../query/faqs/getFaqs/getFaqsQuery';
import { useGetAllDirectorAlongDepartmentEmployeeCount } from "../../../query/members/allMembers/allMembersQuery";
import { useUpdateDeleteDirector } from '../../../query/members/updateMembers/updateMembersQuery';
import { Input } from '../../widgets/formComponents/Input';
import './style.scss';
import { authState } from '../../../recoil/authRecoil';
import { useRecoilValue } from 'recoil';
import { useGetAllquickAccess } from '../../../query/quickAccess/quickAccessQuery';

const FAQs = () => {
	const [updateModalOpen, setUpdateModalOpen] = useState(false)
	const [ids, setIds] = useState("")
	const { data: allFaqs, isLoadingFaqs } = useGetAllUnansweredFaqs();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const [addFaqModalOpen, setAddFaqModalOpen] = useState(false)
	//const { data, isLoading } = useGetAllDirectorAlongDepartmentEmployeeCount();
	const [type, setType] = useState('answered');
	const [category, setCategory] = useState('IT');

	const handleAddFAQ = () => {
		setAddFaqModalOpen(true)
	}

	const columns = [
		{
			dataField: 'name',
			text: 'Title',
		},
		{
			dataField: 'department_name',
			text: 'Subject',
		},
		{
			dataField: 'count',
			text: 'Document',
			formatter: (cellContent, row) => (
				<div className='documentCol'>
					<a key={0} className='QuickAccess' download="Quick_Access" href={'file'} >
						<div className='pic pink'>
							<img src={ITDeclaration} alt="" />
						</div>
					</a>
				</div>
			),
		},
		{
			dataField: '',
			text: 'Action',
			formatter: (cellContent, row) => (
				<div className="ActionIcon">
					<a className="editIcon">
						<BiEdit className='icon' />
					</a>
					<a className="deleteIcon">
						<BsTrash className='icon' />
					</a>
				</div>
			),
		},
	]

	const customToggle = React.forwardRef(({ children, onClick }, ref) => (
		<a
			href=""
			ref={ref}
			onClick={e => {
				e.preventDefault();
				onClick(e);
			}}
		>
			<button className='btn btn-sm btn-primary'>Filter</button>
		</a>
	));

	return (
		<div className="faq">
			<Row>
				<Col xs={6} className='leftNav'>
					<Breadcrumb />
					{/* <Input type="text" placeholder="search in FAQs" className={'form-control'}/> */}
				</Col>
				<Col xs={6} className="buttonGroup">
					{/* <select onChange={(e) => setCategory(e.target.value)}>
						<option value="IT">Select Category</option>
						<option value="IT">IT</option>
						<option value="HR">HR</option>
						<option value="Finance">Finance</option>
					</select> */}
					<button className='btn btn-sm btn-primary addBtn' onClick={handleAddFAQ}>Add</button>
					<Dropdown>
						<Dropdown.Toggle as={customToggle}>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item onClick={() => setType('answered')}>Answered</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item onClick={() => setType('unanswered')}>Unanswered</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</Col>
			</Row>
			<Row>
				<Col xs={12}>
					<Card>
						<div className='card-body'>
							<div className='headerRow'>
								<h5>{category} related FAQs</h5>
							</div>
							<Accordion alwaysOpen>
								{
									allFaqs && allFaqs.length > 0 ? allFaqs.map((item, index) => (
										<Accordion.Item eventKey={index}>
											<Accordion.Header>{item.title}?</Accordion.Header>
											<Accordion.Body>
												<p>Category: IT</p>
												<p>Subcategory: bug</p>
												<p>
													{item?.summary}
												</p>
											</Accordion.Body>
										</Accordion.Item>
									))
										:
										<div className='birthdayCart'>
											<div className='name'>
												<p>There is no data Available</p>
												{/* <Button variant='primary'>Wish {item.gender === "Male" ? "him" : "her"}</Button> */}
											</div>
										</div>
								}
							</Accordion>
							<AddFaqModal
								addFaqModalOpen={addFaqModalOpen}
								addFaqModalClose={() => setAddFaqModalOpen(false)}
							/>
						</div>
					</Card>
				</Col>
			</Row>
		</div >
	)
}

export const AddFaqModal = (props) => {
	const { addFaqModalOpen, addFaqModalClose } = props
	const [employeeId, setemployeeId] = useState()
	const empDetails = useRecoilValue(authState);
	const { mutateAsync, isLoading: isLoadingAskQuestion } = useAskQuestionFaqs()
	const { register, handleSubmit, getValues, reset, errors, formState } = useForm({
		mode: "onTouched"
	});

	const addFaqHandler = (data) => {
		const addFaq = {
			...data,
			emp_uuid: empDetails.uuid
		}
		mutateAsync(addFaq)

		reset("")
		setemployeeId("")
		addFaqModalClose()
	}

	const addModalClose = () => {
		reset("")
		setemployeeId("")
		addFaqModalClose()
	}

	return (
		<>
			<Modal
				className="commonModal"
				show={addFaqModalOpen}
				onHide={addModalClose}
				centered
			>
				<Modal.Header closeButton >
					<Modal.Title>Add an FAQ</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit(addFaqHandler)}>
						<Row className="my-3">
							<Col sm={12} className="mb-3">
								<label>Question</label>
								<Input type="text" placeholder="Question" className="form-control" name="queries" reference={register({ required: requiredField(), })} />
							</Col>
							<Col sm={12} className='buttonSection'>
								<Button variant="primary" disabled={(!formState.isValid) || isLoadingAskQuestion} type='submit'>{isLoadingAskQuestion ? 'Adding...' : 'Add'}</Button>
								<Button variant="outline-danger" onClick={addModalClose}>
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

export default FAQs