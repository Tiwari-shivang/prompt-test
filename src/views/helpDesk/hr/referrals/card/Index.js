import React, { useEffect } from 'react'
import './style.scss'
import avatar1 from '../../../../../assets/images/avatars/1.jpg'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ITDeclaration from '../../../../../assets/images/emp/IT-Declaration.svg'
import { Row, Col } from 'react-bootstrap'
import { useUpdateReferral } from '../../../../../query/referral/addReferral/addReferralQuery'
const Index = ({ emp_id, referral_by, name, resume, date , status ,email }) => {
	const navigate = useNavigate()
	const { mutateAsync: updateReferralMutateAsync } = useUpdateReferral();
	const changeStatus=(e)=>{
        const data={
            "emp_uuid": emp_id,
            "referral_status": e.target.value
		}
		updateReferralMutateAsync(data)
	}

	return (
		<>
			<Row className='card'>
				<Col sm={4} className="cols ">
					{referral_by}
				</Col>
				<Col sm={2} className='cols '>
					{name}
				</Col>
				<Col sm={1} className='cols'>
					<a  download={resume} href={resume} >
						<div className='pic pink'>
							<img src={ITDeclaration} alt="" />
						</div>
					</a>
				</Col>
				<Col sm={3} className='cols' >
					{email}
				</Col>
				<Col className='cols'>
					<select className='form-control' onChange={changeStatus} defaultValue={status}>
					    <option value="">select</option>
						<option value="Approved">Approved</option>
						<option value="Pending">Pending</option>
						<option value="Rejected">Rejected</option>
					</select>
				</Col>
			</Row>
		</>
	)
}

export default Index
