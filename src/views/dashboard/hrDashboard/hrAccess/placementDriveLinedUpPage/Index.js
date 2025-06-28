import React from 'react'
import { Col, Row } from "react-bootstrap"
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../../../../../components/Breadcrumb'
import PlacementDriveLinedUp from '../../../../commonComponent/placementDriveLinedUp/Index'
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
			<Row>
				<Col>
					<PlacementDriveLinedUp isFullPage={true}/>
				</Col>
			</Row>
		</>
	)
}


export default Index
