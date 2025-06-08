import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { FaStar, FaStarHalf } from 'react-icons/fa'
import { useGetRatingOfEmpPeriod } from '../../../query/members/allMembers/allMembersQuery'
import './style.scss'

const Index = ({ ratingModalVisible, setRatingModalVisible, ratedBy , getRating }) => {
	// ratedBy = either 'mentor' or 'pm' 
	const { data: ratingByMentor, isLoading } = useGetRatingOfEmpPeriod(getRating , ratedBy);
	const [rating, setRating] = useState(ratedBy === 'mentor' ? 2.5 : 4.5); //2.5 is mentor rating 3.5 is pm rating mock data
	const [feedback, setFeedback] = useState(ratedBy === 'mentor' ? 'mentor-feedback-string' : 'pm Feedback string');
	const [name, setName] = useState(ratedBy === 'mentor' ? 'Mentor' : 'PM')
	return (
		<Modal
			className="traineeRating"
			show={ratingModalVisible}
			onHide={() => setRatingModalVisible(false)
			}
		>
			<Modal.Header closeButton >
				<Modal.Title>{name}'s Rating for {'Vaishnav'}</Modal.Title>
			</Modal.Header>
			<Modal.Body closeButton>
				<Row>
					<Col sm={12} md={12} lg={12} className='mb-3'>

						<div className='ratingRow'>
							<b>Rating:</b>
							<FaStar className={`star ${rating < 1 ? 'hideme' : ''}`} />
							<FaStar className={`star ${rating < 2 ? 'hideme' : ''}`} />
							<FaStar className={`star ${rating < 3 ? 'hideme' : ''}`} />
							<FaStar className={`star ${rating < 4 ? 'hideme' : ''}`} />
							<FaStar className={`star ${rating < 5 ? 'hideme' : ''}`} />
							<FaStarHalf className={`star ${Math.floor(rating) === rating ? 'hideme' : ''}`} />
						</div>
					</Col>
					<Col sm={12} md={12} lg={12} className='mb-3'>
						<div className='feedbackRow'><b>Feedback:</b> {feedback}</div>
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	)
}

export default Index
