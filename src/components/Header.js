import React, { useLayoutEffect, useState } from 'react';
import { Button, Col, Dropdown, Modal, Row } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useForm } from 'react-hook-form';
import { AiOutlineMenu, AiOutlineQrcode, AiOutlineSearch } from "react-icons/ai";
import { BsBell, BsEnvelopeOpen, BsPerson } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { NavLink, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from "recoil";
import logo from '../assets/brand/logoWhite.svg';
import { useDeactivateMfa } from '../query/twoFactorAuth/addTwoFactorAuth/addTwoFactorAuthQuery';
import { useGetAuthRecoveryCodes } from '../query/twoFactorAuth/getTwoFactorAuth/getTwoFactorAuthQuery';
import { authRoleState, authState } from "../recoil/authRecoil";
import { universalSearchState } from '../recoil/universalSearch';
import Message from '../views/modals/message/Index';
import Notification from '../views/modals/notification/Index';
import { HeaderDropdown } from './header/index';
import { useGetNotifications } from '../query/notification/notificationQuery';

const Header = (props) => {

	const navigate = useNavigate()
    const empDetail = useRecoilValue(authState);

	const [size, setSize] = useState(0);
	const [count, setCount] = useState([]);
	const [notificationPopupVisible, setNotificationPopupVisible] = useState(false)
	const [messagePopupVisible, setMessagePopupVisible] = useState(false)
    const { data: notifications, isLoading: isLoadingNotifications, refetch: refetchNotifications } = useGetNotifications(empDetail?.user_name)
	
	const { data , isLoadingFaqs, refetch } = useGetAuthRecoveryCodes();
	const [deactivateMFAModal, setDeactivateMFAModal] = useState(false)
	const authDetail = useRecoilValue(authState)
	const getRole = useRecoilValue(authRoleState);
	const authRoles = getRole && getRole?.Role;

	const handleClickBell =()=>{
		setNotificationPopupVisible(true)
		refetchNotifications();
	}
	const { register, handleSubmit, errors, reset, setValue } = useForm();

	useLayoutEffect(() => {
		function updateSize() {
			setSize([window.innerWidth]);
		}
		window.addEventListener('resize', updateSize);
		updateSize();
		return () => window.removeEventListener('resize', updateSize);
	}, []);

	const handleSideBarControlButton = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (size < 768) {
			document.querySelector('.sidebar-fixed').classList.toggle('show')
		} else {
			document.querySelector('.sidebar-fixed').classList.toggle('hide')
		}
	}

	const setAuthDetailState = useSetRecoilState(authState)
	const setAuthRoleState = useSetRecoilState(authRoleState)
	const setuniversalSearchState = useSetRecoilState(universalSearchState)
	
	const handleLogout = (e) => {
		localStorage.removeItem("response")
		setAuthDetailState(null)
		setAuthRoleState({})
		navigate('/')
	}

	const handleOnuniversalSearch = (data) => {
		setuniversalSearchState("")
		if (data.searchV) {
			setuniversalSearchState(data)
		}
		navigate('/members/memberList')
	}

	return (
		<div className="header header-sticky">
			<div fluid="true" className="container-fluid headerMenu">
				<div className='d-flex align-items-center'>
					<button
						className="header-toggler"
						onClick={handleSideBarControlButton}
					>
						<AiOutlineMenu />
					</button>
					<ul className="header-nav d-none d-md-flex mr-auto" hidden={authRoles=="User"}>
						<div className="navbar-nav ms-auto">
							<form className="d-flex" onSubmit={handleSubmit(handleOnuniversalSearch)}>
								<input className="form-control form-control-sm me-sm-2" placeholder="Search" name="searchV" ref={register({})} />
								<button color="light" className="btn btn-light my-2 my-sm-0" type="submit">
									<AiOutlineSearch />
								</button>
							</form>
						</div>
					</ul>
				</div>
				<a className="header-brand mx-auto d-md-none" to="/">
					<img src={logo} />
				</a>
				<ul className="header-nav ms-3">
					{/* <HeaderDropdown /> */}


					{/* <div className='nav-item'>
						<OverlayTrigger
							placement="bottom"
							delay={{ show: 1000, hide: 250 }}
							overlay={
								<Tooltip id="button-tooltip">QR Code</Tooltip>
							}
						>
							<div className='nav-link qrCodeDropdown'>
							
								<Dropdown>
									<Dropdown.Toggle className='manageQRCode' variant="success" id="dropdown-basic">
										<AiOutlineQrcode />
									</Dropdown.Toggle>
									
									<Dropdown.Menu>
									{  authDetail && authDetail.mfa_enabled ?
										<>
											<Dropdown.Item onClick={()=>{setDeactivateMFAModal(true)}}>
												<BsPerson className="mr-2" />Deactivate MFA
											</Dropdown.Item>
											<Dropdown.Item onClick={()=>refetch()}>
												<BsPerson className="mr-2" />Recovery Code
											</Dropdown.Item> 
										</>
										:
										<Dropdown.Item>
											<NavLink to="/login/qrCode"><BsPerson className="mr-2" />QR Code</NavLink>
										</Dropdown.Item>

										
									}
									</Dropdown.Menu>
								</Dropdown>
								

							</div>
						</OverlayTrigger>
					</div>
				 */}




					{/* <div className='nav-item'>
						<OverlayTrigger
							placement="bottom"
							delay={{ show: 1000, hide: 250 }}
							overlay={
								<Tooltip id="button-tooltip">Message</Tooltip>
							}
						>
							<div className='nav-link'>
								<BsEnvelopeOpen onClick={() => setMessagePopupVisible(true)} className='icon' />
							</div>
						</OverlayTrigger>
					</div>*/}
					<div className='nav-item'>
						<OverlayTrigger
							placement="bottom"
							delay={{ show: 1000, hide: 250 }}
							overlay={
								<Tooltip id="button-tooltip">Notification</Tooltip>
							}
						>
							<div className='nav-link'>
								<BsBell onClick={handleClickBell} className='icon' />
							</div>
						</OverlayTrigger>
					</div> 
					<div className='nav-item'>
						<OverlayTrigger
							placement="bottom"
							delay={{ show: 1000, hide: 250 }}
							overlay={
								<Tooltip id="button-tooltip">Logout</Tooltip>
							}
						>
							{/* <a href='https://login.microsoftonline.com/7a361876-dca9-4a0b-876e-d9cb9ff3631a/saml2' > */}
							<div className='nav-link' onClick={handleLogout}>
								<FiLogOut className='icon' />
							</div>
							{/* </a> */}
						</OverlayTrigger>
					</div>
				</ul>
			</div>
			{/* <CHeaderDivider /> */}
			{/* <div fluid className="container-fluid headerBreadcrumb">
        <Breadcrumb />
      </div> */}
			<Notification
				notificationPopupOpen={notificationPopupVisible}
				notificationPopupClose={() => setNotificationPopupVisible(false)}
				notificationId={1}
			/>
			<Message
				messagePopupOpen={messagePopupVisible}
				messagePopupClose={() => setMessagePopupVisible(false)}
				messageId={1}
			/>
			<DeactivateMFAModal
			deactivateMFAModalOpen={deactivateMFAModal}
			deactivateMFAModalClose={()=>setDeactivateMFAModal(false)}
			/>
		</div>
	)
}



export const DeactivateMFAModal = (props) => {
	const { deactivateMFAModalOpen, deactivateMFAModalClose } = props
	const { mutateAsync } = useDeactivateMfa()
	return (
		<>
			<Modal
				className="commonModal"
				show={deactivateMFAModalOpen}
				onHide={deactivateMFAModalClose}
				centered
			>
				<Modal.Header closeButton >
					<Modal.Title>Deactivate MFA</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row className="mt-3">
						<Col sm={12}>
							<p>Are you sure want to deactivate MFA ?</p>
						</Col>
					</Row>
					<Row className="mb-2">
						<Col sm={12}>
							<div className='buttonSection'>
								<Button variant="primary" onClick={()=>{mutateAsync(); deactivateMFAModalClose()}}>
									Yes
								</Button>
								<Button variant="outline-danger" onClick={deactivateMFAModalClose}>
									Cancel
								</Button>
							</div>
						</Col>
					</Row>
				</Modal.Body>
			</Modal>
		</>
	)
}


export default Header
