import React, {useEffect, useState} from "react";
import "./style.scss";
import {Modal} from "react-bootstrap";
export const TextWithViewMore = ({text, title, showLength=100}) => {
   const [commentModalOpen, setCommentModalOpen] = useState(false);

    return (
        <>
            {text && text.length && text.length > showLength ? (
                <>
                    {text.substring(0, showLength)}
                    <span className="viewMoreText" onClick={() => setCommentModalOpen(true)}>
                        ...view more
                    </span>
                </>
            ) : (
                text || "N/A"
            )}
            <Modal
                className="commonModal commentModal"
                show={commentModalOpen}
                onHide={() => setCommentModalOpen(false)}
                centered
            >
                <Modal.Header>
                    <Modal.Title className="cardCustomTitle">{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="commentBody">{text}</Modal.Body>
            </Modal>
        </>
    );
};
