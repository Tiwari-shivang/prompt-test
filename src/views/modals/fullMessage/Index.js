import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { BiSend } from 'react-icons/bi'
import './style.scss'


const FullMessage = (props) => {
    const {fullMessagePopupOpen, fullMessagePopupClose, fullMessageId} = props

  return (
    <>
    <Modal 
          className="fullMessageModal" 
          show={fullMessagePopupOpen} 
          onHide={fullMessagePopupClose}
          >
        <Modal.Header closeButton >
          <Modal.Title>Abhishek</Modal.Title>
        </Modal.Header>
        <Modal.Body closeButton>
        <Row>
            <Col>
                <div className='messageinner'>
                    <div className="message">
                        <div className="messageTop">
                            <img
                            className="messageImg"
                            src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                            alt=""
                            />
                            <div className="messageBottom">1 hour ago</div>
                        </div>
                        <p className="messageText">Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
                    </div>
                    <div className="message own">
                        <div className="messageTop">
                            <img
                            className="messageImg"
                            src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                            alt=""
                            />
                            <div className="messageBottom">1 hour ago</div>
                        </div>
                        <p className="messageText">Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.</p>
                    </div>

                    <div className='textArea'>
                      <textarea className="form-control form-control-sm me-sm-2" placeholder="Start typing here" ></textarea>
                      <button color="light" className="btn btn-light my-2 my-sm-0" type="submit">
                        Send
                        <BiSend />
                      </button>
                    </div>
                </div>
            </Col>
        </Row>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default FullMessage
