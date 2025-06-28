import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Breadcrumb from '../../../../components/Breadcrumb';
import { useCreateShiftTiming, useDeleteShiftTiming, useGetShiftTiming, useUpdateShiftTiming } from '../../../../query/shiftTiming/shiftTimingQuery';
import { authRoleState } from '../../../../recoil/authRecoil';
import { requiredField } from '../../../../utilits/validation';
import { Input } from '../../../widgets/formComponents/Input';
import './style.scss';


const Index = () => {

	const navigate = useNavigate()
	const [deleteModal, setDeleteModal] = useState(false)
	const [addShiftTimingModal, setAddShiftTimingModal] = useState(false)
	const [ids, setIds] = useState("")
	const [rowData, setRowData] = useState("")
	const [popover, setPopover] = useState()
	const getRole = useRecoilValue(authRoleState)
	const authRoles = getRole && getRole?.Roles
	const { register, handleSubmit, errors, reset, setValue } = useForm();

	const { data: shiftTimingList, isLoading: isShiftTimingListLoading } = useGetShiftTiming();

	const handleAddShiftTiming = (row) => {
		if (row) {
			setRowData(row)
			setAddShiftTimingModal(true)
		} else {
			setRowData()
			setAddShiftTimingModal(true)
		}
	}

	const openDeletePopup = (row, e) => {
		setIds(row.id)
		setDeleteModal(true)
	}

	const columns = [

		{
			dataField: 'shift_timing',
			text: 'Shift Timings',
		},
		{
			dataField: '',
			text: 'Action',
			formatter: (cellContent, row) => (
				<div className="ActionIcon">
					<a className="acceptIcon" onClick={(e) => handleAddShiftTiming(row)}>
						Edit
					</a>
					<a className="deleteIcon" onClick={(e) => openDeletePopup(row, e)}>
						Delete
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
					<Button size='sm' variant='primary' onClick={() => handleAddShiftTiming()}>Add Shift Timing</Button>
				</Col>
			</Row>
			<Row>
				<Col xs={12}>
					<Card>
						<div className='card-body'>
							<BootstrapTable
								keyField="id"
								wrapperClasses='customScroll'
								data={shiftTimingList ? shiftTimingList : []}
								columns={columns}
								condensed
							/>
						</div>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<DeleteShiftTimingModal
						deleteModalOpen={deleteModal}
						deleteModalClose={() => setDeleteModal(false)}
						deleteId={ids}
					/>
					<AddShiftTimingModal
						addModalOpen={addShiftTimingModal}
						addModalClose={() => setAddShiftTimingModal(false)}
						rowData={rowData}
					/>
				</Col>
			</Row>

		</div>
	)
}


export const DeleteShiftTimingModal = (props) => {
	const { deleteModalOpen, deleteModalClose, deleteId } = props
	const { mutateAsync } = useDeleteShiftTiming()

	const deleteShiftTimingHandler = (e) => {
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
					<Modal.Title>Delete Shift Timing</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row className="my-3">
						<Col sm={12}>
							<p>Are you sure want to delete this Shift Timing</p>
						</Col>
					</Row>
					<Row className="mt-4 mb-2">
						<Col sm={12}>
							<div className='buttonSection'>
								<Button variant="primary" onClick={(e) => deleteShiftTimingHandler(e)}>
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

export const AddShiftTimingModal = (props) => {
	const { addModalOpen, addModalClose, rowData } = props
	const { register, handleSubmit, errors, reset } = useForm({
		mode: "onChange",
	});
	const { isLoading: createLoading, mutateAsync: createShiftTiming } = useCreateShiftTiming()
	const { isLoading: updateLoading, mutateAsync: updateShiftTiming } = useUpdateShiftTiming()
	useEffect(() => {
		reset({
			start_time: rowData?.shift_timing?.substring(0, 5),
			end_time: rowData?.shift_timing?.substring(8),
		});
	}, [rowData])

	const handleOnSubmit = (data) => {
		if (rowData) {
			updateShiftTiming({ ...data, id: rowData.id })
			addModalClose()
		} else {
			createShiftTiming(data)
			addModalClose()
		}
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
					<Modal.Title>Add Shift Timing</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit(handleOnSubmit)}>
						<Row className="my-3">
							<Col sm={12}>
								<label className={`${errors.start_time ? "text-danger" : ""}`}>Start Time*</label>
								<Input
									type="time"
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
									//defaultValue={rowData.end_time}
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
								<Button variant="primary" type="submit">
									Add
								</Button>
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




export default Index

