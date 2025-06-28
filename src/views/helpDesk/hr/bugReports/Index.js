
import React, { useState } from 'react'
import { Col, Row } from "react-bootstrap"
import Breadcrumb from '../../../../components/Breadcrumb'
import { useGetAllBugForHr } from '../../../../query/helpdesk/getHelpdesk/getHelpdeskQuery'
import { useUpdateTicketStatus } from '../../../../query/helpdesk/updateHelpDesk/updateHelpdeskQuery'
import './style.scss'
const Card = React.lazy(() => import('./card/Index'))

const Index = () => {

	const { data: AllBugs, isLoading } = useGetAllBugForHr()
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
			<div className='allBugReports'>

				<Row className='cardHeader'>
					<Col><p className='cols bugNoCol'>Reported By</p></Col>
					<Col><p className='cols subjectCol'>Bug</p></Col>
					{/* <Col><p className='cols statusCol'>Status</p></Col> */}
					<Col><p className='cols reportedByCol'>Description</p></Col>
					<Col><p className='cols dateCol'>Document</p></Col>
				</Row>
				{/* These cards below are just mock data */}
				{
					AllBugs && AllBugs?.map(
						({ description, priority, screenshot, user_name, where_bug }) => {
							return <Card
								description={description}
								priority={priority}
								screenshot={screenshot}
								user_name={user_name}
								where_bug={where_bug}
							/>
						})
				}
			</div>
		</>
	)
}

export default Index