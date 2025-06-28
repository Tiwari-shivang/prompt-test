import React, { useState } from 'react'
import { Col, Row } from "react-bootstrap"
import BootstrapTable from 'react-bootstrap-table-next'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import Breadcrumb from '../../../../components/Breadcrumb'
import { useGetTraineeRatingByEmpId } from '../../../../query/members/allMembers/allMembersQuery'
import { authState } from '../../../../recoil/authRecoil'
import RatingModal from '../../../modals/traineeRating/Index'
import './style.scss'

const Index = () => {
	const params = useParams();
	const { data: TraineeDetails, isLoading } = useGetTraineeRatingByEmpId(params.id);
	const empDetail = useRecoilValue(authState)
	const [ratingModelVisible, setRatingModelVisible] = useState(false)
	const [isMentee, setIsMentee] = useState()
	const [mentorRatingModalVisible, setMentorRatingModalVisible] = useState(false)
	const [dataToSendToGetRating, setDataToSendToGetRating] = useState()
	const [pmRatingModalVisible, setPmRatingModalVisible] = useState(false)
	const [ratedBy, setRatedBy] = useState('mentor')


	// const handelGetMentorRating = (row) => {
	// 	setDataToSendToGetRating(row)
	// 	setMentorRatingModalVisible(true)
	// }

	// const handelGetPMRating = (row) => {
	// 	setDataToSendToGetRating(row)
	// 	setPmRatingModalVisible(true)
	// }

	const handelGetRating=(row , callType)=>{
        setDataToSendToGetRating(row)
		setIsMentee(callType)
		setRatingModelVisible(true)
	}



	const columns = [
		{
			dataField: 'trainee_id',
			text: 'Trainee Name',
			formatter: (cellContent, row) => (
				<div className="trainee_nameCol">
					{cellContent}
				</div>
			),
		},
		{
			dataField: 'mentor_rating',
			text: 'Mentor rating',
			formatter: (cellContent, row) => (
				<div className="mentor_ratingCol">
					<button className='btn btn-outline-primary btn-sm' onClick={() => handelGetRating(row , "mentorCall")}>view rating</button>
				</div >
			),
		},
		{
			dataField: 'pm_rating',
			text: 'PM rating',
			formatter: (cellContent, row) => (
				<div className="pm_ratingCol">
					<button className='btn btn-outline-primary btn-sm' onClick={() => handelGetRating(row , "pmCall")}>view rating</button>
				</div>
			),
		},
		{
			dataField: 'quarter',
			text: 'Period',
			formatter: (cellContent, row) => (
				<div className="quaterCol">
					{row.start_date} - {row.end_date}
				</div>
			),
		},
	]

	return (
		<>
			<Row className='nav mb-2'>
				<Col xs={4}>
					<Breadcrumb />
				</Col>
			</Row>
			<div className='traineeFeedback'>
				<BootstrapTable
					keyField="id"
					data={TraineeDetails ? TraineeDetails : []}
					columns={columns}
					condensed
				/>
			</div>
			{/* mentor rating */}
			{/* <RatingModal ratingModalVisible={mentorRatingModalVisible} setRatingModalVisible={setMentorRatingModalVisible} getRating={dataToSendToGetRating} ratedBy='mentor' /> */}
			{/* pm rating */}
			{/* <RatingModal ratingModalVisible={pmRatingModalVisible} setRatingModalVisible={setPmRatingModalVisible} getRating={dataToSendToGetRating} ratedBy='pm' /> */}

			<RatingModal ratingModalVisible={ratingModelVisible} setRatingModalVisible={setRatingModelVisible} getRating={dataToSendToGetRating} ratedBy={isMentee} />
		</>
	)
}

export default Index