import React, { useEffect, useState } from "react"
import { Button, } from 'react-bootstrap'
import { FaClock, FaDotCircle, } from 'react-icons/fa'
import { useRecoilValue } from "recoil"
import { useEmployeeCheckIn, useEmployeeCheckOut, useGetEmployeeAttendanceStatus } from "../../../query/attendance/attendanceQuery"
import { useGetShiftTimingById } from "../../../query/shiftTiming/shiftTimingQuery"
import { authState } from "../../../recoil/authRecoil"
import './style.scss'
import Loader from '../../widgets/loader/Loader'
import { useGetGeoLocation } from "../../../query/location/allLocation/allLocationQuery"


const Index = () => {

	const empDetail = useRecoilValue(authState)
	const [totalTime, setTotalTime] = useState("");
	const [checkInId, setCheckInId] = useState("")
	const [earlyLate, setearlyLate] = useState("")
	const [userGeoLocation, seUserGeoLocation] = useState("")
	const [startTimer, setStartTimer] = useState(false);
	const [time, setTime] = useState(0);

	const { data: checkInData, isLoading: isCheckInDataLoading, mutateAsync: checkInMutateAsync } = useEmployeeCheckIn()
	const { data: checkOutData, isLoading: isCheckOutDataLoading, mutateAsync: checkOutMutateAsync } = useEmployeeCheckOut()
	const { data: EmpAttendanceStatus, isLoading: isLoadingEmpAttendance } = useGetEmployeeAttendanceStatus(empDetail.uuid);
	const { data: ShiftTimingData, isLoading: isLoadingShiftTiming } = useGetShiftTimingById(empDetail.uuid)
	const { data: geoLocation } = useGetGeoLocation()

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
		getStartWorkingTime()
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

	const getStartWorkingTime = () => {

		let start = ShiftTimingData?.["start-time"].split(":");
		let current = EmpAttendanceStatus && EmpAttendanceStatus.check_in && EmpAttendanceStatus.check_in.split(" ")[1].split(":")

		const startToMilliseconds = (parseInt(start[0]) * 60 * 60 + parseInt(start[1]) * 60 + parseInt(start[2])) * 1000;
		const currentToMilliseconds = (parseInt(current[0]) * 60 * 60 + parseInt(current[1]) * 60 + parseInt(current[2])) * 1000;
		var diff;
		if (startToMilliseconds >= currentToMilliseconds) {
			diff = startToMilliseconds - currentToMilliseconds
			setearlyLate("Early by")
		} else {
			diff = currentToMilliseconds - startToMilliseconds
			setearlyLate("Late by")
		}
		var hours = Math.floor(diff / 1000 / 60 / 60);
		diff -= hours * 1000 * 60 * 60;
		var minutes = Math.floor(diff / 1000 / 60);

		setTotalTime((hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes);
	}

	return (
		<div className="attendance customScroll cardShadow">
			<div className="titleRow mb-4">
				<div className='cardCustomTitle'>
					Attendance
				</div>
				{
					startTimer ?
						<Button variant="danger" onClick={checkout}>
							<FaClock className="btnIcon" />
							<div className="checkContent" >
								<div className="checkContentText">
									<b>{isCheckOutDataLoading ? 'Checking out...' : 'Check-Out'}</b>
								</div>
							</div>
						</Button>
						:
						<Button variant="primary" onClick={checkIn}>
							<FaClock className="btnIcon" />
							<div className="checkContent" >
								<div className="checkContentText">
									<b>Check-In</b>
								</div>
							</div>
						</Button>
				}
			</div>

            <div className="timeContent">
                <div className="checkInTime mb-2">
                    <p>
                        <span>{("0" + Math.floor((time / 3600000) % 24)).slice(-2)}:</span>
                        <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                        <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>
                    </p>
                </div>
                <div className="todaysDate mb-2">
                    {new Date().getDate()} {new Date().toLocaleString("default", {month: "long"})}{" "}
                    {new Date().getFullYear()} (
                    {
                        [
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                        ][new Date().getDay() % 7]
                    }
                    )
                </div>
                <div className="lateMsg">
                    {earlyLate} {totalTime == "" ? "00:00" : totalTime}
                </div>
            </div>
            <div className="progressBarinfo">
                <FaDotCircle className="terminalBullets" />
                <div className="progressBar">
                    <div
                        className={`pb progress-bar ${
                            startTimer ? "progress-bar-animated" : ""
                        } progress-bar-striped bg-primary`}
                        style={{width: `${Math.floor(time / 324000)}%`}}
                    ></div>
                </div>
                <FaDotCircle className="terminalBullets" />
            </div>
            <div className="startEndTimeInfo">
                <div className="startTime">
                    {ShiftTimingData?.["start-time"] &&
                        ShiftTimingData?.["start-time"]?.substring(0, 2)}
                    AM
                </div>
                <div className="timeSlot">
                    Shift(
                    {ShiftTimingData?.["start-time"] &&
                        ShiftTimingData?.["start-time"]?.substring(0, 2)}
                    AM -{" "}
                    {ShiftTimingData?.["end-time"] &&
                        ShiftTimingData?.["end-time"]?.substring(0, 2)}
                    PM)
                </div>
                <div className="endTime">{ShiftTimingData?.["end-time"]?.substring(0, 2)}PM</div>
            </div>
        </div>
    );
};

export default Index;
