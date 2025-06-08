import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { BsPerson } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from "recoil";
import FemaleEmployee from '../../assets/icons/female-employee.png';
import MaleEmployee from '../../assets/icons/male-employee.png';
import { authState } from "../../recoil/authRecoil";

const HeaderDropdown = () => {

	const [deactivateMFAModal, setDeactivateMFAModal] = useState(false)
	const authDetail = useRecoilValue(authState)

	return (
		<li className='nav-item dropdown'>
			<div className='profileSection'>
				<Dropdown>
					<Dropdown.Toggle className='userProfile' variant="success" id="dropdown-basic">
						{
							authDetail && authDetail.profile_picture ? <img src={authDetail.profile_picture} alt="" /> : authDetail && authDetail.gender === "Female" ? <img src={FemaleEmployee} alt="" /> : <img src={MaleEmployee} alt="" />
						}
					</Dropdown.Toggle>

					<Dropdown.Menu>
						<Dropdown.Item>
							<NavLink to="/profile"><BsPerson className="mr-2" />Profile</NavLink>
						</Dropdown.Item>						
					</Dropdown.Menu>
				</Dropdown>
			</div>

		</li>
	)
}




export default HeaderDropdown
