
import Moment from 'moment'
import React, { useState } from 'react'
import { Button, Col, Row } from "react-bootstrap"
import { RiDeleteBin2Line, RiExternalLinkFill, RiFilterLine, RiGitMergeLine, RiMenu3Fill, RiThumbUpFill, RiUserAddLine } from 'react-icons/ri'
import Breadcrumb from '../../../../components/Breadcrumb'
import { useGetFinanceTicket } from '../../../../query/financeHelpdesk/getHelpdesk/getHelpdeskQuery'
import { useUpdateTicketStatus } from '../../../../query/helpdesk/updateHelpDesk/updateHelpdeskQuery'
import './style.scss'
const Card = React.lazy(() => import('./card/Index'))

const Index = () => {

	const { data: AllTicketForFinanceDashboard, isLoading } = useGetFinanceTicket()
	const { mutateAsync: updateMutateAsync} = useUpdateTicketStatus();
	
	const [layout, setLayout] = useState('min');
	const [filterMode, setFilterMode] = useState(false);
	const [backButtonVisiblity, setBackButtonVisiblity] = useState(false);
	const[selectedTicket, setSelectedTicket] = useState({})
	const[ids,setIds] = useState("");
	const handleSelectedTicket = (id,empId,subject, assignedTo, email, description) => {
		const val = {
			"id": id,
			"empId": empId,
			"empEmail": email,
			"assignedTo": assignedTo,
			"subject": subject,
			"ticketDescription":description ? description : ""
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
						{/* <Button size='sm' variant='outline-secondary' onClick={layoutButtonClickHandler}>{layout === 'min' ? <RiLayoutGridLine /> : <RiMenu3Fill />}</Button> */}
						<Button size='sm' variant='outline-primary' onClick={filterClickHandler}><RiFilterLine /> Filter</Button>
						{
							backButtonVisiblity ?
								<Button size='sm' variant='outline-primary' onClick={backClickHandler}><RiExternalLinkFill /></Button>
								: ''
						}
					</div>
				</Col>
			</Row>
			<div className='allTickets'>
				{
					filterMode ?
						<Row className='tools-list mb-2'>
							<div className='list'>
								<button className='assign' onClick={handleOnAssign}><RiUserAddLine /> Assign</button>
								<button className='merge' onClick={handleOnMerge}><RiGitMergeLine /> Merge</button>
								<button className='escalate' onClick={handleOnEscalate}><RiMenu3Fill /> Escalate</button>
								<button className='close' onClick={handleOnClose}><RiThumbUpFill /> Close</button>
								<button className='delete' onClick={handleOnDelete}><RiDeleteBin2Line /> Delete</button>
							</div>
						</Row>
						:
						''
				}
				{
					// layout == 'grid' ?
						<>
							<div className='cardHeader'>
								<p className='cols requesterCol'>REQUESTER</p>
								<p className='cols subjectCol'>SUBJECT</p>
								<p className='cols stateCol'>STATE</p>
								<p className='cols categoryCol'>CATEGORY</p>
								<p className='cols priorityCol'>PRIORITY</p>
								<p className='cols assignedToCol'>ASSIGNED TO</p>
								<p className='cols statusCol'>STATUS</p>
							</div>
							{
								AllTicketForFinanceDashboard && AllTicketForFinanceDashboard.employee_with_finance_ticket_response?.map(
									({ email, assigne_name, priority, subjectStatus,  emp_name, office_id, status , it_admin_ticket , profile_picture}) => {
										return <Card
											id={it_admin_ticket.uuid}
											name={emp_name}
											date={Moment(it_admin_ticket.created_at).format('DD-MM-YYYY')}
											empId={it_admin_ticket.emp_uuid}
											status={it_admin_ticket.ticket_status}
											ticketNo={it_admin_ticket.ticket_id}
											office_id={office_id}
											subject={it_admin_ticket.subcategory}
											subjectStatus={subjectStatus}
											priority={it_admin_ticket.priority}
											profile_picture={profile_picture}
											assignedTo={assigne_name}
											// filterMode={filterMode}
											setFilterMode={setFilterMode}
											setIds={setIds}
											email={email}
											description = {it_admin_ticket.subject}
											handleSelectedTicket={handleSelectedTicket}
										/>
									})
							}
						</> 
				}
			</div>
		</>
	)
}

export default Index