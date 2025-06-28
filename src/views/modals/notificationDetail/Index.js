import React from 'react'
import { Modal } from 'react-bootstrap'
import { FaEnvelopeOpen } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import './style.scss'

const NotificationDetail = (props) => {
	const { open, close, id, closeMain } = props
	const navigate = useNavigate();
	const clickHandler = () => {
		navigate('/regularizationApproval');
		close();
		closeMain();
	}
	return (
		<>
			<Modal
				className="noficationDetailModal"
				show={open}
				onHide={close}
			>
				<Modal.Header closeButton >
					<Modal.Title>Abu Qumar</Modal.Title>
				</Modal.Header>
				<Modal.Body closeButton>
					{/* <Row >
            <Col sm={8}>
                <p className="HeadingName">Quick Survey for Annual Trip - 2022</p>
            </Col>
            <Col sm={4} className='text-end'>
                <p>08 jul 2022</p>
            </Col>
        </Row>
        <Row>
            <Col sm={12}>
              <p>Hi Abu Qumar (E0342)</p>
            </Col>
            <Col>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
              <p>Lorem Ipsum is simply dummy text of the printing <a href="#">trip@hexaviewTech.com</a></p>
            </Col>
        </Row> */}
					<div className='regularizationCard'>
						<FaEnvelopeOpen className='icon' />
						<div className='content'>
							<div className='about'>New Attendance Regularization Card</div>
							<div className='from'>From: sachin.uidev@gmail.com</div>
							<div className='hiMsg'>Hi Saurav Bhardwaj,</div>
							<div className='desc'>Sachin's request is waiting for youe approval. Click <b onClick={clickHandler} style={{cursor: 'pointer',}}><u>here</u></b> for approve/reject</div>
						</div>
					</div>
					<button type='button' className='btn btn-primary btn-sm viewDetailsBtn' onClick={clickHandler}>View details</button>
				</Modal.Body>
			</Modal>
		</>
	)
}

export default NotificationDetail
