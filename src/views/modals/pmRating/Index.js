import React from 'react'
import { Modal, Row } from 'react-bootstrap'
import { FaStar, FaStarHalf } from 'react-icons/fa'
import './style.scss'

const Index = ({ pmRatingModalVisible, setPmRatingModalVisible }) => {
	return (
		<Modal
			className="pmRating"
			show={pmRatingModalVisible}
			onHide={() => setPmRatingModalVisible(false)
			}
		>
			<Modal.Header closeButton >
				<Modal.Title>PM Rating for {'Vaishnav'}</Modal.Title>
			</Modal.Header>
			<Modal.Body closeButton>
				<Row>
					<div className='ratingRow'><b>Rating:</b> <FaStar className='star' /><FaStar className='star' /><FaStar className='star' /><FaStarHalf className='star' /></div>
				</Row>
				<Row>
					<div className='feedbackRow'><b>Feedback:</b> {"good job"}</div>
				</Row>
			</Modal.Body>
		</Modal>
	)
}
export default Index
