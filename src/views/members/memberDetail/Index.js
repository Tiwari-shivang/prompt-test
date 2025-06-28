import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaUserAlt } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";
import Email from '../../../assets/images/email.svg';
import Phone from '../../../assets/images/phone.svg';
import Breadcrumb from '../../../components/Breadcrumb';
import { useGetAllRms, useGetMembersById } from "../../../query/members/allMembers/allMembersQuery";
import { useGetAllProjectWithAssociatedEmployee } from '../../../query/projects/allProjects/allProjectsQuery';
import './style.scss';
import { capitalizeFirstLetter } from '../../../utilits/usefulFunctions';
import { formatDate } from '../../../utilits/usefulFunctions';
const MemberDetail = () => {
	const params = useParams();
	const navigate = useNavigate()
	const percentage = 66;
	const [currentPeriod, setCurrentPeriod] = useState({
		year: null,
		month: null
	})
	const { data: dataAllRm, isLoading: isLoadingAllRm } = useGetAllRms();
	const { data: details, isLoading } = useGetMembersById(params.id);

	const { data: projectWithEmp, isLoading: isLoadingProjects } = useGetAllProjectWithAssociatedEmployee({ empId: params.id });
	const fileterRm = dataAllRm?.filter(dataAllRm => { return dataAllRm?.uuid === details?.reporting_manager_uuid; });

	useEffect(() => {
		const date = new Date();
		let month = (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1);
		let year = date.getFullYear();
		setCurrentPeriod({
			year: parseInt(year) - parseInt(new Date(details?.date_of_joining).getFullYear()),
			month: parseInt(month) - parseInt(new Date(details?.date_of_joining).getMonth())
		})
	}, [details]);

	const goToProjectDetail = (id) => {
		navigate(`/projects/projectDetail/${id}`)
	}

	return (
		<div className="memberDetail container">
			<Row className='mb-2'>
				<Col xs={6}>
					<Breadcrumb />
				</Col>
				<Col xs={6} className="text-end">
				</Col>
			</Row>
			<Row>
				<Col sm={12} md={3} className="px-2 mb-3">
					<div className='profileImgSection'>
						<div className='imgSection'>
							<div className='imgContainer'>
								<div className="img">
									{
										details && details?.profile_picture ? <img src={details?.profile_picture} alt="" /> : <FaUserAlt className='userIcon' />
									}
								</div>
							</div>
							<h6>{details?.first_name} {details?.last_name}</h6>
							<p>{details?.designation_name}</p>
						</div>
						<div className='phoneSection'>
							<img src={Phone} alt="" />
							<p>{'+'}{details?.phone_number?.substring(0, 2)}-{details?.phone_number?.substring(2)}</p>
						</div>
						<div className='phoneSection'>
							<img src={Email} alt="" />
							<p>{details?.email}</p>
						</div>
						<div className='phoneSection'>
							<img src={Email} alt="" />
							<p>{details?.department_name}</p>
						</div>
					</div>
				</Col>
				<Col sm={12} md={4} className="px-2">
					<div className='basicInfo'>
						<div className='cardCustomTitle'>Basic Information</div>
						<div className='infoTable'>
							<table class="table">
								<tbody>
									<tr>
										<td>Employee</td>
										<td>{details?.office_id}</td>
									</tr>
									<tr>
										<td>First Name</td>
										<td>{details?.first_name}</td>
									</tr>
									<tr>
										<td>Last Name</td>
										<td>{details?.last_name}</td>
									</tr>
									<tr>
										<td>Timing</td>
										<td>{details?.shift_timing}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					{/* <div className='basicInfo'>
                  <div className='title'>Allocation</div>
                  <div className='memberSkills'>

                  </div>
              </div> */}
					<div className='basicInfo'>
						<div className='cardCustomTitle'>Allocation</div>
						<div className='allocations customScroll'>
							{
								projectWithEmp && projectWithEmp.project_with_employee && projectWithEmp.project_with_employee?.length > 0 ? projectWithEmp?.project_with_employee?.map((item, index) =>
									<div className='projectCard'>
										<div className='info'>
											<div className='name'>{item.project.project_name}</div>
											<div className='description'>{item.project.description}</div>
										</div>
										<div className='percentage'>{item.emp_allocation.allocation}% engaged</div>
									</div>
								) : <p>Not allocated to any project</p>
							}
						</div>
					</div>
					<div className='basicInfo'>
						<div className='cardCustomTitle'>Personal Details</div>
						<div className='infoTable'>
							<table class="table">
								<tbody>
									<tr>
										<td>Gender</td>
										<td>{details?.gender}</td>
									</tr>
									<tr>
										<td>Marital Status</td>
										<td>{details?.location}</td>
									</tr>
									{/* <tr>
                                        <td>Wedding Day</td>
                                        <td>{details?.designation}</td>
                                    </tr> */}
								</tbody>
							</table>
						</div>
					</div>
				</Col>
				<Col sm={12} md={5} className="px-2">
					<div className='reportingSection'>
						<div className='cardCustomTitle'>Reporting To</div>
						<div className='projectManager' onClick={() => { navigate(`/members/memberDetail/${details?.reporting_manager_uuid}`) }}>
							<div className='projectManagerPic'>
								{
									fileterRm && fileterRm[0]?.profile_picture ? <img src={fileterRm[0].profile_picture} alt="" /> : <FaUserAlt className='userIcon' />
								}
							</div>
							<p>{fileterRm && fileterRm[0]?.designation_name} <span>{fileterRm && fileterRm[0]?.first_name} {fileterRm && fileterRm[0]?.last_name}</span></p>
						</div>
					</div>
					<div className='basicInfo'>
						<div className='cardCustomTitle'>Work Information</div>
						<div className='infoTable'>
							<table class="table">
								<tbody>
									<tr>
										<td>Department</td>
										<td>{details?.department_name}</td>
									</tr>
									<tr>
										<td>Location</td>
										<td>{details?.location_name}</td>
									</tr>
									<tr>
										<td>Designation</td>
										<td>{details?.designation_name}</td>
									</tr>
									{/* <tr>
                                <td>Employment Type</td>
                                <td>--</td>
                            </tr> */}
									<tr>
										<td>Employee Status</td>
										<td>{details?.employee_status}</td>
									</tr>
									<tr>
										<td>Date of Joining</td>
										<td>{formatDate(details?.date_of_joining)}</td>
									</tr>
									<tr>
										<td>Date of Confirmation</td>
										<td>{formatDate(details?.date_of_confirmation)}</td>
									</tr>
									<tr>
										<td>Current Experience</td>
										<td>{`${currentPeriod?.year} year, ${currentPeriod?.month} month${currentPeriod?.month != 1 ? 's' : ''}`}</td>
									</tr>
									<tr>
										<td>Total Experience</td>
										<td>{details?.total_experience}</td>
									</tr>
									<tr>
										<td>Probation Confirmation Status</td>
										<td>{details?.employee_status === "Probation" ? "Probation" : "Confirmed"}</td>
									</tr>
									<tr>
										<td>Probation Period</td>
										<td>90</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</Col>
				<Col xs={12} className="px-2 my-3">
					<div className='reportingSection'>
						<div className='cardCustomTitle'>Skills</div>
						<div className='skillsSection'>
							<p><span>Primary skills: </span>{capitalizeFirstLetter(details && details.primary_skill_name)}</p>
							<p><span>secondary skills: </span>{details && details.secondary_skills}</p>
							<p><span>Area of Interest: </span>{details && details.area_of_interest}</p>
						</div>

					</div>
				</Col>


				<Col xs={12} className="px-2">
					<div className='memberDetailCurrentProject container'>
						{projectWithEmp?.project_with_employee?.length > 0 ? <h2>Current Project</h2> : <h2></h2>}
						<Row className='px-2'>
							{
								projectWithEmp?.project_with_employee?.map((item, id) => (
									<Col xs="12" lg="6" xl="4" className="px-2" key={id}>
										<div className='currentProject' onClick={() => goToProjectDetail(item.project?.uuid)}>
											<div className='projectName'>{item.project?.project_name}</div>
											<div className='progressPriority'>
												<span>{item?.phase ? "Inprogress" : "Completed"}</span>
												<p>Priority : {item.project?.priority}</p>
											</div>
											<div className='projectDescription'>{item.project?.description}</div>
											{/* <div className='projectCompletetion'> */}
											{/* <p>{item?.phase ? "Inprogress" : "Completed"}</p> */}
											{/* <div className='progessBar'>
                                    <CircularProgressbar value={percentage} text={`${percentage}%`} />
                                    </div> */}
											{/* </div> */}
											<div className='projectManager'>
												<p>Project Manager : <span>{item?.project_manager?.first_name} {item?.project_manager?.last_name}</span></p>
											</div>
											<div className='teamMember'>
												<p>Team Member</p>
												<div className='teamMembers'>
													{
														item?.employees?.slice(0, 5).map((empImg, index) => (
															<OverlayTrigger
																placement="top"
																delay={{ show: 250, hide: 400 }}
																overlay={
																	<Tooltip id="button-tooltip">
																		{empImg?.first_name} {empImg?.last_name}
																	</Tooltip>
																}
															>
																<div className='teamMembersPic'>
																	{
																		empImg && empImg?.profile_picture ? <img src={empImg.profile_picture} alt="" /> : <FaUserAlt className='userIcon' />
																	}
																</div>
															</OverlayTrigger>
														))
													}
													{
														item?.employees?.length > 5 && (
															<div className='hiddenTeamMembersPic'>
																<p>+{item?.employees?.length - 5}</p>
															</div>
														)
													}

												</div>
											</div>
										</div>
									</Col>
								))
							}
						</Row>
					</div>
				</Col>
			</Row>
		</div>
	)
}





export default MemberDetail
