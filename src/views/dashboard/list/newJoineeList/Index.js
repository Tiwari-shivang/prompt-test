import React, { useState } from 'react'
import { Button, Card, Col, Modal, Row } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import { useForm } from 'react-hook-form'
import { AiOutlineSearch } from 'react-icons/ai'
import { BiFilterAlt } from "react-icons/bi"
import { FaUserAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../../../../components/Breadcrumb'
import { useGetAllDepartments } from '../../../../query/department/allDepartments/allDepartmentsQuery'
import { useGetAllDesignation } from '../../../../query/designation/allDesignation/allDesignationQuery'
import { useGetAllLocations } from '../../../../query/location/allLocation/allLocationQuery'
import { useGetNewJoinee } from '../../../../query/members/allMembers/allMembersQuery'
import Paginations from '../../../commonComponent/pagination/Index'
import './style.scss'

const Index = () => {

	const navigate = useNavigate()
	const [filters, setFilters] = useState(false)
	const [popover, setPopover] = useState()
	const { register, handleSubmit, errors, reset, setValue } = useForm();
	const [searchCriteria, setSearchCriteria] = useState({
		itemsPerPage: 20,
		newCurrentPage: 1,
		searchValue: "",
		departmentName: "",
		designationName: "",
		locationName: ""
	})

	const { data: allMember, isNewJoineeLoading } = useGetNewJoinee(searchCriteria);
	const allItemsCount = allMember?.total_employee ? allMember.total_employee : null;

	const handleOnSearch = (data) => {
		setSearchCriteria({ ...searchCriteria, searchValue: data.search, locationName: "", designationName: "", departmentName: "", newCurrentPage: 1 })
	}

	const handelFilter = (e) => {
		setFilters(true)
	}



	const columns = [
		{
			dataField: '',
			text: 'Photos',
			formatter: (cellContent, row) => (
				<div className="imgHead">
					<div className='headPic' onClick={() => navigate(`/members/memberDetail/${row.uuid}`)}>
						{
							row && row.profile_picture ? <img src={row.profile_picture} alt="" /> : <FaUserAlt className='userIcon' />
						}
					</div>
				</div>
			),
		},
		{
			dataField: 'office_id',
			text: 'Employee Id',
		},
		{
			text: 'Full Name',
			formatter: (cellContent, row) => (
				<div className="fullName">
					{row.first_name} {row.last_name}
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
			dataField: 'employee_status',
			text: 'Employee Status',
		},
		{
			dataField: 'date_of_joining',
			text: 'Date Of Joining',
		},
	]



	return (
		<div className="list">
			<Row className='mb-2'>
				<Col xs={7}>
					<Breadcrumb />
				</Col>
				<Col xs={5}>
					<div className='filterSection'>
						<div className='searchSection'>
							<form className="d-flex" onSubmit={handleSubmit(handleOnSearch)}>
								<input className="form-control form-control-sm me-sm-2" placeholder="Search" name="search" ref={register({})} />
								<button color="light" className="btn" type="submit">
									<AiOutlineSearch />
								</button>
							</form>
						</div>
						<button className='filter' onClick={(e) => handelFilter(e)}><BiFilterAlt className='icon' /> Filter</button>
					</div>
				</Col>
			</Row>


			<Row>
				<Col xs={12}>
					<Card>
						<div className='card-body'>
							<BootstrapTable
								keyField="id"
								wrapperClasses='customScroll'
								data={allMember ? allMember : []}
								columns={columns}
								condensed
							/>
						</div>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<div className='pagination'>
						<Paginations
							itemsCount={allItemsCount}
							itemsPerPage={searchCriteria.itemsPerPage}
							currentPage={searchCriteria.newCurrentPage}
							setCurrentPage={(e) => setSearchCriteria({ ...searchCriteria, newCurrentPage: e })}
						/>
					</div>
					<FilterModal
						filterModalOpen={filters}
						filterModalClose={() => setFilters(false)}
						setFilterValue={(data) => setSearchCriteria({ ...searchCriteria, newCurrentPage: 1, locationName: data.locationName, designationName: data.designationName, departmentName: data.departmentName, searchValue: "" })}
					/>
				</Col>
			</Row>

		</div>
	)
}


export const FilterModal = (props) => {
	const { filterModalOpen, filterModalClose, setFilterValue } = props

	const { data: allDepartment } = useGetAllDepartments()
	const { data: allDesignation } = useGetAllDesignation()
	const { data: allLocation } = useGetAllLocations()
	const { register, handleSubmit, errors,formState } = useForm({
		mode: "onTouched"
	});

	const filtertHandler = (data) => {
		setFilterValue(data)
		filterModalClose()
	}
	return (
		<>
			<Modal
				className="commonModal"
				show={filterModalOpen}
				onHide={filterModalClose}
				centered
			>
				<Modal.Header closeButton >
					<Modal.Title>Filter</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit(filtertHandler)}>
						<Row>
							<Col sm={12}>
								<label>Location</label>
								<select
									className="form-control"
									name="locationName"
									ref={register({})}
								>
									<option value="">Select Location</option>
									{allLocation &&
										allLocation.map((option) => (
											<option key={option.id} value={option.id}>
												{option.location_name}
											</option>
										))}
								</select>
							</Col>
							<Col sm={12}>
								<label>Designation</label>
								<select
									className="form-control"
									name="designationName"
									ref={register({})}
								>
									<option value="">Select Designation</option>
									{allDesignation &&
										allDesignation.map((option) => (
											<option key={option.id} value={option.id}>
												{option.designation_name}
											</option>
										))}
								</select>
							</Col>
							<Col sm={12}>
								<label>Department</label>
								<select
									className="form-control"
									name="departmentName"
									ref={register({})}
								>
									<option value="">Select Department</option>
									{allDepartment &&
										allDepartment.map((option) => (
											<option key={option.id} value={option.id}>
												{option.department_name}
											</option>
										))}
								</select>
							</Col>
							<Col sm={12} className='buttonSection'>
								<Button  disabled={!formState.isValid} variant="primary" type='submit'>Apply</Button>
								<Button variant="outline-danger" onClick={filterModalClose}>Cancel</Button>
							</Col>
						</Row>
					</form>
				</Modal.Body>
			</Modal>
		</>
	)
}


export default Index

