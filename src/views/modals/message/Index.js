import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import { AiOutlineSearch } from 'react-icons/ai'
import avatar1 from '../../../assets/images/avatars/1.jpg'
import FullMessage from '../fullMessage/Index'
import './style.scss'


const Message = (props) => {
    const {messagePopupOpen, messagePopupClose, messageId} = props

    const [fullMessagePopupVisible, setFullMessagePopupVisible] = useState(false)

    const modalsCloseButton = () => {
        messagePopupClose()
        setFullMessagePopupVisible(false)
    }
  return (
    <>
    <Modal 
          className="messageModal" 
          show={messagePopupOpen} 
          onHide={modalsCloseButton}
          >
        <Modal.Header closeButton >
          <Modal.Title>
            <div className='searchBarMain'>
             <p>Message</p>
             <div className="searchBar">
                <input className="form-control form-control-sm me-sm-2" placeholder="Search" size="sm" />
                <button color="light" className="btn btn-light my-2 my-sm-0" type="submit">
                  <AiOutlineSearch />
                </button>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row className='gx-0'>
                <Col sm={12}>
                    <div className='messageSection customScroll'>
                        <div className='message' onClick={() => setFullMessagePopupVisible(true)}>
                            <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message' onClick={() => setFullMessagePopupVisible(false)}>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                        <div className='message'>
                         <div className='messageInfo'>
                                <div className='pic'>
                                <img src={avatar1} alt=""/>
                                </div>
                                <div className='detail'>
                                <p>Emma Emily</p>
                                <p>Creative Art Director</p>
                                </div>
                            </div>
                            <div className='lastSeen'>
                                <p>11:30</p>
                            </div>
                        </div>
                    </div>
                    <FullMessage 
                        fullMessagePopupOpen={fullMessagePopupVisible}
                        fullMessagePopupClose={() => setFullMessagePopupVisible(false)}
                        fullMessageId = {1}
                    />
                </Col>
            </Row>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Message
