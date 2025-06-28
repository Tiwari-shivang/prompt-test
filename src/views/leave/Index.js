import Moment from 'moment'
import React, { useRef, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { FaBirthdayCake, FaCalendarAlt, FaCalendarCheck, FaCalendarTimes, FaChevronLeft, FaChevronRight, FaEllipsisH, FaRegCalendarCheck, FaStethoscope, FaUserAlt } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { useGetAllHolidays } from '../../query/holidays/holidaysQuery'
import { useGetAllLeavesById } from '../../query/leave/allLeaves/allLeavesQuery'
import { authState } from '../../recoil/authRecoil'
import LeaveModal from '../modals/applyLeave/Index'
import RegularisationModal from '../modals/regularisationModal/Index'
import './style.scss'

const Index = () => {
	const navigate = useNavigate();
	const empDetail = useRecoilValue(authState)
	const scrollRef = useRef(null);
	const location = useLocation();
	const [getAllLeaves, setGetAllLeaves] = useState({
		"id": empDetail.uuid,
		"type": "upcoming",
	})
	const { data: allLeaves, isLoading: isLeavesLoading } = useGetAllLeavesById(getAllLeaves);
	const { data: allHolidays, isLoading: isHolidaysLoading } = useGetAllHolidays(getAllLeaves);
	const scroll = scrollVal => scrollRef.current.scrollLeft += scrollVal
	const [leaveType, setLeaveType] = useState('');
	const [regularisationModalVisible, setRegularisationModalVisible] = useState(false)
	const [applyLeaveModalVisible, setApplyLeaveModalVisible] = useState(location?.state?.popup === true ? true : false);
	// const [leaveToggle, setLeaveToggle] = useState('upcoming')
	const applyLeaveClickHandler = () => {
		setLeaveType('');
		setApplyLeaveModalVisible(true);
	}
	const holidaysClickHandler = () => {	
		navigate('/holidays')
	}
	const myApplicationsClickHandler = () => {
		navigate('/leaveApplications')
	}
	const regularisationRequestsClickHandler = () => {
		navigate('/regularisationRequests')
	}
	const regularisationClickHandler = () => {
		setRegularisationModalVisible(true)
	}
	const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
		<a
			href=""
			ref={ref}
			onClick={e => {
				e.preventDefault();
				onClick(e);
			}}
		>
			<a className='btn'>
				<FaEllipsisH />
			</a>
		</a>
	));
	return (
		<>
			<div className='headerRowMain'>
				<div className='infoSection'>
					<div className="nameAndPic">
						<div className='headPic'>
							{
								empDetail && empDetail.profile_picture ? <img src={empDetail.profile_picture} alt="" /> : <FaUserAlt className='userIcon' />
							}
						</div>
						<div className='empId'>{empDetail.office_id}</div>
						<div className='name'>{empDetail.first_name} {empDetail.last_name}</div>
					</div>
				</div>
				<div className='dateNav'>
					<button><FaChevronLeft /></button>
					<div className='dateInfo'>01-Jan-2023 - 31-Dec-2023</div>
					<button><FaChevronRight /></button>
				</div>
				<div className='headerButtons'>
					<button class="regBtn btn btn-primary btn-sm" onClick={regularisationClickHandler}>Regularisation</button>
					<button class="regBtn btn btn-primary btn-sm" onClick={applyLeaveClickHandler}>Apply Leave</button>
					<Dropdown>
						<Dropdown.Toggle as={CustomToggle}>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item onClick={holidaysClickHandler}>Holidays</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item onClick={myApplicationsClickHandler}>My leave applications</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item onClick={regularisationRequestsClickHandler}>My Regularisation requests</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</div>
			<div className='leaveCardsSection'>
				<FaChevronLeft className='left' onClick={() => { scroll(-320) }} />
				<div ref={scrollRef} className='leaveCards'>
					<Cards setLeaveType={setLeaveType} setApplyLeaveModalVisible={setApplyLeaveModalVisible} heading={'Birthday Leave'} available={0} booked={1} />
					<Cards setLeaveType={setLeaveType} setApplyLeaveModalVisible={setApplyLeaveModalVisible} heading={'Carried forward Comp offs'} available={3} booked={1} />
					<Cards setLeaveType={setLeaveType} setApplyLeaveModalVisible={setApplyLeaveModalVisible} heading={'Casual Leave'} available={3} booked={1} />
					<Cards setLeaveType={setLeaveType} setApplyLeaveModalVisible={setApplyLeaveModalVisible} heading={'Compensatory Off'} available={3} booked={1} />
					<Cards setLeaveType={setLeaveType} setApplyLeaveModalVisible={setApplyLeaveModalVisible} heading={'Earned Leave'} available={3} booked={1} />
					<Cards setLeaveType={setLeaveType} setApplyLeaveModalVisible={setApplyLeaveModalVisible} heading={'Loss of Pay'} available={3} booked={1} />
					<Cards setLeaveType={setLeaveType} setApplyLeaveModalVisible={setApplyLeaveModalVisible} heading={'Sick Leave'} available={3} booked={1} />
				</div>
				<FaChevronRight className='right' onClick={() => { scroll(320) }} />
			</div>
			<div className='allLeaveAndHolidays'>
				<div className='headerRow'>
					<div className='titleText'>
						All leave and holidays
					</div>
					<div className='buttons'>
						<button className={`upcoming ${getAllLeaves.type == 'upcoming' ? 'selectedBtn' : 'deselectedBtn'}`} onClick={() => { setGetAllLeaves({ "id": empDetail.uuid, "type": "upcoming" }) }}><b>Upcoming</b></button>
						<button className={`history ${getAllLeaves.type == 'upcoming' ? 'deselectedBtn' : 'selectedBtn'}`} onClick={() => { setGetAllLeaves({ "id": empDetail.uuid, "type": "history" }) }}><b>History</b></button>
					</div>
				</div>
				<div className='leaveAndHolidays customScroll'>
					{
						allLeaves && allLeaves.map((item, index) => (
							<div className='leave hoverGrey'>
								<div className='leaveDate'>{Moment(item.leave_date).format('ll')}</div>
								<div className='leaveType greenStrip'>{item.leave_type} {'(1 Day)'}</div>
								<div className='leaveStatus'>{item.leave_status ? item.leave_status : "Booked"}</div>
							</div>
						))
					}
					{
						allHolidays?.map(({ date, holiday_name }) =>
							<div className='holiday hoverGrey'>
								<FaCalendarAlt className='calIcon' />
								<div className='calDate'>{Moment(date).format('ll')}</div>
								<div className='calFestival'>{holiday_name}</div>
							</div>
						)
					}
				</div>
			</div>
			<RegularisationModal regularisationModalVisible={regularisationModalVisible} setRegularisationModalVisible={setRegularisationModalVisible} />
			<LeaveModal applyLeaveModalVisible={applyLeaveModalVisible} setApplyLeaveModalVisible={setApplyLeaveModalVisible} leaveType={leaveType} />
		</>
	)
}

const Cards = ({ heading, available, booked, setLeaveType, setApplyLeaveModalVisible }) => {
	const navigate = useNavigate();
	const cardClickHandler = () => {
		setLeaveType(heading);
		setApplyLeaveModalVisible(true);
		// navigate('/applyLeave', { state: { type: heading } })
	}
	return (
		<div className='leaveCard' onClick={cardClickHandler}>
			<div className='headingText'>{heading}</div>
			{
				heading == 'Birthday Leave' ?
					<FaBirthdayCake className='birthdayLeave imgIcon' /> :
					heading == 'Casual Leave' ?
						<FaCalendarAlt className='casualLeave imgIcon' /> :
						heading == 'Sick Leave' ?
							<FaStethoscope className='sickLeave imgIcon' /> :
							heading == 'Carried forward Comp offs' ?
								<FaCalendarAlt className='carriedForwardCompOffs imgIcon' /> :
								heading == 'Compensatory Off' ?
									<p className='compOffText'>CO</p> :
									heading == 'Earned Leave' ?
										<FaCalendarCheck className='earnedLeave imgIcon' /> :
										heading == 'Loss of Pay' ?
											<FaCalendarTimes className='lossOfPay imgIcon' /> :
											<FaRegCalendarCheck className='imgIcon' />

			}
			<div className='availableText'>Available: {available}</div>
			<div className='bookedText'>Booked: {booked}</div>
		</div>
	)
}

export default Index
