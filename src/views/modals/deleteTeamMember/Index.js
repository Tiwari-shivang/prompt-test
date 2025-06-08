import React from "react";
import {Button, Col, Modal, Row} from "react-bootstrap";
import {BsTrash} from "react-icons/bs";
import {
    useHardDeleteTeamMember,
    useSoftDeleteTeamMember,
} from "../../../query/projects/deleteProjects/deleteProjectsQuery";

const DeleteTeamMember = ({
    deleteModalOpen,
    deleteModalClose,
    deleteId,
    setTeamMemberUuid,
    refetchGetEmployeeHistory,
    refetchProjectInfoOfCurrentEmp,
    refetchMembers,
}) => {
    const {mutateAsync: softDeleteMutateAsync} = useSoftDeleteTeamMember(
        refetchProjectInfoOfCurrentEmp,
		refetchMembers
    );
    const {mutateAsync: hardDeleteMutateAsync} = useHardDeleteTeamMember(
        refetchProjectInfoOfCurrentEmp,
		refetchMembers
    );

    const TeamMemberHandler = (e, data) => {
        e.preventDefault();
        debugger;
        data === "soft" ? softDeleteMutateAsync(deleteId) : hardDeleteMutateAsync(deleteId);
        deleteModalClose();
        if (setTeamMemberUuid) {
            setTeamMemberUuid("");
        }
    };

    return (
        <>
            <Modal
                className="commonModal"
                show={deleteModalOpen}
                onHide={deleteModalClose}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Team member</Modal.Title>
                </Modal.Header>
                <Modal.Body className="container">
                    <Row className="my-3">
                        <Col sm={12}>
                            <p>Are you sure want to delete this Member ?</p>
                        </Col>
                    </Row>
                    <Row className="mt-4 mb-2">
                        <Col sm={12}>
                            <div className="buttonSection deleteButtons">
                                <Button
                                    variant="primary"
                                    onClick={(e) => TeamMemberHandler(e, "hard")}
                                >
                                    Permanent <BsTrash className="icon" />
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    onClick={(e) => TeamMemberHandler(e, "soft")}
                                >
                                    Soft <BsTrash className="icon" />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default DeleteTeamMember;
