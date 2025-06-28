import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { FaStar, FaStarHalf } from 'react-icons/fa'
import './style.scss'

const Index = ({ mentorRatingModalVisible, setMentorRatingModalVisible }) => {
	return (
		<Modal
			className="mentorRating"
			show={mentorRatingModalVisible}
			onHide={() => setMentorRatingModalVisible(false)
			}
		>
			<Modal.Header closeButton >
				<Modal.Title>Mentor Rating for {'Vaishnav'}</Modal.Title>
			</Modal.Header>
			<Modal.Body closeButton>
				<Row>
					<Col sm={12} md={12} lg={12}>
						<div className='ratingRow'><b>Rating:</b> <FaStar className='star' /><FaStar className='star' /><FaStar className='star' /><FaStarHalf className='star' /></div>
					</Col>
					<Col sm={12} md={12} lg={12}>
						<div className='feedbackRow'><b>Feedback:</b> {"good job"}</div>
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	)
}
export default Index
