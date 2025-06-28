import React, {useEffect, useState} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {Row, Col, Card, Button, Modal} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {BsTrash} from "react-icons/bs";
import {BiEdit} from "react-icons/bi";
import {authRoleState, authState} from "../../../recoil/authRecoil";
import {useRecoilValue} from "recoil";
import {FaUserAlt} from "react-icons/fa";
import Breadcrumb from "../../../components/Breadcrumb";
import {useGetAllMembers} from "../../../query/members/allMembers/allMembersQuery";
import "./style.scss";
import {useAddBuHeads} from "../../../query/buHead/addBuHead/addBuHeadQuery";
import {useGetAllBusinessUnitById} from "../../../query/buHead/allBuHead/allBuHeadQuery";
import {useDeleteBuHeads} from "../../../query/buHead/deleteBuHead/deleteBuHeadQuery";
import {useUpdateBuHeadById} from "../../../query/buHead/updateBuHead/updateBuHeadQuery";
import {Input} from "../../widgets/formComponents/Input";
import {requiredField} from "../../../utilits/validation";

const BusinessUnit = () => {
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [buUuid, setBuUuid] = useState("");
    const [buHeadUuid, setBuHeadUuid] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [addBuModalOpen, setAddBuModalOpen] = useState(false);
    const getRole = useRecoilValue(authRoleState);
    const authRoles = getRole && getRole?.Role;
    const empDetail = useRecoilValue(authState);
    const accessList = empDetail && empDetail.module_names;
    const {data: allBuHeads, isLoading} = useGetAllBusinessUnitById();

    const openPopup = (row, e) => {
        setBuUuid(row.uuid);
        setBuHeadUuid(row.business_unit_head_uuid);
        setUpdateModalOpen(true);
    };

    const openDeletePopup = (row, e) => {
        setBuUuid(row.uuid);
        setDeleteModalOpen(true);
    };

    const handleAddBusinessUnit = () => {
        setAddBuModalOpen(true);
    };

    const columns = [
        {
            dataField: "business_unit_name",
            text: "BU head name",
            formatter: (cellContent, row) => (
                <div className="buHead">
                    <div className="headPic">
                        {row && row.profile_picture ? (
                            <img src={row.profile_picture} alt="" />
                        ) : (
                            <FaUserAlt className="userIcon" />
                        )}
                    </div>
                    {cellContent}
                </div>
            ),
        },
        {
            dataField: "business_unit_head_name",
            text: "Head Name",
        },
        {
            dataField: "",
            text: "Action",
            hidden: !(accessList && accessList.includes("Add Business Unit")),
            headerStyle: (colum, colIndex) => {
                return {width: "75px"};
            },
            formatter: (cellContent, row) => (
                <div className="ActionIcon">
                    <a className="editIcon" onClick={(e) => openPopup(row, e)}>
                        <BiEdit className="icon" />
                    </a>
                    <a className="deleteIcon" onClick={(e) => openDeletePopup(row, e)}>
                        <BsTrash className="icon" />
                    </a>
                </div>
            ),
        },
    ];

    return (
        <div className="businessUnit">
            <Row>
                <Col xs={6}>
                    <Breadcrumb />
                </Col>
                <Col xs={6} className="ButtonGroup">
                    {accessList && accessList.includes("Add Business Unit") ? (
                        <Button className="addButton" variant="primary" onClick={handleAddBusinessUnit}>
                            Add Business Unit
                        </Button>
                    ) : <></>
                    }
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Card>
                        <div className="card-body">
                            <BootstrapTable
                                keyField="employee_id"
                                data={allBuHeads ? allBuHeads : []}
                                columns={columns}
                                condensed
                            />
                            <UpdateBuHeadModal
                                updateModalOpen={updateModalOpen}
                                updateModalClose={() => setUpdateModalOpen(false)}
                                updateId={buUuid}
                                buHeadId={buHeadUuid}
                            />
                            <DeleteBuHeadModal
                                deleteModalOpen={deleteModalOpen}
                                deleteModalClose={() => setDeleteModalOpen(false)}
                                deleteId={buUuid}
                            />
                            <AddBusinessUnitModal
                                addBuModalOpen={addBuModalOpen}
                                addBuModalClose={() => setAddBuModalOpen(false)}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export const DeleteBuHeadModal = (props) => {
    const {deleteModalOpen, deleteModalClose, deleteId} = props;
    const {mutateAsync} = useDeleteBuHeads();

    const deleteBuHeadHandler = (e) => {
        e.preventDefault();
        mutateAsync(deleteId);
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
                    <Modal.Title>Delete Business Unit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="my-3">
                        <Col sm={12}>
                            <p>Are you sure want to delete this Business Unit?</p>
                        </Col>
                    </Row>
                    <Row className="mt-4 mb-2">
                        <Col sm={12}>
                            <div className="buttonSection">
                                <Button variant="primary" onClick={(e) => deleteBuHeadHandler(e)}>
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

export const UpdateBuHeadModal = (props) => {
    const {updateModalOpen, updateModalClose, updateId, buHeadId} = props;
    const {data: allMember, isLoading: allMemberLoading} = useGetAllMembers();
    const [empId, setEmpId] = useState("");
    const {register, handleSubmit, getValues, reset, errors} = useForm({
        mode: "onTouched",
    });

    const {mutateAsync} = useUpdateBuHeadById();
    const updateBuHeadHandler = (data) => {
        const details = {
            buHeadId: data?.buHeadId,
            id: updateId,
        };
        mutateAsync(details);
        updateModalClose();
    };
    return (
        <>
            <Modal
                className="commonModal"
                show={updateModalOpen}
                onHide={updateModalClose}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update Business Unit Head</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(updateBuHeadHandler)}>
                        <Row className="my-3">
                            <Col sm={12}>
                                <label>Select BU Head*</label>
                                <select
                                    className="form-control"
                                    name="buHeadId"
                                    defaultValue={buHeadId}
                                    ref={register({})}
                                >
                                    <option value="">Select Employee</option>
                                    {allMember &&
                                        allMember.employees?.map((item, i) => (
                                            <option key={item.uuid} value={item.uuid}>
                                                {item.first_name} {item.last_name}
                                            </option>
                                        ))}
                                </select>
                            </Col>
                        </Row>
                        <Row className="mt-4 mb-2">
                            <Col sm={12}>
                                <div className="buttonSection">
                                    <Button variant="primary" type="submit">
                                        Update
                                    </Button>
                                    <Button variant="outline-danger" onClick={updateModalClose}>
                                        Cancel
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export const AddBusinessUnitModal = (props) => {
    const {addBuModalOpen, addBuModalClose} = props;
    const {data: allMember, isLoading: allMemberLoading} = useGetAllMembers();
    const {mutateAsync} = useAddBuHeads();
    const {register, handleSubmit, getValues, reset, errors, formState} = useForm({
        mode: "onTouched",
    });

    const addBUHandler = (data) => {
        debugger;
        const newArray = [];
        newArray.push(data);
        mutateAsync(newArray);
        reset("");
        addBuModalClose();
    };

    return (
        <>
            <Modal className="commonModal" show={addBuModalOpen} onHide={addBuModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Business Unit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(addBUHandler)}>
                        <Row>
                            <Col sm={12} className="mb-3">
                                <label>Business Unit Name</label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name="business_unit_name"
                                    reference={register({
                                        required: requiredField(),
                                        // validate: {
                                        // 	// lessThan: v=>v.trim().length<100?
                                        // }
                                    })}
                                />
                            </Col>
                            <Col sm={12} className="mb-3">
                                <label>Select BU Head *</label>
                                <select
                                    className="form-control"
                                    name="business_unit_head_uuid"
                                    //onChange={handleSelectEmployee}
                                    ref={register({
                                        required: requiredField(),
                                    })}
                                >
                                    <option value={-100}>Select Employee</option>
                                    {allMember &&
                                        allMember.employees?.map((item, i) => (
                                            <option key={item.uuid} value={item.uuid}>
                                                {" "}
                                                {item.first_name} {item.last_name}
                                            </option>
                                        ))}
                                </select>
                            </Col>
                            <Col sm={12} className="mb-3">
                                <label>Is Billable *</label>
                                <select
                                    className="form-control"
                                    name="is_billable"
                                    ref={register({
                                        required: requiredField(),
                                        setValueAs: (v) => Boolean(v),
                                    })}
                                >
                                    <option value="">Select</option>
                                    <option value={true}>Yes</option>
                                    <option value="">No</option>
                                </select>
                            </Col>
                            <Col sm={12} className="buttonSection mt-4">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={!formState.isValid}
                                >
                                    Add
                                </Button>
                                <Button variant="outline-danger" onClick={addBuModalClose}>
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

export default BusinessUnit;
