import React, { useState } from "react"
import { Col, Modal, Row } from "react-bootstrap"
import avatar1 from "../../../assets/images/avatars/1.jpg"
import NotificationDetail from "../notificationDetail/Index"
import "./style.scss"
import { useGetNotifications } from "../../../query/notification/notificationQuery"
import { useRecoilValue } from "recoil"
import { authState } from "../../../recoil/authRecoil"
import Loader from "../../widgets/loader/Loader"
import { FaUserAlt } from "react-icons/fa"
const Notification = (props) => {
    const { notificationPopupOpen, notificationPopupClose, notificationId } = props

    const [notificationDetailVisible, setNotificationDetailVisible] = useState(false)
    const empDetail = useRecoilValue(authState)
    const { data: notifications, isLoading: isLoadingNotifications } = useGetNotifications(empDetail?.user_name)
    const modalsCloseButton = () => {
        notificationPopupClose()
        setNotificationDetailVisible(false)
    }
    return (
        <>
            <Modal
                className="notificationModal"
                show={notificationPopupOpen}
                onHide={modalsCloseButton}
                //   animation={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>NOTIFICATION</Modal.Title>
                </Modal.Header>
                <Modal.Body className="customScroll">
                    <Row className="gx-0">
                        <Col sm={12} className="">
                            {isLoadingNotifications ? (
                                <div className="loadingScreen">
                                        <Loader />
                                </div>
                            ) : notifications && notifications?.get_notification_response?.length == 0 ? (
                                <div className="emptyListText mt-3">No notifications yet.</div>
                            ) : (
                                notifications &&
                                notifications?.get_notification_response?.map((values , index) => (
                                    <div key={index} className="notificationSection ">
                                        {
                                            <div className="notification" onClick={() => setNotificationDetailVisible(true)}>
                                                <div className="pic">
													<FaUserAlt className="userIcon" />
                                                </div>
                                                <div className="detail">
                                                    <p>{values.message}</p>
                                                    <p>{values.date} {values.time}</p>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                ))
                            )}
                            {/* <NotificationDetail open={notificationDetailVisible} close={() => setNotificationDetailVisible(false)} id={1} closeMain={modalsCloseButton} /> */}
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Notification
