import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { FaUserAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from "recoil"
import Breadcrumb from '../../components/Breadcrumb'
import { useGetBankDetails } from '../../query/bankDetails/allBankDetails/allBankDetailsQuery'
import { useGetIdentityById } from '../../query/identity/allIdentity/allIdentityQuery'
import { useGetAllRms } from '../../query/members/allMembers/allMembersQuery'
import { useGetSelfService } from '../../query/selfService/selfServiceQuery'
import { authState } from "../../recoil/authRecoil"
import Resume from '../commonComponent/resume/Index'
import { formatDate } from '../../utilits/usefulFunctions'
import './style.scss'


const SelfService = () => {
	const navigate = useNavigate();
	const empDetail = useRecoilValue(authState)
	const [visibleContent, setVisibleContent] = useState(false)
	const [currentPeriod, setCurrentPeriod] = useState({
		year: null,
		month: null
	})

	const { data } = useGetSelfService(empDetail && empDetail.uuid);
	const { data: bankDetails } = useGetBankDetails(empDetail && empDetail.uuid);
	const { data: identityInfo } = useGetIdentityById(empDetail && empDetail.uuid);
	const { data: getRms } = useGetAllRms()

	const rms = getRms?.filter(item => item.uuid == data?.employee?.reporting_manager_uuid)[0]

	useEffect(() => {
		const date = new Date();
		let month = (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1);
		let year = date.getFullYear();
		setCurrentPeriod({
			year: parseInt(year) - parseInt(new Date(data?.employee?.date_of_joining).getFullYear()),
			month: parseInt(month) - parseInt(new Date(data?.employee?.date_of_joining).getMonth())
		})
	}, [data]);
	const resignationClickHandler = () => {
		navigate('/selfService/resignation');
	}
	useEffect(() => {
		const date = new Date();
		let month = (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1);
		let year = date.getFullYear();
		setCurrentPeriod({
			year: parseInt(year) - parseInt(new Date(data?.employee?.date_of_joining).getFullYear()),
			month: parseInt(month) - parseInt(new Date(data?.employee?.date_of_joining).getMonth())
		})
	}, [data]);

	const handleToggleEye = (e, val) => {
		setVisibleContent(val)
	}

	return (
		<div className="selfService">
			<Row className='mb-2'>
				<Col xs={6}>
					<Breadcrumb />
				</Col>
				<Col xs={6} className="text-end">

				</Col>
			</Row>
			<Row>
				<Col xs={12} sm={4} className="px-2 mb-3">
					<div className='profileImgSection cardShadow'>
						<div className='imgSection'>
							<div className="img">
								{
									data && data.employee && data.employee.profile_picture ? <img src={data.employee.profile_picture} alt="" /> : <FaUserAlt className='userIcon' />
								}
							</div>
							<h6>{data && data.employee && data.employee.first_name} {data && data.employee && data.employee.last_name}</h6>
							<p>{data?.designation}</p>
						</div>
					</div>
					<div className='reportingSection cardShadow'>
						<div className='cardCustomTitle'>Reporting To</div>
						<div className='projectManager'>
							<div className='projectManagerPic'>
								{
									rms && rms.profile_picture ? <img src={rms.profile_picture} alt="" /> : <FaUserAlt className='userIcon' />
								}
							</div>
							<p>Project Manager <span>{rms?.first_name} {rms?.last_name}</span></p>
						</div>
					</div>
				</Col>
				<Col xs={12} sm={8} className="px-2 mb-3">
					<div className='basicInfo cardShadow'>
						<div className='cardCustomTitle'>Work Information</div>
						<div className='infoTable'>
							<table class="table">
								<tbody>
									<tr>
										<td>Department</td>
										<td>{data?.employee?.department_name}</td>
									</tr>
									<tr>
										<td>Location</td>
										<td>{data?.employee?.location_name}</td>
									</tr>
									<tr>
										<td>Designation</td>
										<td>{data?.employee?.designation_name}</td>
									</tr>
									{/* <tr>
                                <td>Employment Type</td>
                                <td>--</td>
                            </tr> */}
									<tr>
										<td>Employee Status</td>
										<td>{data?.employee?.employee_status}</td>
									</tr>
									<tr>
										<td>Date of Joining</td>
										<td>{formatDate(data?.employee?.date_of_joining)}</td>
									</tr>
									<tr>
										<td>Date of Confirmation</td>
										<td>{formatDate(data?.employee?.date_of_confirmation)}</td>
									</tr>
									<tr>
										<td>Current Experience</td>
										<td>{`${currentPeriod?.year} year, ${currentPeriod?.month} month`}</td>
									</tr>
									<tr>
										<td>Total Experience</td>
										<td>{data?.employee?.total_experience}</td>
									</tr>
									<tr>
										<td>Probation Confirmation Status</td>
										<td>{data?.employee?.employee_status === "Probation" ? "Probation" : "Confirmed"}</td>
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
			</Row>
			<Row>
				<Col xs={12} md={6} className="mb-3 px-2 ">
					<div className='basicInfo cardShadow'>
						<div className='cardCustomTitle'>Bank Details</div>
						<div className='infoTable'>
							<table class="table">
								<tbody>
									<tr>
										<td>Bank Name</td>
										<td>{bankDetails?.bank_name}</td>
									</tr>
									<tr>
										<td>Payment Mode</td>
										<td>{bankDetails?.account_type}</td>
									</tr>
									<tr>
										<td>IFSC Code</td>
										<td>{bankDetails?.ifsc_code}</td>
									</tr>
									<tr>
										<td>Account Type</td>
										<td>{bankDetails?.account_type}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</Col>
				<Col xs={12} md={6} className="mb-3 px-2">
					<div className='basicInfo cardShadow'>
						<div className='flexDiv'>
							<div className='cardCustomTitle'>Identity Information</div>
							<div className=''>
								{
									visibleContent ?
										<AiOutlineEyeInvisible className='icon eyetoggleclass' onClick={(e) => handleToggleEye(e, false)} />
										:
										<AiOutlineEye className='icon eyetoggleclass' onClick={(e) => handleToggleEye(e, true)} />
								}
							</div>
						</div>
						<div className='infoTable'>
							<table class="table">
								<tbody>

									<tr>
										<td>UAN</td>
										<td>{visibleContent ? identityInfo && identityInfo.uan : data?.identity_information?.uan}</td>
									</tr>
									<tr>
										<td>PAN</td>
										<td>{visibleContent ? identityInfo && identityInfo.pan : data?.identity_information?.pan}</td>
									</tr>
									<tr>
										<td>Aadhar</td>
										<td>{visibleContent ? identityInfo && identityInfo.aadhaar : data?.identity_information?.aadhaar}</td>
									</tr>
									<tr>
										<td>Passport</td>
										<td>{visibleContent ? identityInfo && identityInfo.passport : data?.identity_information?.passport}</td>
									</tr>
									<tr>
										<td>Passport Valid Until</td>
										<td>{visibleContent ? identityInfo && identityInfo.passport_valid_until : data?.identity_information?.passport_valid_until}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</Col>
				<Col xs={12} md={6} className="mb-3 px-2">
					<Row>
						<Col sm={12} className='mb-3' >
							<div className='basicInfo cardShadow'>
								<div className='cardCustomTitle'>Referral</div>
								<button type="button" className="btn btn-primary btn-sm" onClick={() => { navigate('/selfService/referral/referralList') }}>My Referrals</button>
							</div>
						</Col>
						<Col sm={12} >
							<div className='basicInfo cardShadow'>
								<div className='cardCustomTitle'>Resignation</div>
								<button type="button" className="btn btn-danger btn-sm" onClick={resignationClickHandler}>Resignation</button>
							</div>
						</Col>
					</Row>
				</Col>
				<Col xs={12} md={6} className="mb-3 px-2">
					{
						empDetail && empDetail && empDetail.uuid && (
							<Resume userId={empDetail && empDetail && empDetail.uuid} />
						)
					}
				</Col>
			</Row>
		</div>
	)
}

export default SelfService