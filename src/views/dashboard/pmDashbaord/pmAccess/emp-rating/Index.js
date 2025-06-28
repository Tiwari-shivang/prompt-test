import { Rate } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { Input } from '../../../../widgets/formComponents/Input';
import { useForm } from 'react-hook-form';
import { FaUserAlt, FaStar } from 'react-icons/fa';
import Breadcrumb from '../../../../../components/Breadcrumb';
import { useGetEmployeeRatingByPm } from '../../../../../query/ratings/getRatings/getRatingsQuery';
import { useUpdateEmpRatingByPm } from '../../../../../query/ratings/updateRatings/updateRatingsQuery';
import './style.scss';
import { useRecoilValue } from 'recoil';
import { authState } from '../../../../../recoil/authRecoil';
const Index = () => {

	const navigate = useNavigate();
	const empDetail = useRecoilValue(authState)
	const [updateRatingModal, setUpdateRatingModal] = useState(false)
	const [ratingData, setRatingData] = useState({})
	const [ratingCriteria, setRatingCriteria] = useState({
		pmId: empDetail?.uuid,
		month: new Date().getMonth(),
		year: new Date().getFullYear(),
	})

	const { data: allEmpRating } = useGetEmployeeRatingByPm(ratingCriteria)


	const empRatingcolumns = [
		{
			dataField: '',
			text: 'Photos',
			formatter: (cellContent, row) => (
				<div className="departmentHead">
					<div className='headPic' onClick={() => navigate(`/members/memberDetail/${row.id}`)}>
						{
							row && row.profile_picture ? <img src={row.profile_picture} alt="" /> : <FaUserAlt className='userIcon' />
						}
					</div>
				</div>
			),
		},
		{
			dataField: 'emp_uuid',
			text: 'Employee Id',
		},
		{
			text: 'Full Name',
			formatter: (cellContent, row) => (
				<div className="fullName">
					<p>{row.emp_first_name} {row.emp_last_name}</p>
				</div>
			),
		},
		{
			dataField: 'department_name',
			text: 'Department',
		},
		{
			dataField: 'rating_date',
			text: 'Rating Date',
		},
		{
			text: 'Rating',
			formatter: (cellContent, row) => (
				<div className="rating">
					<Rate className='stars' allowHalf disabled="false" defaultValue={row && row.rating / 2} />
					<div className='shortStar'>
						{row ? row.rating : 0} <FaStar className='starIcon ms-1 me-1' />
					</div>
				</div>
			),
		},
		{
			dataField: '',
			text: 'Action',
			formatter: (cellContent, row) => (
				<div className="ActionIcon">
					<a className="acceptIcon" onClick={() => handleEditRating(row)}>
						Edit
					</a>
				</div>
			),
		},
	]

	const handleEditRating = (data) => {
		setUpdateRatingModal(true)
		setRatingData(data)
	}

	return (
		<div className='ratingTable'>
			<Row className='mb-3'>
				<Col xs={7}>
					<Breadcrumb />
				</Col>
				<Col xs={5}>
					<div className='btnGroup'>
						<Button variant='primary' onClick={() => navigate('/dashboard/ratingFeedback')}>Rating & Feedback</Button>
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={12} className="mb-4">
					<div className='empRatingCard'>
						<div className='cardCustomTitle'>
							List Of Employee Rating By PM
						</div>
						<div className='empRating'>
							<BootstrapTable
								keyField="id"
								data={allEmpRating ? allEmpRating : []}
								columns={empRatingcolumns}
								condensed
							/>
						</div>
					</div>
					<UpdateRatingModal
						updateModalOpen={updateRatingModal}
						updateModalClose={() => { setUpdateRatingModal(false); setRatingData({}) }}
						updatingValue={ratingData}
					/>
				</Col>
			</Row>
		</div>
	)
}

export const UpdateRatingModal = (props) => {
	const { updateModalOpen, updateModalClose, updatingValue } = props

	const { register, handleSubmit, reset, errors } = useForm({
		mode: "onTouched"
	});
	const empDetail = useRecoilValue(authState)

	const { mutateAsync } = useUpdateEmpRatingByPm()

	const empRatingHandler = (data) => {
		const updateData = {
			...updatingValue,
			...data,
			"emp_id": empDetail?.uuid,
		}
		mutateAsync(updateData)
		updateModalClose()
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
					<Modal.Title>Update Employee Rating</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit(empRatingHandler)}>
						<Row className="my-3">
							<Col sm={12}>
								<label>Rating</label>
								<Input
									type="number"
									min="1"
									max="5"
									step="0.1"
									className="form-control"
									name="rating"
									defaultValue={updatingValue?.rating}
									reference={register()} />
							</Col>
							<Col sm={12}>
								<label>Description</label>
								<Input
									type="text"
									id='text-edit'
									placeholder="Description"
									className="form-control"
									name="description"
									defaultValue={updatingValue?.description}
									reference={register()} />
							</Col>
						</Row>
						<Row className="mt-4 mb-2">
							<Col sm={12} className='buttonSection'>
								<Button variant="primary" type='submit'>Update</Button>
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

