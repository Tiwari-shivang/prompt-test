import React, { useState } from 'react'
import { Button, Card, Col, Row } from "react-bootstrap"
import { FaBuilding, FaChartLine, FaClock, FaFingerprint, FaSitemap, FaStar, FaUserEdit, FaUserMinus, FaUserAlt } from 'react-icons/fa'
import { GrDocumentText } from 'react-icons/gr'
import { useNavigate } from 'react-router-dom'
import Breadcrumb from '../../../../components/Breadcrumb'
import ShiftTiming from '../../../modals/shiftTimingModal/Index'
import UpdateHolidays from '../../../modals/updateHolidays/Index'
import './style.scss'

const Index = () => {
	const navigate = useNavigate()
	const [shiftTimingModal, setShiftTimingModal] = useState(false)
	const [updateHolidayModal, setUpdateHolidayModal] = useState(false)

	const handleShiftTiming = () => {
		setShiftTimingModal(true)
	}
	const handleUpdateHolidays = () => {
		setUpdateHolidayModal(true)
	}

	return (
		<>
			<Row className='nav mb-2'>
				<Col xs={6}>
					<Breadcrumb />
				</Col>
				<Col xs={6} className="">
				</Col>
			</Row>
			<Row className='hrAccess'>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card'>
						<Card.Title><GrDocumentText className='icon' />Hexaview Buzz</Card.Title>
						<Card.Body>
							<Card.Text>
								Acheivements unlocked by us as the part of this organisation working towards a greater goal.
							</Card.Text>
							<Button variant='primary' onClick={() => navigate('/dashboard/manageHexaviewBuzz')}>Click here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaStar className='icon' />Top performers</Card.Title>
						<Card.Body>
							<Card.Text >
								Shinning stars of the organisation who proved their callibre falls under this category.
							</Card.Text>
							<Button variant='primary' onClick={() => navigate('/dashboard/topPerformerList')}>Click here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaUserAlt className='icon' />Placement drive lined up</Card.Title>
						<Card.Body>
							<Card.Text >
								Lets sense the intelligence and add it to our organisation, under this category.
							</Card.Text>
							<Button variant='primary' onClick={() => navigate('/hrAccess/placementDriveLinedUp', { state: { fullPage: true } })}>Click here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaChartLine className='icon' />Employee productivity</Card.Title>
						<Card.Body>
							<Card.Text >
								Add how we all contributed towards the growth of this organisation,under this category.							</Card.Text>
							<Button variant='primary'>Click here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaUserMinus className='icon' />Resignation</Card.Title>
						<Card.Body>
							<Card.Text >
								Respond to those looking for another opprtunities, under this category.							</Card.Text>
							<Button variant='primary' onClick={() => navigate('/hrAccess/resignation/allResignation')}>Click here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaFingerprint className='icon' />Quick Access</Card.Title>
						<Card.Body>
							<Card.Text >
								Quickly access the most impotant announcements within the organisation, under this category
							</Card.Text>
							<Button variant='primary' onClick={() => navigate('/hrAccess/quickAccess')}>Click here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaBuilding className='icon' />Edit Bank Details</Card.Title>
						<Card.Body>
							<Card.Text >
								Is there any fallacy is someone's bank details? No worries, rectify it,under this category.
							</Card.Text>
							<Button variant='primary' onClick={() => navigate('/hrAccess/editBankDetails')}>Click here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaUserEdit className='icon' />Edit Personal Information</Card.Title>
						<Card.Body>
							<Card.Text >
								Is there any misinterpretation about you? No issues,redress it now,under this category.
							</Card.Text>
							<Button variant='primary' onClick={() => navigate('/hrAccess/editPersonalInformation')}>Click here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaSitemap className='icon' />Departments</Card.Title>
						<Card.Body>
							<Card.Text >
								Want to make changes in Departments? Modify it under this category
							</Card.Text>
							<Button variant='primary' onClick={() => navigate('/department/departments')}>Click here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaClock className='icon' />Shift Timing</Card.Title>
						<Card.Body>
							<Card.Text >
								Worried about the working hours ? Allot shift timings to all the employees, under this category.							</Card.Text>
							<Button variant='primary' onClick={() => navigate(`/hrAccess/shifttiming`)}>Click here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaClock className='icon' />Update Holidays</Card.Title>
						<Card.Body>
							<Card.Text >
								Want to make changes in Holidays? Modify it under this category</Card.Text>
							<Button variant='primary' onClick={handleUpdateHolidays}>Click here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaClock className='icon' />View Bug reports</Card.Title>
						<Card.Body>
							<Card.Text >
								Want to make changes in Holidays? Modify it under this category</Card.Text>
							<Button variant='primary' onClick={() => navigate('/helpDesk/hr/bugReports')}>Click here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaClock className='icon' />Trainee Feedback</Card.Title>
						<Card.Body>
							<Card.Text >
								Want to make changes in Holidays? Modify it under this category</Card.Text>
							<Button variant='primary' onClick={() => navigate('/hrAccess/traineeFeedback')}>Click here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaClock className='icon' />Referrals</Card.Title>
						<Card.Body>
							<Card.Text >
								Want to make changes in Holidays? Modify it under this category</Card.Text>
							<Button variant='primary' onClick={() => navigate('/helpDesk/hr/referrals')}>Click here</Button>
						</Card.Body>
					</div>
				</Col>
				<Col xs={12} md={6} xl={4} xxl={3} className="mb-3">
					<div className='card' >
						<Card.Title><FaClock className='icon' />FAQs</Card.Title>
						<Card.Body>
							<Card.Text >
								Clearing queries about the application by answer them under this cateory.
							</Card.Text>
							<Button variant='primary' onClick={() => navigate('/hrAccess/faqs')}>Click here</Button>
						</Card.Body>
					</div>
				</Col>
				<ShiftTiming
					shiftTimingPopupOpen={shiftTimingModal}
					shiftTimingPopupClose={() => setShiftTimingModal(false)}
				/>
				<UpdateHolidays
					uploadHolidaysPopupOpen={updateHolidayModal}
					uploadHolidaysPopupClose={() => setUpdateHolidayModal(false)}
				/>
			</Row>
		</>
	)
}


export default Index
