import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { useForm } from 'react-hook-form';
import { FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Breadcrumb from '../../../../components/Breadcrumb';
import { useGetAllResignationForHr } from '../../../../query/resignation/allResignation/allResignationQuery';
import { useUpdateResignationResponse } from '../../../../query/resignation/updateResignation/updateResignationQuery';
import { authRoleState } from '../../../../recoil/authRecoil';
import './style.scss';

const Index = () => {

	const navigate = useNavigate()
	const [deleteModel, setDeleteModel] = useState(false)
	const [addPerformerModel, setAddPerformerModel] = useState(false)
	const [ids, setIds] = useState("")
	const [popover, setPopover] = useState()
	const getRole = useRecoilValue(authRoleState)
	const authRoles = getRole && getRole?.Role
	const { register, handleSubmit, errors, reset, setValue } = useForm();
	const { data: allResignation, isLoading: istopPerformerList } = useGetAllResignationForHr();
	const { mutateAsync: updateResignationResponseMutateAsync } = useUpdateResignationResponse()

	const handelAddTopPerformer = (e) => {
		setAddPerformerModel(true)
	}

	const openDeletePopup = (row, e) => {
		setIds(row.id)
		setDeleteModel(true)
	}

	const actionChangeHandler = (id, response) => {
		const val = {
			"id": id,
			"response": response,
		}
		updateResignationResponseMutateAsync(val);
	}

	const columns = [
		{
			dataField: '',
			text: 'Photos',
			formatter: (cellContent, row) => (
				<div className="photos">
					<div className='headPic' onClick={() => navigate(`/members/memberDetail/${row.emp.uuid}`)}>
						{
							row && row.profile_picture ? <img src={row.profile_picture} /> : <FaUserAlt className='userIcon' />
						}
					</div>
					<div className="fullNameId" onClick={() => navigate(`/members/memberDetail/${row.emp.uuid}`)}>
						<p className='name'>{row.full_name}</p>
						<p>{row.office_id}</p>
					</div>
				</div>
			),
		},
		// {
		// 	dataField: 'ticket_description',
		// 	text: 'Description',
		// },
		// {
		// 	dataField: 'ticket_description',
		// 	text: 'Description',
		// },
		// {
		// 	text: 'Full Name',
		// 	formatter: (cellContent, row) => (
		// 		<div className="fullName" onClick={() => navigate(`/members/memberDetail/${row.emp.uuid}`)}>
		// 			<p>{row.full_name}</p>
		// 		</div>
		// 	),
		// },
		{
			dataField: 'email',
			text: 'Email Address',
		},
		{
			dataField: 'mobile_no',
			text: 'Mobile Number',
		},
		{
			dataField: 'reason_for_leaving',
			text: 'Reason for leaving',
		},
		{
			dataField: 'requested_last_date',
			text: 'Requested Last Date',
		},
		{
			dataField: '',
			text: 'Action',
			// hidden: RoleAccess(authRoles, "accessToEdit-Admin-HR") ? false : true,
			formatter: (cellContent, row) => (
				<div className="actionCol">
					<select className='form-control' onChange={({ target: { value } }) => actionChangeHandler(row.id, value)}>
						<option value="Approved">Approved</option>
						<option value="Pending">Pending</option>
						<option value="Rejected">Rejected</option>
					</select>
				</div>
			),
		},
	]

	return (
		<div className="list">
			<Row className='mb-2'>
				<Col xs={7}>
					<Breadcrumb />
				</Col>
			</Row>
			<Row>
				<Col xs={12}>
					<Card>
						<div className='card-body'>
							<BootstrapTable
								keyField="id"
								wrapperClasses='customScroll'
								data={allResignation ? allResignation : []}
								columns={columns}
								condensed
							/>
						</div>
					</Card>
				</Col>
			</Row>
		</div>
	)
}


// export const DeleteTopPerformerModal = (props) => {
// 	const { deleteModalOpen, deleteModalClose, deleteId } = props
// 	const { mutateAsync } = useDeleteTopPerformer()


// 	const deleteTopPerformerHandler = (e) => {
// 		e.preventDefault()
// 		const details = {
// 			id: deleteId,
// 		}
// 		mutateAsync(details)
// 		deleteModalClose()
// 	}
// 	return (
// 		<>
// 			<Modal
// 				className="commonModal"
// 				show={deleteModalOpen}
// 				onHide={deleteModalClose}
// 				centered
// 			>
// 				<Modal.Header closeButton >
// 					<Modal.Title>Delete Top Performer</Modal.Title>
// 				</Modal.Header>
// 				<Modal.Body>
// 					<Row className="my-3">
// 						<Col sm={12}>
// 							<p>Are you sure want to delete this top performer</p>
// 						</Col>
// 					</Row>
// 					<Row className="mt-4 mb-2">
// 						<Col sm={12}>
// 							<div className='buttonSection'>
// 								<Button variant="primary" onClick={(e) => deleteTopPerformerHandler(e)}>
// 									Yes
// 								</Button>
// 								<Button variant="outline-danger" onClick={deleteModalClose}>
// 									Cancel
// 								</Button>
// 							</div>
// 						</Col>
// 					</Row>
// 				</Modal.Body>
// 			</Modal>
// 		</>
// 	)
// }

// export const AddTopPerformerModal = (props) => {
// 	const { addModalOpen, addModalClose } = props
// 	const [topPerformer, setTopPerformer] = useState([])
// 	const { data: allMember, isLoading: allMemberLoading } = useGetAllMembers();
// 	const { mutateAsync } = useAddTopPerformers()
// 	const { data: allMemberTopPerformers, isLoading: istopPerformerList } = useGetTopPerformer();
// 	const handleSelectTopPerformer = (topPerformer) => {
// 		setTopPerformer(topPerformer)
// 	}

// 	const addTopPerformerHandler = (e) => {
// 		e.preventDefault()
// 		let todaydate = new Date()
// 		const addPerformerData = topPerformer && topPerformer.map((item, i) => {
// 			return {
// 				"empId": item,
// 				"date": Moment(todaydate).format('YYYY-MM-DD')
// 			}
// 		})
// 		mutateAsync(addPerformerData)
// 		addModalClose()
// 	}
// 	return (
// 		<>
// 			<Modal
// 				className="commonModal addTopPerformer"
// 				show={addModalOpen}
// 				onHide={addModalClose}
// 				centered
// 			>
// 				<Modal.Header closeButton >
// 					<Modal.Title>Add Top Performers</Modal.Title>
// 				</Modal.Header>
// 				<Modal.Body>
// 					<form onSubmit={addTopPerformerHandler}>
// 						<Row className="my-3">
// 							<Col sm={12}>
// 								<label>Select Employee</label>
// 								<Select
// 									mode="multiple"
// 									style={{ width: '100%' }}
// 									placeholder="Select Employee"
// 									className="form-control"
// 									name="empId"
// 									onChange={handleSelectTopPerformer}
// 								>
// 									<option value="">Select Employee</option>
// 									{
// 										allMember?.employees?.map((item, i) => {
// 											let flag = true;
// 											allMemberTopPerformers.forEach(element => {
// 												if (element.office_id == item.office_id) {
// 													flag = false;
// 													return;
// 												}
// 											});
// 											return flag ?
// 												<option key={item.uuid} value={item.uuid}>{item.first_name} {item.last_name}</option>
// 												: ''
// 										})
// 									}
// 								</Select>
// 							</Col>
// 							<Col sm={12} className='buttonSection'>
// 								<Button variant="primary" type='submit'>Add</Button>
// 								<Button variant="outline-danger" onClick={addModalClose}>Cancel</Button>
// 							</Col>
// 						</Row>
// 					</form>
// 				</Modal.Body>
// 			</Modal>
// 		</>
// 	)
// }




export default Index

