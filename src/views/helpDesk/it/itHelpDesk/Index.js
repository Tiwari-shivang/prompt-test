import React, { useState } from 'react'
import { Row, Col, Button, Card, Modal } from "react-bootstrap"
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from "recoil"
import { authState } from "../../../../recoil/authRecoil"
import Breadcrumb from '../../../../components/Breadcrumb'
import './style.scss'
import avatar1 from '../../../../assets/images/avatars/1.jpg'
import { GrDocumentText, GrHelpOption, GrMenu } from 'react-icons/gr'
import { RiQuestionnaireLine } from 'react-icons/ri'

import { Form } from "react-bootstrap"
import { Input } from '../../../widgets/formComponents/Input'
import { requiredField } from '../../../../utilits/validation'
import { useForm } from 'react-hook-form'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import Avatar from 'antd/lib/avatar/avatar'
import { useReportBug } from '../../../../query/helpdesk/addHelpdesk/addHelpdeskQuery'
import BugReportModal from '../../../modals/reportABug/Index'

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
					<div className='card' onClick={() => navigate('/helpDesk/it/raiseIssue')}>
						<Card.Title className='query'><GrDocumentText className='icon query' />RAISE A QUERY</Card.Title>
						<Card.Body>
							<Card.Text className='query'>
								Get IT related support under this category.
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
			<BugReportModal bugModalVisible={bugModalVisible} setBugModalVisible={() => setBugModalVisible(false)} />
		</>
	)
}

export default Index
