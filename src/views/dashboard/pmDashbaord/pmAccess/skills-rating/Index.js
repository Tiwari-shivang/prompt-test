import { Rate } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { useForm } from 'react-hook-form';
import { FaStar, FaUserAlt } from 'react-icons/fa';
import { useRecoilValue } from "recoil";
import Breadcrumb from '../../../../../components/Breadcrumb';
import { authState } from "../../../../../recoil/authRecoil";
import { Input } from '../../../../widgets/formComponents/Input';
import { useCreateSkillsRatingByPm } from '../../../../../query/ratings/addRatings/addRatingsQuery';
import { useGetEmployeeWithSkillRatingByRmId } from '../../../../../query/ratings/getRatings/getRatingsQuery';
import { useUpdateEmpRatingByPm } from '../../../../../query/ratings/updateRatings/updateRatingsQuery';
import './style.scss';

const Index = () => {

	const navigate = useNavigate();
	const empDetail = useRecoilValue(authState)
	const [updateRatingModal, setUpdateRatingModal] = useState(false)
	const [ratingData, setRatingData] = useState({})
	const [ratingCriteria, setRatingCriteria] = useState({
		pmId: 3,
		month: 11,
		year: 2022,
	})


	const { data: allSlillsRating } = useGetEmployeeWithSkillRatingByRmId(empDetail.uuid)

	const skillsRatingcolumns = [
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
					<p>{row.full_name}</p>
				</div>
			),
		},
		{
			dataField: 'email',
			text: 'Email Address',
		},
		{
			dataField: 'department_name',
			text: 'Department',
		},
		{
			dataField: 'remark_date',
			text: 'Rating Date',
		},
		{
			text: 'Rating',
			formatter: (cellContent, row) => (
				<div className="rating">
					<Rate className='stars' allowHalf disabled="false" defaultValue={row && row.rating/2} />
					<div className='shortStar'>
						{row ? row?.skill_rating : 0} <FaStar className='starIcon ms-1 me-1' />
					</div>
				</div>
			),
		},
		{
			dataField: '',
			text: 'Action',
			formatter: (cellContent, row) => (
				<div className="ActionIcon">
					{

						row && row.skill_rating === null ?
							<a className="acceptIcon" onClick={() => handleRatingPopup(row)}>
								Add
							</a>
							:
							<a className="acceptIcon" onClick={() => handleRatingPopup(row)}>
								Edit
							</a>
					}
				</div>
			),
		},
	]

	const handleRatingPopup = (data) => {
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
						<Button variant='primary' onClick={() => navigate('/dashboard/skillsRatingFeedback')}>Rating & Feedback</Button>
					</div>
				</Col>
			</Row>
			<Row>
				<Col xs={12} className="mb-4">
					<div className='empRatingCard'>
						<div className='cardCustomTitle'>
							List of skills rating by PM
						</div>
						<div className='empRating'>
							<BootstrapTable
								keyField="id"
								data={allSlillsRating ? allSlillsRating : []}
								columns={skillsRatingcolumns}
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

	const { mutateAsync: mutateAsyncUpdateEmpRatingByPm } = useUpdateEmpRatingByPm()
	const { mutateAsync: mutateAsyncCreateSkillsRatingByPm } = useCreateSkillsRatingByPm()

	const empRatingHandler = (data) => {
		const newData = {
			...data,
			"skill_id": updatingValue && updatingValue.skill_id,
			"emp_id": updatingValue && updatingValue.emp?.uuid,
			"remark_date": "2022-12-12"
		}
		mutateAsyncCreateSkillsRatingByPm(newData)
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
									name="skill_rating"
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
									name="skill_remark"
									defaultValue={updatingValue?.description}
									reference={register()} />
							</Col>
							<Col sm={12} className='buttonSection mt-4'>
								<Button variant="primary" type='submit'>{updatingValue && updatingValue.skill_rating === null ? "Add" : "Update"}</Button>
								<Button variant="outline-danger" onClick={updateModalClose}>
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

