import React, { useEffect, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Card, Button, Modal } from 'react-bootstrap'
import { authState } from "../../../recoil/authRecoil"
// import { useRecoilValue } from "recoil"
import { FaUserAlt } from 'react-icons/fa'
import { useForm } from 'react-hook-form';
import Loader from "../../widgets/loader/Loader"
import { AiOutlineMenu, AiOutlineSearch, AiOutlineMore, AiOutlineMail, AiOutlineUser, AiOutlineCloseCircle } from 'react-icons/ai'
import { BsGrid } from "react-icons/bs"
import { FaUsers } from "react-icons/fa"
import { BiPhone } from "react-icons/bi"
import Paginations from "../../commonComponent/pagination/Index"
import { BiEdit, BiFilterAlt } from "react-icons/bi"
import Breadcrumb from '../../../components/Breadcrumb'
import { useGetAllByEmployeeDepartmentId } from "../../../query/department/directory/query"
import { useGetAllDepartments } from '../../../query/department/allDepartments/allDepartmentsQuery'
import { useGetAllDesignation } from '../../../query/designation/allDesignation/allDesignationQuery'
import { useGetAllLocations } from '../../../query/location/allLocation/allLocationQuery'
import './style.scss'
import { gridViewDirectoryState } from '../../../recoil/gridViewCheck'
import { useRecoilValue, useSetRecoilState } from "recoil"

const Directory = () => {

	const navigate = useNavigate()
	const empDetail = useRecoilValue(authState)
	const setViewCheckValue = useSetRecoilState(gridViewDirectoryState)
	const viewCheckValue = useRecoilValue(gridViewDirectoryState)
	const [filters, setFilters] = useState(false)
	// const [gridView, setGridView] = useState(true)
	const [searchCriteria, setSearchCriteria] = useState({
		itemsPerPage: 10,
		newCurrentPage: 1,
		searchValue: "",
		departmentName: "",
		designationName: "",
		locationName: "",
		departmentUuid: null
	})
	const { register, handleSubmit, errors, reset, setValue } = useForm();
	const { data, isLoading } = useGetAllByEmployeeDepartmentId(searchCriteria)

	const allItemsCount = data && data.total_employee ? data.total_employee : null;

	useEffect(() => {
		setSearchCriteria({ ...searchCriteria, id: empDetail?.department_uuid })
	}, [])
	const columns = [
		{
			dataField: '',
			text: 'Photos',
			formatter: (cellContent, row) => (
				<div className="departmentHead">
					<div className='headPic' onClick={() => goToMemberDetail(row.id)}>
						{
							row && row.profile_picture ? <img src={row.profile_picture} alt="" /> : <FaUserAlt className='userIcon' />
						}
					</div>
					{cellContent}
				</div>
			),
		},
		{
			dataField: 'office_id',
			text: 'Employee Id',
		},
		{
			dataField: 'first_name',
			text: 'Full Name',
			formatter: (cellContent, row) => (
				<div className='ProjectName' onClick={() => goToMemberDetail(row.id)}>
					<p>{row.first_name} {row.last_name}</p>
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
			dataField: 'designation_name',
			text: 'Designation',
		},
		{
			dataField: 'employee_status',
			text: 'Employee Status',
		},
		{
			dataField: 'date_of_joining',
			text: 'Date Of Joining',
		}
	]


	// if (isLoading) {
	//   return <Loader></Loader>
	// }
	const handelFilter = (e) => {
		setFilters(true)
	}

	const goToMemberDetail = (id) => {
		navigate(`/members/memberDetail/${id}`)
	}

	const handleOnSearch = (data) => {
		setSearchCriteria({ ...searchCriteria, searchValue: data.search, locationName: "", designationName: "", departmentName: "", newCurrentPage: 1 })
	}

	return (
		<div className="directory">
			<Row className='mb-2'>
				<Col xs={5}>
					<Breadcrumb />
				</Col>
				<Col xs={7} className="buttonGroup">
					{
						viewCheckValue ? <Button variant="light" onClick={() => setViewCheckValue(false)}><AiOutlineMenu /></Button>
							: <Button variant="light" onClick={() => setViewCheckValue(true)}><BsGrid /></Button>
					}
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
			<div className='minHeightForPagination'>
				{isLoading ? <Loader /> :
					(viewCheckValue ?
						<Row className='p-2'>
							{
								data && data.employees && data.employees.length > 0 ? data.employees.map((item, i) => (
									<Col className="Col p-2" key={i}>
										<div className="directoryDiv" onClick={() => goToMemberDetail(item?.uuid)}>
											{/* <div className='more'>
                          <AiOutlineMore className='icon'/>     
                      </div> */}
											<div className="directoryInfo">
												<div className="pic">
													{
														item && item.profile_picture ? <img src={item.profile_picture} alt="" /> : <FaUserAlt className='userIcon' />
													}
												</div>
												<div>
													<h6>{item.first_name} {item.last_name} <span>{`(${item.office_id})`}</span></h6>
													<p className="designation">{item.designation_name}</p>
												</div>
												<div className='moreDetail'>
													<p><FaUsers className='icon' />{item.department_name}</p>
													<p><AiOutlineMail className='icon' />{item.email}</p>
													<p><BiPhone className='icon' />{item.phone_number}</p>
												</div>
											</div>
										</div>
									</Col>
								))
									:
									<div className='dataNotFound'>
										<p>Data not found</p>
									</div>
							}

						</Row>
						:
						<Row>
							<Col xs={12}>
								<Card>
									<div className='card-body'>
										<BootstrapTable
											keyField="id"
											wrapperClasses='customScroll'
											data={data && data.employees ? data.employees : []}
											columns={columns}
											condensed
										/>
									</div>
								</Card>
							</Col>
						</Row>
					)}
				<div className='pagination'>
					<Paginations
						itemsCount={allItemsCount}
						itemsPerPage={searchCriteria.itemsPerPage}
						currentPage={searchCriteria.newCurrentPage}
						setCurrentPage={(e) => setSearchCriteria({ ...searchCriteria, newCurrentPage: e })}
					/>
				</div>
			</div>


			<FilterModal
				filterModalOpen={filters}
				filterModalClose={() => setFilters(false)}
				setFilterValue={(data) => setSearchCriteria({ ...searchCriteria, newCurrentPage: 1, locationName: data.locationName, designationName: data.designationName, id: data.departmentName ? data.departmentName : searchCriteria.id, searchValue: "" })}
			/>

		</div>
	)
}

export const FilterModal = (props) => {
	const { filterModalOpen, filterModalClose, setFilterValue } = props
	const { data: allDepartment } = useGetAllDepartments()
	const { data: allDesignation } = useGetAllDesignation()
	const { data: allLocation } = useGetAllLocations()
	const { register, handleSubmit, errors, reset, setValue } = useForm({
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
						<Row className="my-3">
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
								<Button variant="primary" type='submit'>Apply</Button>
								<Button variant="outline-danger" onClick={filterModalClose}>
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

export default Directory