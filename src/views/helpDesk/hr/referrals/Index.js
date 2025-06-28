
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../../../components/Breadcrumb'
import { Row, Col, Button, Table, Badge, Form, } from "react-bootstrap"
import { useUpdateTicketStatus } from '../../../../query/helpdesk/updateHelpDesk/updateHelpdeskQuery'
import './style.scss'
import Moment from 'moment'
import { useGetAllReferralForHr } from '../../../../query/referral/allReferral/allReferralQuery'
const Card = React.lazy(() => import('./card/Index'))

const Index = () => {

	const { data: allReferralForHr, isLoading } = useGetAllReferralForHr()
	const { mutateAsync: updateMutateAsync } = useUpdateTicketStatus();

	const [layout, setLayout] = useState('min');
	const [filterMode, setFilterMode] = useState(false);
	const [backButtonVisiblity, setBackButtonVisiblity] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState({})
	const [ids, setIds] = useState("");
	const handleSelectedTicket = (id, empId, subject, assignedTo, email, description) => {
		const val = {
			"id": id,
			"empId": empId,
			"empEmail": email,
			"assignedTo": assignedTo,
			"subject": subject,
			"ticketDescription": description ? description : ""
		}
		setSelectedTicket(val);
	}

	const filterClickHandler = () => {
		setFilterMode(true);
		setBackButtonVisiblity(true);
	}
	const backClickHandler = () => {
		setFilterMode(false);
		setBackButtonVisiblity(false);
	}
	const data = [
		{

		}
	]

	const selectRow = {
		mode: 'checkbox',
		clickToSelect: true,
		classes: 'selection-row',
	};

	const handleOnClose = () => {
		const closeData = selectedTicket;
		closeData['ticketStatus'] = "Closed";
		updateMutateAsync(closeData)
	}

	const handleOnAssign = () => {
		const assignData = selectedTicket;
		assignData['ticketStatus'] = "Assign";
	}

	const handleOnDelete = () => {
		const deleteData = selectedTicket;
		deleteData['ticketStatus'] = "Delete";
		// updateMutateAsync(deleteData)
	}

	const handleOnMerge = () => {
		const mergeData = selectedTicket;
		mergeData['ticketStatus'] = "Merge";
		// updateMutateAsync(mergeData)
	}

	const handleOnEscalate = () => {
		const escalateData = selectedTicket;
		escalateData['ticketStatus'] = "In Progress";
		updateMutateAsync(escalateData)
	}

	return (
		<>
			<Row className='nav mb-2'>
				<Col xs={4}>
					<Breadcrumb />
				</Col>
				<Col xs={8} className="filter-buttons mb-2">
					<div className='list'>
						{/* <Button size='sm' variant='outline-secondary' onClick={layoutButtonClickHandler}>{layout === 'min' ? <RiLayoutGridLine /> : <RiMenu3Fill />}</Button>
						<Button size='sm' variant='outline-primary' onClick={filterClickHandler}><RiFilterLine /> Filter</Button>
						{
							backButtonVisiblity ?
								<Button size='sm' variant='outline-primary' onClick={backClickHandler}><RiExternalLinkFill /></Button>
								: ''
						} */}
					</div>
				</Col>
			</Row>
			<div className='referrals'> 
				<Row className='cardHeader'>
					<Col sm={4}className='cols referredByCol'>Referred By</Col>
					<Col sm={2}className='cols nameCol'>Name</Col>
					<Col sm={2}className='cols resumeCol'>Resume</Col>
					<Col sm={2}className='cols resumeCol'>Email</Col>
					<Col sm={2}className='cols actionCol'>Action</Col>
				</Row>
				{
							allReferralForHr && allReferralForHr?.map(
								({ emp_id, emp_photo, referral_date, referral_email, referral_name, referral_resume, referral_status }) => {
									return <Card
									    emp_id={emp_id}
										referral_by={referral_email}
										name={referral_name}
										resume={referral_resume}
										date={Moment(referral_date).format('DD-MM-YYYY')}
										status={referral_status}
										email={referral_email}
									/>
								})
						}
			</div>
		</>
	)
}

export default Index