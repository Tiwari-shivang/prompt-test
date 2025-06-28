import React, { useEffect, useState } from 'react'
import { Input } from '../../../../../widgets/formComponents/Input'
import { Button, Col, Row } from 'react-bootstrap'
import { useFieldArray, useForm } from 'react-hook-form'
import { useRecoilValue } from "recoil"
import Breadcrumb from '../../../../../../components/Breadcrumb'
import { useCreateskillratinglistbypm } from '../../../../../../query/ratings/addRatings/addRatingsQuery'
import { authState } from "../../../../../../recoil/authRecoil"

import { useGetEmployeeWithSkillRatingByRmId } from '../../../../../../query/ratings/getRatings/getRatingsQuery'
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

	const { data: allEmpWithSkillList, isLoading: allMemberLoading } = useGetEmployeeWithSkillRatingByRmId(empDetail.uuid);
	const { mutateAsync: addSkillRatingListMutateAsync } = useCreateskillratinglistbypm()

	useEffect(() => {
		if (allEmpWithSkillList && allEmpWithSkillList.length > 0) {
			remove([...allEmpWithSkillList?.map((item, index) => (
				index
			))])
		}
	}, [])

	useEffect(() => {
		if (allEmpWithSkillList && allEmpWithSkillList.length > 0) {
			remove([...allEmpWithSkillList?.map((item, index) => (
				index
			))])
			append([...allEmpWithSkillList?.map((item, index) => (
				{
					"emp_uuid": item?.emp?.uuid,
					"empName": `${item?.full_name}`,
					"skill_id": item?.skill_id,
					"skill_rating": "",
					"skill_remarks": ""
				}
			))
			])
		}
	}, [allEmpWithSkillList])


	const handleOnSubmitEmpRating = (data) => {
		const newData = data?.ratings.map((item, i) => (
			{
				...item,
				"remark_date": "2022-11-28"
			}
		))
		addSkillRatingListMutateAsync(newData)
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
			<form onSubmit={handleSubmit(handleOnSubmitEmpRating)} className='ratingForm'>

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
							<Col xs={12} lg={3} className="px-2 ">
								<div className='employee-name'>
									<Input
										type="number"
										value={item?.emp?.uuid}
										name={`ratings[${index}].emp.uuid`}
										reference={register()} />
									<Input
										type="number"
										value={item?.skill_id}
										name={`ratings[${index}].skill_id`}
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
										name={`ratings[${index}].skill_rating`}
										reference={register()} />
								</div>
							</Col>
							<Col xs={12} lg={7} className="px-2">
								<div className='employee-column'>
									<Input
										type="text"
										id='text-edit'
										placeholder="Description"
										className="form-control"
										name={`ratings[${index}].skill_remarks`}
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

			</form>
		</div>
	)
}




export default Index

