import React from 'react'
import { Button, Card, Col, Row } from "react-bootstrap"
import { FaFileAlt, FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../../../../components/Breadcrumb'
import './style.scss'

const Index = () => {
	const navigate = useNavigate()
	return (
		<>
			<Row className='nav mb-2'>
				<Col xs={6}>
					<Breadcrumb />
				</Col>
				<Col xs={6} className="">
				</Col>
			</Row>
			<Row className='pmRating'>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card'>
						<Card.Title><FaStar className='icon' />Employee Rating</Card.Title>
						<Card.Body>
							<Card.Text>
								Grading employees according to their performance and skillset, under this category.
							</Card.Text>
							<Button variant='primary' onClick={() => navigate('/dashboard/employee-rating')}>Click Here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaStar className='icon' />Skill Rating</Card.Title>
						<Card.Body>
							<Card.Text >
								Ranking the added skills of employee based on their usage and level, under this category.
							</Card.Text>
							<Button variant='primary' onClick={() => navigate('/dashboard/skills-rating')}>Click Here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaFileAlt className='icon' />Leave Applications</Card.Title>
						<Card.Body>
							<Card.Text >
								Managing the leave applications of the team responding to them according to the requirement, under this category.
							</Card.Text>
							<Button variant='primary' onClick={() => navigate('/leaveApprovalList')}>Click Here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaFileAlt className='icon' />Regularisation Requests</Card.Title>
						<Card.Body>
							<Card.Text >
								Check out the regularisation request sent by the team, under this category.
							</Card.Text>
							<Button variant='primary' onClick={() => navigate('/pmAccess/regularisationRequests')}>Click Here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaFileAlt className='icon' />Update Mentor</Card.Title>
						<Card.Body>
							<Card.Text >
								Check out the mentor or change  the Mentee, under this category.
							</Card.Text>
							<Button variant='primary' onClick={() => navigate('/dashboard/mentorList')}>Click Here</Button>
						</Card.Body>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default Index
