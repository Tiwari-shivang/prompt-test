import React from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import './style.scss'

const Index = () => {
	const loggedOut = () =>{
		localStorage.removeItem("response")
		window.location.reload();
	}
	return (
		<>
			<Modal
				className="commonModal"
				show={true}
				centered
			>
				<Modal.Header>
					<Modal.Title>Logged Out</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row className="mt-3">
						<Col sm={12}>
							<p>Some of the permission has been changed please re-login the application.</p>
						</Col>
					</Row>
					<Row className="mb-2">
						<Col sm={12}>
							<div className='buttonSection'>
								<Button variant="primary" onClick={loggedOut}>
									Ok
								</Button>
							</div>
						</Col>
					</Row>
				</Modal.Body>
			</Modal>
		</>
	)
}
export default Index
