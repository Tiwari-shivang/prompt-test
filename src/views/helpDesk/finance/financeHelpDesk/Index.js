import React, { useState } from 'react'
import { Card, Col, Row } from "react-bootstrap"
import { GrDocumentText } from 'react-icons/gr'
import { RiQuestionnaireLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../../../../components/Breadcrumb'
import BugModal from '../../../modals/reportABug/Index'
import './style.scss'

const Index = () => {
	const navigate = useNavigate()
	const [bugModalVisible, setBugModalVisible] = useState(false)

	return (
		<>
			<Row className='nav mb-2'>
				<Col xs={6}>
					<Breadcrumb />
				</Col>
				<Col xs={6} className="">
				</Col>
			</Row>
			<Row className='itHelpDesk'>
				<Col xs={12} md={6} lg={4} className="mb-3" >
					<div className='card' onClick={() => setBugModalVisible(true)}>
						<Card.Title><GrDocumentText className='icon' />Report a bug</Card.Title>
						<Card.Body>
							<Card.Text>
								Some quick example text to build on the card title and make up the
								bulk of the card's content.
							</Card.Text>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} lg={4} className="mb-3">
					<div className='card' onClick={() => navigate('/helpDesk/finance/raiseIssue')}>
						<Card.Title className='query'><GrDocumentText className='icon query' />RAISE A QUERY</Card.Title>
						<Card.Body>
							<Card.Text className='query'>
								Get Finance related support under this category.
							</Card.Text>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} lg={4} className="mb-3">
					<div className='card' onClick={() => navigate('/helpDesk/hr/faqs')}>
						<Card.Title><RiQuestionnaireLine className='icon' />FREQUENTLY ASKED QUESTIONS</Card.Title>
						<Card.Body>
							<Card.Text >
								Some quick example text to build on the card title and make up the
								bulk of the card's content.
							</Card.Text>
						</Card.Body>
					</div>
				</Col>
			</Row>
			<BugModal bugModalVisible={bugModalVisible} setBugModalVisible={setBugModalVisible} />
			
		</>
	)
}
export default Index
