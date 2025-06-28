import React, { useEffect, useState } from 'react'
import { WiDayCloudy } from 'react-icons/wi'
import { useRecoilValue } from "recoil"
import { useEmployeeCheckIn, useEmployeeCheckOut, useGetEmployeeAttendanceStatus } from '../../../query/attendance/attendanceQuery'
import { useGetGeoLocation } from '../../../query/location/allLocation/allLocationQuery'
import { useGetWeatherDetail } from '../../../query/weather/weatherQuery'
import { authState } from "../../../recoil/authRecoil"
import './style.scss'

const WeatherAttendance = () => {

	const empDetail = useRecoilValue(authState)

	const [greet, setGreet] = useState("")
	const [checkInId, setCheckInId] = useState("")
	const [startTimer, setStartTimer] = useState(false);
	const [userGeoLocation, seUserGeoLocation] = useState("")
	const [time, setTime] = useState(0);

	const { data: weatherData, isLoading: isLoadingWeather } = useGetWeatherDetail("noida");
	const { data: checkInData, isLoading: isLoadingCheckIn, mutateAsync: checkInMutateAsync } = useEmployeeCheckIn()
	const { data: checkOutData, isLoading: isLoadingCheckOut, mutateAsync: checkOutMutateAsync } = useEmployeeCheckOut()
	const { data: EmpAttendanceStatus, isLoading: isLoadingEmpAttendance } = useGetEmployeeAttendanceStatus(empDetail.uuid);
	const { data: geoLocation } = useGetGeoLocation()

	useEffect(() => {
		var today = new Date()
		var curHr = today.getHours()
		if (curHr < 12) {
			setGreet('Good Morning')
		} else if (curHr < 18) {
			setGreet('Good Afternoon')
		} else {
			setGreet('Good Evening')
		}
	}, [])

	useEffect(() => {
		if (checkInData && checkInData.attendance_uuid) {
			setStartTimer(true)
			setCheckInId(checkInData.attendance_uuid)
		}
	}, [checkInData])

	useEffect(() => {
		if (geoLocation && geoLocation.region) {
			seUserGeoLocation(geoLocation.region)
		}
	}, [geoLocation])

	useEffect(() => {
		let interval = {

		};
		if (startTimer) {
			interval = setInterval(() => {
				setTime((time) => time + 10);
			}, 10);
		} else if (!startTimer) {
			clearInterval(interval);
		}

		return () => clearInterval(interval);
	}, [startTimer]);

	useEffect(() => {
		if (EmpAttendanceStatus && EmpAttendanceStatus.total_time) {
			const splitTime = EmpAttendanceStatus && EmpAttendanceStatus.total_time && EmpAttendanceStatus.total_time.split(":")
			const toMilliseconds = (parseInt(splitTime[0]) * 60 * 60 + parseInt(splitTime[1]) * 60 + parseInt(splitTime[2])) * 1000;
			setTime(toMilliseconds)
		}
		if (EmpAttendanceStatus && EmpAttendanceStatus.attendance_uuid) {
			setCheckInId(EmpAttendanceStatus.attendance_uuid)
		}
		if (EmpAttendanceStatus && EmpAttendanceStatus.is_checked_in) {
			setStartTimer(true)
		} else {
			setStartTimer(false)
		}
	}, [EmpAttendanceStatus])

	const checkIn = () => {
		const hours = ("0" + Math.floor((time / 3600000) % 24)).slice(-2)
		const mins = ("0" + Math.floor((time / 60000) % 60)).slice(-2)
		const secs = ("0" + Math.floor((time / 1000) % 60)).slice(-2)
		const empCheckInData = {
			"emp_uuid": empDetail && empDetail.uuid,
			"pm_uuid": empDetail && empDetail.reporting_manager_uuid,
			"total_time": `${hours}:${mins}:${secs}`,
			"check_in_location": userGeoLocation
		}
		checkInMutateAsync(empCheckInData)
	}

	const checkout = () => {
		const hours = ("0" + Math.floor((time / 3600000) % 24)).slice(-2)
		const mins = ("0" + Math.floor((time / 60000) % 60)).slice(-2)
		const secs = ("0" + Math.floor((time / 1000) % 60)).slice(-2)
		const empCheckOutata = {
			"emp_uuid": empDetail && empDetail.uuid,
			"attendance_uuid": checkInId,
			"total_time": `${hours}:${mins}:${secs}`,
			"check_in_location": userGeoLocation
		}
		checkOutMutateAsync(empCheckOutata)
		setStartTimer(false)
	}

	return (
		<div className={`checkInSection d-flex align-items-center justify-content-center cardShadow   ${startTimer ? 'redBG' : 'blueBG'}`}>
			<div className='goodMorningSection'>
				<p>{weatherData && weatherData.temperature}<sup>O</sup>C <WiDayCloudy className="icon" /></p>
				<p><span>{greet}</span></p>
			</div>
			<div className="checkInButton">
				{
					startTimer ? <button onClick={checkout} className='redBG'> {isLoadingCheckOut ? 'Checking out...' : 'Check-Out'}</button>
						:
						<button onClick={checkIn} className='blueBG'>{isLoadingCheckIn ? 'Checking in...' : 'Check-In'}</button>
				}
				<p>
					<span>{("0" + Math.floor((time / 3600000) % 24)).slice(-2)}:</span>
					<span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
					<span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
				</p>
			</div>
		</div >
	)
}

export default WeatherAttendance
