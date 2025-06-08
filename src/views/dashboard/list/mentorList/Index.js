import React, { useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { useForm } from 'react-hook-form';
import { BiEdit } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Breadcrumb from '../../../../components/Breadcrumb';
import { useAddMenteeMentor } from '../../../../query/members/addMembers/addMembersQuery';
import { useGetAllMembers, useGetAllMenteeMentor } from '../../../../query/members/allMembers/allMembersQuery';
import { useDeleteMenteeMentor } from '../../../../query/members/deleteMembers/deleteMembersQuery';
import { useUpdateMenteeMentor } from '../../../../query/members/updateMembers/updateMembersQuery';
import { authState } from '../../../../recoil/authRecoil';
import './style.scss';

const Index = () => {

	const navigate = useNavigate()
	const empDetail = useRecoilValue(authState)
	const [deleteModel, setDeleteModel] = useState(false)
	const [addMentorModel, setAddMentorModel] = useState(false)
	const [ids, setIds] = useState("")
	const [updateMenteeId, setUpdateMenteeId] = useState("")
	const { data: allMenteeMentor } = useGetAllMenteeMentor(empDetail && empDetail.uuid);

	const handelAddTopPerformer = (id) => {
		setUpdateMenteeId(id)
		setAddMentorModel(true)
	}

	const openDeletePopup = (row, e) => {
		setIds(row.mentee_id)
		setDeleteModel(true)
	}

	const columns = [
		{
			dataField: '',
			text: 'Mentee Name',
			formatter: (cellContent, row) => (
				<div className='departmentHead' onClick={() => { navigate(`/members/memberDetail/${row.id}`) }}>
					<div className='headPic'>
						{
							row && row.profile_picture ? <img src={row.profile_picture} alt="" /> : <FaUserAlt className='userIcon' />
						}
					</div>
					<p>{row.full_name}</p>
				</div>
			),
		},
		{
			dataField: 'email',
			text: 'Mentee Email Address',
		}, {
			dataField: 'Mentor Name',
			text: 'Mentor Name',
			formatter: (cellContent, row) => (
				<div className="departmentHead">
					<div className="fullName" onClick={() => navigate(`/members/memberDetail/${row.emp.uuid}`)}>
						{row.mentor_office_id ? <p>{row.mentor_name}</p> : <p>Not Assigned</p>}
					</div>
				</div>
			),
		},
		{
			dataField: 'mentor_office_id',
			text: 'Mentor Office Id',
		},
		{
			dataField: '',
			text: 'Action',
			formatter: (cellContent, row) => (
				<div className="ActionIcon">
					<a className="editIcon" >
						<BiEdit className='icon' onClick={() => handelAddTopPerformer(row.mentee_id)} />
					</a>
					<a className="deleteIcon" onClick={(e) => openDeletePopup(row, e)}>
						<BsTrash className='icon' />
					</a>
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
				<Col xs={5} className='buttonGroup'>
					<Button size='sm' variant='primary' onClick={(e) => handelAddTopPerformer()}>Add Mentor</Button>
				</Col>
			</Row>


			<Row>
				<Col xs={12}>
					<Card>
						<div className='card-body'>
							<BootstrapTable
								keyField="id"
								wrapperClasses='customScroll'
								data={allMenteeMentor ? allMenteeMentor : []}
								columns={columns}
								condensed
							/>
						</div>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<DeleteMentorModal
						deleteModalOpen={deleteModel}
						deleteModalClose={() => setDeleteModel(false)}
						deleteId={ids}
					/>
					<AddMentorModal
						addModalOpen={addMentorModel}
						updateMenteeId={updateMenteeId}
						allMenteeMentorData={allMenteeMentor}
						addModalClose={() => setAddMentorModel(false)}
					/>
				</Col>
			</Row>

		</div>
	)
}


export const DeleteMentorModal = (props) => {
	const { deleteModalOpen, deleteModalClose, deleteId } = props
	const { mutateAsync } = useDeleteMenteeMentor()

	const deleteTopPerformerHandler = (e) => {
		e.preventDefault()
		mutateAsync(deleteId)
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
					<Modal.Title>Delete Mentor</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row className="my-3">
						<Col sm={12}>
							<p>Are you sure want to delete this Mentor</p>
						</Col>
					</Row>
					<Row className="mt-4 mb-2">
						<Col sm={12}>
							<div className='buttonSection'>
								<Button variant="primary" onClick={(e) => deleteTopPerformerHandler(e)}>
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

export const AddMentorModal = (props) => {
	const { addModalOpen, addModalClose, allMenteeMentorData, updateMenteeId } = props
	const { register, handleSubmit, reset, setValue, formState } = useForm({
		mode: "onTouched"
	});
	const { data: allMember, } = useGetAllMembers();
	const { mutateAsync: addMenteeMutateAsync } = useAddMenteeMentor()
	const { mutateAsync: updateMenteeMutateAsync } = useUpdateMenteeMentor()


	const addUpdateMentorHandler = (data) => {
		if (updateMenteeId) {
			const updateData = {
				...data,
				mentee_id: updateMenteeId
			}
			updateMenteeMutateAsync(updateData)
		}
		else {
			addMenteeMutateAsync(data)
		}
		addModalClose()
	}
	return (
		<>
			<Modal
				className="commonModal addTopPerformer"
				show={addModalOpen}
				onHide={addModalClose}
				centered
			>
				<Modal.Header closeButton >
					<Modal.Title>Add Mentor</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit(addUpdateMentorHandler)}>
						<Row className="my-3">
							<Col sm={12}>
								<label>Select Mentee</label>
								<select
									disabled={updateMenteeId ? true : false}
									defaultValue={updateMenteeId ? updateMenteeId : ""}
									style={{ width: '100%' }}
									placeholder="Select Employee"
									className="form-control"
									name="mentee_id"
									ref={register({})}
								>
									<option value="">Select Employee</option>
									{
										allMenteeMentorData?.map((item, i) => (
											<option key={item.mentee_id} value={item.mentee_id}>{item.full_name}</option>
										))
									}
								</select>
							</Col>
						</Row>
						<Row className="my-3">
							<Col sm={12}>
								<label>Select Mentor</label>
								<select
									style={{ width: '100%' }}
									placeholder="Select Employee"
									className="form-control"
									name="mentor_id"
									ref={register({})}
								>
									<option value="">Select Employee</option>
									{
										allMember?.employees?.map((item, i) => (
											<option key={item.uuid} value={item.uuid}>{item.first_name} {item.last_name}</option>
										))
									}
								</select>
							</Col>
						</Row>
						<Row className="mt-4 mb-2">
							<Col sm={12} className='buttonSection'>
								<Button disabled={!formState.isValid} variant="primary" type='submit'>{updateMenteeId ? "Update" : "Add"}</Button>
								<Button variant="outline-danger" onClick={addModalClose}>Cancel</Button>
							</Col>
						</Row>
					</form>
				</Modal.Body>
			</Modal>
		</>
	)
}




export default Index

