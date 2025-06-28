import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from "react-bootstrap"
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { useAddBankDetails } from '../../../query/bankDetails/addBankDetails/addBankDetailsQuery'
import { useGetBankDetails } from '../../../query/bankDetails/allBankDetails/allBankDetailsQuery'
import { useUpdateBankDetails } from '../../../query/bankDetails/updateBankDetails/updateBankDetailsQuery'
import { useGetAllMembers } from '../../../query/members/allMembers/allMembersQuery'
import { authState } from '../../../recoil/authRecoil'
import { ifscPattern, requiredField } from '../../../utilits/validation'
import { Input } from '../../widgets/formComponents/Input'
import './style.scss'


const Index = () => {
	const navigate = useNavigate();
	const empDetail = useRecoilValue(authState);
	const [memberId, setMemberId] = useState(empDetail && empDetail.uuid);
	const { data: allMembers, isLoading: isLoadingGetAllMember } = useGetAllMembers()
	const { data: selectedMember, isLoading: isLoadinggetBankDetails } = useGetBankDetails(memberId);
	const { mutateAsync: updateBankDetailsMutateAsync, isLoading: isLoadingUpdateBankDetails } = useUpdateBankDetails()
	const { isLoading: isLoadingAddBankDetails, mutateAsync: addBankDetailsMutateAsync } = useAddBankDetails()
	const { reset, register, handleSubmit, formState: { errors, isValid } } = useForm({
		mode: "onTouched"
	});
	const selectMemberId = (e) => {
		setMemberId(e.target.value)
	}

	useEffect(() => {
		reset(selectedMember)
	}, [selectedMember])

	const onSubmit = (data) => {
		if (selectedMember.employee_Uuid) {
			updateBankDetailsMutateAsync(data)
		}
		else {
			addBankDetailsMutateAsync(data)
		}

	}

	// if (isLoadinggetBankDetails) {
	// 	return <p>loader..</p>
	// }
	// if (isLoadingGetAllMember) {
	// 	return <p>loader..</p>
	// }

	return (
		<>
			<div className='editBankDetails container'>
				<div className='headerRow cardCustomTitle'>
					Edit Bank Details
				</div>
				<form className='formEditBankDetails' onSubmit={handleSubmit(onSubmit)}>
					<Row>
						<Col sm={12} md={6} className="mb-3">
							<label>Employee *</label>
							<select
								className="form-control dropdown-bar"
								name="emp_uuid"
								value={memberId}
								onChange={(e) => selectMemberId(e)}
								disabled={isLoadingGetAllMember}
								ref={register({
									required: requiredField(),
								})}
							>
								<option value="">select</option>
								{
									allMembers && allMembers.employees && allMembers.employees.map((item, index) => (
										<option value={item.uuid}>{item.first_name} {item.last_name} {item.office_id}</option>
									))
								}
							</select>
							{errors.employee_uuid && (<small className="form-text text-danger">{errors.employee_uuid.message}</small>)}
						</Col>
						<Col sm={12} md={6} className="mb-3">
							<label>Account Holder Name *</label>
							<Input
								type="text"
								className="form-control"
								name="bank_account_holder_name"
								reference={register({
									required: requiredField(),
									validate: {
										lessThan: v => v.length >= 100 ? "Name is too long." : true,
										check: v => /^[a-zA-Z ]{2,30}$/.test(v) ? true : "Invalid name",
									}
								})} />
							{errors.bank_account_holder_name && (<small className="form-text text-danger">{errors.bank_account_holder_name.message}</small>)}
						</Col>
						<Col sm={12} md={6} className="mb-3">
							<label>Bank Name *</label>
							<Input
								type="text"
								className="form-control"
								name="bank_name"
								//defaultValue={selectedMember?.bank_name}
								reference={register({
									required: requiredField(),
									validate: {
										lessThan: v => v.length >= 100 ? "Name is too long." : true,
										check: v => /^[a-zA-Z ]{2,30}$/.test(v) ? true : "Invalid name",
									}
								})} />
							{errors.bank_name && (<small className="form-text text-danger">{errors.bank_name.message}</small>)}
						</Col>
						<Col sm={12} md={6} className="mb-3">
							<label>Account Number *</label>
							<Input
								type="text"
								className="form-control"
								name="bank_account_number"
								//defaultValue={selectedMember?.bank_account_number}
								reference={register({
									required: requiredField(),
								})} />
							{errors.bank_account_number && (<small className="form-text text-danger">{errors.bank_account_number.message}</small>)}
						</Col>
						<Col sm={12} md={6} className="mb-3">
							<label>IFSC Code *</label>
							<Input
								type="text"
								className="form-control"
								name="ifsc_code"
								reference={register({
									required: requiredField(),
									pattern: ifscPattern(),
								})} />
							{errors.ifsc_code && (<small className="form-text text-danger">{errors.ifsc_code.message}</small>)}
						</Col>
						<Col sm={12} md={6} className="mb-3">
							<label>Account Type *</label>
							<select
								className="form-control dropdown-bar"
								name="account_type"
								ref={register({
									required: requiredField(),
								})}
							>
								<option value="Salaried">Salaried</option>
								<option value="Saving">Saving</option>
								<option value="Current">Current</option>
							</select>
							{errors.account_type && (<small className="form-text text-danger">{errors.account_type.message}</small>)}
						</Col>
						<Col sm={12} className='buttonSection'>
							<Button disabled={(!isValid) || (selectedMember?.employee_Uuid ? isLoadingUpdateBankDetails : isLoadingAddBankDetails)} variant='primary' size='sm' className='applyBtn' type='submit'>
								{
									selectedMember?.employee_Uuid
										?
										isLoadingUpdateBankDetails
											?
											'Updating...'
											:
											'Update'
										:
										isLoadingAddBankDetails
											?
											'Adding...'
											:
											'Add'
								}	
							</Button>
							<Button variant='danger' size='sm' className='closeBtn' onClick={() => navigate(-1)}>Cancel</Button>
						</Col>
					</Row>
				</form>
			</div >
		</>
	)
}

export default Index
