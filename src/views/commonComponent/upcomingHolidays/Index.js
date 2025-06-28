import React, {useEffect, useState} from "react";
import {useRecoilValue} from "recoil";
import {useGetAllHolidays} from "../../../query/holidays/holidaysQuery";
import {authState} from "../../../recoil/authRecoil";
import Loader from "../../widgets/loader/Loader";
import "./style.scss";

const UpcomingHolidays = () => {
	const empDetail = useRecoilValue(authState)
	const [nextHolidays, setNextHolidays] = useState()
	const [getAllLeaves, setGetAllLeaves] = useState({
		"id": empDetail.uuid,
		date: new Date().getFullYear() +
		"-" +
		("0" + (new Date().getMonth() + 1)).slice(-2) +
		"-" +
		new Date().getDate(),
		// "type": "upcoming",
	})
	const { data: allHolidays, isLoading: isAllHolidaysLoading } = useGetAllHolidays(getAllLeaves)

	useEffect(() => {
		const date = new Date();
		let day = (date.getDate() < 10 ? '0' : '') + date.getDate();
		let month = (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1);
		let year = date.getFullYear();
		const todayDate = `${year}-${month}-${day}`
		const holidayList = allHolidays?.filter((item) => item.date > todayDate);
		setNextHolidays(holidayList)
	}, [allHolidays])

	return (
		<div className='holidaysMaindiv cardShadow'>
			<div className='cardCustomTitle'>Upcoming Holidays</div>
			<div className='holidayGroup customScroll'>
				{
					(isAllHolidaysLoading) ?
						<Loader />
						:
						(!nextHolidays || !nextHolidays.length) ?
							<div className='emptyListText' style={{marginTop:'7px'}}>
								No Holidays Found
							</div>
							:
							nextHolidays?.map((item, i) => (
								<div className='holidays' key={i}>
									<p>{item?.month} <span>{item?.day}</span></p>
									<p>{item?.holiday_name}</p>
								</div>
							))
				}
			</div>
		</div>
	)
}

export default UpcomingHolidays;
