import React from 'react'
import { useNavigate } from 'react-router-dom'
import './style.scss'
import { Col, Row } from 'react-bootstrap'
import ITDeclaration from '../../../../../assets/images/emp/IT-Declaration.svg'

const Index = ({ user_name, where_bug, description, screenshot }) => {
	const navigate = useNavigate()

	return (
		<>
			<Row className='card'>
				<Col sm={3} className="cols bugNoCol">
					{user_name}
				</Col>
				<Col sm={3} className='cols subjectCol'>
					{where_bug}
				</Col>
				{/* <Col sm={3} className='cols statusCol' onClick={() => {}}>
					 <p className={ == 'Open' ? 'badge openBadgeStyle' : status == 'Closed' ? 'badge closedBadgeStyle' : 'badge inProgressBadgeStyle'}>{'Open'}</p> 
				</Col> */}
				<Col sm={3} className='cols reportedByCol'>
					{description}
				</Col>
				<Col sm={3} className='cols dateCol'>
				<a  download={screenshot} href={screenshot} >
						<div className='pic pink'>
						{screenshot?
							<img src={ITDeclaration} alt="" />:
							<div></div>
						}
						</div>
					</a>
					{/* <img src={screenshot}/> */}
				</Col>
			</Row>
		</>
	)
}

export default Index
