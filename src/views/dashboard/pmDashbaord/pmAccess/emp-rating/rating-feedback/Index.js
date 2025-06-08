import React, { useEffect, useState } from 'react'
import { Input } from '../../../../../widgets/formComponents/Input'
//import Paginations from '../../../../components/Paginations'
import { Button, Col, Row } from 'react-bootstrap'
import { useFieldArray, useForm } from 'react-hook-form'
import { useRecoilValue } from "recoil"
import Breadcrumb from '../../../../../../components/Breadcrumb'
import { useGetAllMembers } from '../../../../../../query/members/allMembers/allMembersQuery'
import { useAddEmployeeRating } from '../../../../../../query/ratings/addRatings/addRatingsQuery'
import { authState } from "../../../../../../recoil/authRecoil"

import './style.scss'

const Index = () => {
	const ratingList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	const [selectedId, setSelectedId] = useState(0)
	const empDetail = useRecoilValue(authState)

	const { register, handleSubmit, control, errors, reset, setValue, getValues } = useForm({
		mode: "onTouched"
	});

	const { append, fields, remove } = useFieldArray({
		control,
		name: "ratings",
	})

	const { data: allMember, isLoading: allMemberLoading } = useGetAllMembers();
	const { mutateAsync: addEmpRatingMutateAsync } = useAddEmployeeRating()

	useEffect(() => {
		if (allMember && allMember.employees.length > 0) {
			remove([...allMember?.employees?.map((item, index) => (
				index
			))])
		}
	}, [])

	useEffect(() => {
		if (allMember && allMember.employees.length > 0) {
			remove([...allMember?.employees?.map((item, index) => (
				index
			))])
			append([...allMember?.employees?.map((item, index) => (
				{
					"emp_uuid": item.uuid,
					"empName": `${item.first_name} ${item.last_name}`,
					"rating": "",
					"description": ""
				}
			))
			])
		}
	}, [allMember])


	const handleOnSubmitEmpRating = (data) => {
		const newData = data?.ratings?.map((item, i) => (
			{
				...item,
				"pm_uuid": empDetail && empDetail?.uuid,
				"rating_date": "2022-11-28"
			}
		))
		addEmpRatingMutateAsync(newData)
	}

	return (
		<div className='rating-feedback'>
			<Row className='mb-2'>
				<Col xs={7}>
					<Breadcrumb />
				</Col>
				<Col xs={5}>
				</Col>
			</Row>
			<form onSubmit={handleSubmit(handleOnSubmitEmpRating)}>
				{/* <div className='ratingForm'> */}
				<Row className='mb-4 heading'>
					<Col xs={12} lg={3} className="px-2">
						<h6>Employee Name</h6>
					</Col>
					<Col xs={12} lg={2} className="px-2">
						<h6>Rating</h6>
					</Col>
					<Col xs={12} lg={7} className="px-2">
						<h6>Description</h6>
					</Col>
				</Row>
				{
					fields && fields.map((item, index) => (
						<Row className='mb-2'>
							<Col xs={12} lg={3} className="px-2">
								<div className='employee-name'>
									<Input
										type="number"
										value={item?.emp?.uuid}
										name={`ratings[${index}].emp.uuid`}
										reference={register()} />
									<h6>{item?.empName}</h6>
								</div>
							</Col>
							<Col xs={12} lg={2} className="px-2">
								<div className='employee-column'>
									<Input
										type="number"
										min="1"
										max="5"
										className="form-control"
										name={`ratings[${index}].rating`}
										reference={register()} />
								</div>

								{/* <div className='employee-column empColRating'>
                  {
                    ratingList && ratingList.map(item => (
                      <>
                     
                      <Input
                      type="radio"
                      name={`ratings[${index}].rating`}
                      defaultValue={item}
                      reference={register()}
                      />
                        </>
                    ))
                  }

                    </div> */}

							</Col>
							<Col xs={12} lg={7} className="px-2">
								<div className='employee-column'>
									<Input
										type="text"
										id='text-edit'
										placeholder="Description"
										className="form-control"
										name={`ratings[${index}].description`}
										reference={register()} />
								</div>
							</Col>
						</Row>
					))
				}
				<Row>
					<Col className='buttonSection'>
						<Button variant="primary" type='submit' >Save</Button>
						<Button variant="outline-danger">
							Cancel
						</Button>
					</Col>
				</Row>
				{/* </div> */}
			</form>
		</div>
	)
}




export default Index

