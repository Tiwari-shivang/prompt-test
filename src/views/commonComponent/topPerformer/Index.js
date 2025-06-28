import React from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useGetTopPerformer } from '../../../query/members/allMembers/allMembersQuery';
import './style.scss';
import Loader from "../../widgets/loader/Loader"

const TopPerformer = () => {
	const navigate = useNavigate()
	const { data: topPerformerList, isLoading: istopPerformerList } = useGetTopPerformer();
	const handleEmployeeDetail = (id) => {
		navigate(`/members/memberDetail/${id}`)
	}
	return (
		<div className='listOfTopPerformer cardShadow'>
			<div className='cardCustomTitle'>Top Performer</div>
			<div className='topPerformersList customScroll'>
				{
					(istopPerformerList) ?
						<Loader/>:
						(topPerformerList && !topPerformerList?.length) ?
							<div className='emptyListText' style={{marginTop:'14px'}}>
								No Top Performers Found
							</div>
							:
							topPerformerList && topPerformerList.map((item, index) => (
								(index > 4) ? '' :
								<div className='aboutTopPerformer' key={index} onClick={() => handleEmployeeDetail(item.emp.uuid)}>
									<div className='topPerformerPic'>
										{/* <img src={avatar1} alt=""/> */}
										{
											item && item.profile_picture ? <img src={item.profile_picture} alt="" /> : <FaUserAlt className='userIcon' />
										}
									</div>
									<div className='topPerformerDetail'>
										<p>{item.first_name} {item.last_name}</p>
										<p>{item.designation_name}</p>
									</div>
								</div>
							))
				}
			</div>
			<div className='viewFullListButton'>
			<button onClick={() => navigate('/dashboard/TopPerformerList')}>View Full List</button>
			</div>
		</div>
	)
}

export default TopPerformer;
