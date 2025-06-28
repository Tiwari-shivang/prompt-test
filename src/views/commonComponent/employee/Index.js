import React, { Suspense } from 'react'
import PieChart from '../../widgets/charts/pieChart/DoughnutChart'
import { useGetEmployeeCount } from '../../../query/members/allMembers/allMembersQuery'
import './style.scss'

const Employee = () => {

	const { data, isLoading } = useGetEmployeeCount();
	if (data) {
		var employee = [
			{ name: "Male", value: data.male },
			{ name: "Female", value: data.female }
		]
	}
	return (
		<div className='totalEmployee cardShadow'>
			<div className='totalEmployeeSection'>
				<div className='title'>
					<p>Total Employees : <span>{data && data.total}</span> </p>
				</div>
				{/* <div className='total'>
                <p>{data && data.total}</p>
            </div> */}
			</div>
			{
				data && data.male != undefined ? <PieChart data={employee} /> : ""
			}
		</div>
	)
}

export default Employee
