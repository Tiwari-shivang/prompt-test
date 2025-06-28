import {Select} from "antd";
import Moment from "moment";
import React, {useState} from "react";
import {Button, Card, Col, Modal, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {useForm} from "react-hook-form";
import {BsTrash} from "react-icons/bs";
import {FaUserAlt} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import Breadcrumb from "../../../../components/Breadcrumb";
import {useAddTopPerformers} from "../../../../query/members/addMembers/addMembersQuery";
import {
    useGetAllMembers,
    useGetTopPerformer,
} from "../../../../query/members/allMembers/allMembersQuery";
import {useDeleteTopPerformer} from "../../../../query/members/deleteMembers/deleteMembersQuery";
import {authRoleState} from "../../../../recoil/authRecoil";
import RoleAccess from "../../../../utilits/RoleAccess";
import Loader from "../../../widgets/loader/Loader";
import "./style.scss";

const Index = () => {
    const navigate = useNavigate();
    const [deleteModel, setDeleteModel] = useState(false);
    const [addPerformerModel, setAddPerformerModel] = useState(false);
    const [ids, setIds] = useState("");
    const [popover, setPopover] = useState();
    const getRole = useRecoilValue(authRoleState);
    const authRoles = getRole && getRole?.Role;
    const {register, handleSubmit, errors, reset, setValue} = useForm();

    const {data: allMember, isLoading: istopPerformerList} = useGetTopPerformer();

    const handelAddTopPerformer = (e) => {
        setAddPerformerModel(true);
    };

    const openDeletePopup = (row, e) => {
        setIds(row.id);
        setDeleteModel(true);
    };

    const columns = [
        {
            dataField: "",
            text: "Photos",
            formatter: (cellContent, row) => (
                <div
                    className="headPic"
                    onClick={() => navigate(`/members/memberDetail/${row.emp.uuid}`)}
                >
                    {row && row.profile_picture ? (
                        <img src={row.profile_picture} alt="" />
                    ) : (
                        <FaUserAlt className="userIcon" />
                    )}
                </div>
            ),
        },
        {
            dataField: "office_id",
            text: "Employee Id",
        },
        {
            text: "Full Name",
            formatter: (cellContent, row) => (
                <div
                    className="fullName"
                    onClick={() => navigate(`/members/memberDetail/${row.emp.uuid}`)}
                >
                    <p>
                        {row.first_name} {row.last_name}
                    </p>
                </div>
            ),
        },
        {
            dataField: "email",
            text: "Email Address",
        },
        {
            dataField: "department_name",
            text: "Department",
        },
        {
            dataField: "",
            text: "Action",
            hidden: RoleAccess(authRoles, "accessToEdit-Admin-HR") ? false : true,
            formatter: (cellContent, row) => (
                <>
                    <div className="teamMembersPic">
                        <div className="actionCol">
                            <BsTrash
                                className="deleteIcon"
                                onClick={(e) => openDeletePopup(row, e)}
                            />
                        </div>
                    </div>
                </>
            ),
        },
    ];

    return (
        <div className="list">
            <Row className="mb-2">
                <Col xs={7}>
                    <Breadcrumb />
                </Col>
                <Col xs={5} className="btnCol">
                    {RoleAccess(authRoles, "accessToEdit-HR") ? (
                        <Button
                            className="filter"
                            size="sm"
                            onClick={(e) => handelAddTopPerformer(e)}
                        >
                            Add Top Performers
                        </Button>
                    ) : (
                        ""
                    )}
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Card>
                        <div className="card-body">
                            {istopPerformerList ? (
                                <div className="loadingScreen">
                                    <Loader />
                                </div>
                            ) : allMember && !allMember.length ? (
                                <div className="dataNotFound">
                                    <p>Data not found</p>
                                </div>
                            ) : (
                                <BootstrapTable
                                    keyField="id"
                                    data={allMember ? allMember : []}
                                    columns={columns}
                                    condensed
                                />
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <DeleteTopPerformerModal
                        deleteModalOpen={deleteModel}
                        deleteModalClose={() => setDeleteModel(false)}
                        deleteId={ids}
                    />
                    <AddTopPerformerModal
                        addModalOpen={addPerformerModel}
                        addModalClose={() => setAddPerformerModel(false)}
                    />
                </Col>
            </Row>
        </div>
    );
};

export const DeleteTopPerformerModal = (props) => {
    const {deleteModalOpen, deleteModalClose, deleteId} = props;
    const {mutateAsync} = useDeleteTopPerformer();

    const deleteTopPerformerHandler = (e) => {
        e.preventDefault();
        const details = {
            id: deleteId,
        };
        mutateAsync(details);
        deleteModalClose();
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
                    <Modal.Title>Delete Top Performer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="my-3">
                        <Col sm={12}>
                            <p>Are you sure want to delete this top performer</p>
                        </Col>
                    </Row>
                    <Row className="mt-4 mb-2">
                        <Col sm={12}>
                            <div className="buttonSection">
                                <Button
                                    variant="primary"
                                    onClick={(e) => deleteTopPerformerHandler(e)}
                                >
                                    Yes
                                </Button>
                                <Button variant="outline-danger" onClick={deleteModalClose}>
                                    Cancel
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
};

export const AddTopPerformerModal = (props) => {
    const {addModalOpen, addModalClose} = props;
    const [topPerformer, setTopPerformer] = useState([]);
    const {data: allMember, isLoading: allMemberLoading} = useGetAllMembers();
    const {mutateAsync} = useAddTopPerformers();
    const {data: allMemberTopPerformers, isLoading: istopPerformerList} = useGetTopPerformer();
    const handleSelectTopPerformer = (topPerformer) => {
        setTopPerformer(topPerformer);
    };

    const addTopPerformerHandler = (e) => {
        e.preventDefault();
        let todaydate = new Date();

        const addPerformerData =
            topPerformer &&
            topPerformer.map((item, i) => {
                return {
                    "employee_uuid": item,
                    "date": Moment(todaydate).format("YYYY-MM-DD"),
                };
            });
        mutateAsync(addPerformerData);
        setTopPerformer([]);
        addModalClose();
    };

    return (
        <>
            <Modal
                className="commonModal addTopPerformer"
                show={addModalOpen}
                onHide={addModalClose}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Top Performers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={addTopPerformerHandler}>
                        <Row className="my-3">
                            <Col sm={12}>
                                <label>Select Employee</label>
                                <Select
                                    mode="multiple"
                                    style={{width: "100%"}}
                                    placeholder="Select Employee"
                                    className="form-control"
                                    name="empId"
                                    onChange={handleSelectTopPerformer}
                                >
                                    <option value="" disabled>
                                        Select Employee
                                    </option>
                                    {allMember?.employees?.map((item, i) => {
                                        let flag = true;
                                        allMemberTopPerformers.forEach((element) => {
                                            if (element.office_id == item.office_id) {
                                                flag = false;
                                                return;
                                            }
                                        });
                                        return flag ? (
                                            <option key={item.uuid} value={item.uuid}>
                                                {item.first_name} {item.last_name}
                                            </option>
                                        ) : (
                                            ""
                                        );
                                    })}
                                </Select>
                            </Col>
                            <Col sm={12} className="buttonSection mt-4">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={topPerformer.length <= 0 ? true : false}
                                >
                                    Add
                                </Button>
                                <Button variant="outline-danger" onClick={addModalClose}>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Index;
