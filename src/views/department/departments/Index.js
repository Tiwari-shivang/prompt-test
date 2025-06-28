import React, {useEffect, useState} from "react";
import {Button, Card, Col, Modal, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {useForm} from "react-hook-form";
import {BiEdit} from "react-icons/bi";
import {BsTrash} from "react-icons/bs";
import {FaUserAlt} from "react-icons/fa";
import {useRecoilValue} from "recoil";
import Breadcrumb from "../../../components/Breadcrumb";
import {useGetAllBusinessUnitById} from "../../../query/buHead/allBuHead/allBuHeadQuery";
import {useAddDepartments} from "../../../query/department/addDepartments/addDepartmentsQuery";
import {useGetAllDepartments} from "../../../query/department/allDepartments/allDepartmentsQuery";
import {useDeleteDepartment} from "../../../query/department/deleteDepartments/deleteDepartmentsQuery";
import {useGetAllMembers} from "../../../query/members/allMembers/allMembersQuery";
import {useUpdateDepartment} from "../../../query/members/updateMembers/updateMembersQuery";
import {authRoleState, authState} from "../../../recoil/authRecoil";
import {requiredField} from "../../../utilits/validation";
// import {Input} from "../../widgets/formComponents/Input";
import "./style.scss";
import {Input} from "../../widgets/formComponents/Input";

const Departments = () => {
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false);
    const [ids, setIds] = useState("");
    const getRole = useRecoilValue(authRoleState);
    const empDetail = useRecoilValue(authState);
    const accessList = empDetail && empDetail.module_names;
    const authRoles = getRole && getRole?.Role;
    const [currentDepartmentData, setCurrentDepartmentData] = useState({});
    const {data: allDepartments, isLoading} = useGetAllDepartments();

    const openPopup = (row, e) => {
        setCurrentDepartmentData(row);
        setIds(row.department_uuid);
        setUpdateModalOpen(true);
    };

    const openDeletePopup = (row, e) => {
        setIds(row.department_uuid);
        setDeleteModalOpen(true);
    };

    const handleAddDepartment = () => {
        setAddDepartmentModalOpen(true);
    };

    const columns = [
        {
            dataField: "department_director_name",
            text: "Department Head",
            formatter: (cellContent, row) => (
                <div className="departmentHead">
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
            dataField: "department_name",
            text: "Department Name",
        },
        {
            dataField: "business_unit_name",
            text: "Business Unit Name",
        },
        {
            dataField: "",
            text: "Action",
            hidden: accessList && accessList.includes("Add Department") ? false : true,
            formatter: (cellContent, row) => (
                <div className="ActionIcon">
                    <a className="editIcon" onClick={(e) => openPopup(row, e)}>
                        <BiEdit className="icon" />
                    </a>
                    <a className="deleteIcon" onClick={() => openDeletePopup(row)}>
                        <BsTrash className="icon" />
                    </a>
                </div>
            ),
        },
    ];

    // if (isLoading) {
    //   return <Loader></Loader>
    // }

    return (
        <div className="department">
            <Row>
                <Col xs={6}>
                    <Breadcrumb />
                </Col>
                <Col xs={6} className="ButtonGroup">
                     {
						accessList && accessList.includes("Add Department") ? 
                    <Button className="addButton" variant="primary" onClick={handleAddDepartment}>
                        Add Department
                    </Button>
                     : ""
					}
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Card>
                        <div className="card-body">
                            <BootstrapTable
                                keyField="employee_id"
                                data={allDepartments ? allDepartments : []}
                                columns={columns}
                                condensed
                            />
                            <UpdateDepartmentModal
                                updateModalOpen={updateModalOpen}
                                updateModalClose={() => setUpdateModalOpen(false)}
                                currentDepartmentData={currentDepartmentData}
                            />
                            <DeleteDepartmentModal
                                deleteModalOpen={deleteModalOpen}
                                deleteModalClose={() => setDeleteModalOpen(false)}
                                deleteId={ids}
                            />
                            <AddDepartmentModal
                                addDepartModalOpen={addDepartmentModalOpen}
                                addDepartModalClose={() => setAddDepartmentModalOpen(false)}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export const DeleteDepartmentModal = (props) => {
    const {deleteModalOpen, deleteModalClose, deleteId} = props;
    const {mutateAsync} = useDeleteDepartment();

    const deleteDepartmentHandler = (e) => {
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
                    <Modal.Title>Delete Department</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="my-3">
                        <Col sm={12}>
                            <p>Are you sure want to delete this department</p>
                        </Col>
                    </Row>
                    <Row className="mt-4 mb-2">
                        <Col sm={12}>
                            <div className="buttonSection">
                                <Button
                                    variant="primary"
                                    onClick={(e) => deleteDepartmentHandler(e)}
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

export const UpdateDepartmentModal = (props) => {
    const {updateModalOpen, updateModalClose, currentDepartmentData} = props;
    const {register, handleSubmit, getValues, reset, errors, formState} = useForm({
        mode: "onTouched",
    });
    const empDetail = useRecoilValue(authState);

    const {data: allMember, isLoading: allMemberLoading} = useGetAllMembers();
    const {data: allBuHeads, isLoading} = useGetAllBusinessUnitById();
    const {mutateAsync} = useUpdateDepartment();
    const updateDepartmentHandler = (data) => {
        const details = {
            "uuid": currentDepartmentData?.department_uuid,
            "department_name": data?.departmentName,
            "business_uuid": data?.businessUuid,
            "department_director_uuid": data?.departmentDirectorUuid,
            // "updated_by": empDetail?.uuid,
            // "version": 1,
        };
        mutateAsync(details);
        updateModalClose();
    };
    useEffect(() => {
        reset({
            departmentName: currentDepartmentData?.department_name,
            departmentDirectorUuid: currentDepartmentData?.department_director_uuid,
            businessUuid: currentDepartmentData?.business_uuid,
        });
    }, [currentDepartmentData]);
    return (
        <>
            <Modal
                className="commonModal"
                show={updateModalOpen}
                onHide={updateModalClose}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update Department</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(updateDepartmentHandler)}>
                        <Row className="my-3">
                            <Col sm={12} className="mb-3">
                                <label>Department Name</label>
                                <Input
                                    type="text"
                                    id="text-edit"
                                    placeholder="Name"
                                    className="form-control"
                                    name="departmentName"
                                    reference={register({
                                        required: requiredField(),
                                    })}
                                />
                                {errors.department_name && (
                                    <small className="form-text text-danger">
                                        {errors.departmentName.message}
                                    </small>
                                )}
                            </Col>
                            <Col sm={12} className="mb-3">
                                <label>Select Department Head</label>
                                <select
                                    className="form-control"
                                    name="departmentDirectorUuid"
                                    // defaultValue={currentDepartmentData?.department_director_uuid}
                                    ref={register({})}
                                >
                                    <option value="">Select Employee</option>
                                    {allMember?.employees?.map((item, i) => (
                                        <option key={item.uuid} value={item.uuid}>
                                            {item.first_name} {item.last_name}
                                        </option>
                                    ))}
                                </select>
                            </Col>
                            <Col sm={12}>
                                <label>Select Business Unit</label>
                                <select
                                    className="form-control"
                                    // defaultValue={currentDepartmentData?.business_uuid}
                                    name="businessUuid"
                                    ref={register({})}
                                >
                                    <option value="">Select Business Unit</option>
                                    {allBuHeads?.map((item, i) => (
                                        <option key={item.uuid} value={item.uuid}>
                                            {item.business_unit_name}
                                        </option>
                                    ))}
                                </select>
                            </Col>
                        </Row>
                        <Row className="mt-4 mb-2">
                            <Col sm={12}>
                                <div className="buttonSection">
                                    <Button
                                        disabled={!formState.isValid}
                                        variant="primary"
                                        type="submit"
                                    >
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

export const AddDepartmentModal = (props) => {
    const {addDepartModalOpen, addDepartModalClose} = props;
    const [departmentId, setDepartmentId] = useState();
    const [employeeId, setemployeeId] = useState();
    const {data: allMember, isLoading: allMemberLoading} = useGetAllMembers();
    const {mutateAsync} = useAddDepartments();
    const {register, handleSubmit, getValues, reset, errors, formState} = useForm({
        mode: "onTouched",
    });
    const {data: allBuHeads} = useGetAllBusinessUnitById("");
    const handleSelectDepartment = (e) => {
        setDepartmentId(e.target.value);
        setemployeeId("");
    };

    const handleSelectEmployee = (e) => {
        setemployeeId(e.target.value);
    };

    const addDepartmentHandler = (data) => {
		addDepartModalClose();
        mutateAsync(data);
        reset("");
    };

    return (
        <>
            <Modal
                className="commonModal"
                show={addDepartModalOpen}
                onHide={addDepartModalClose}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add Department</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(addDepartmentHandler)}>
                        <Row className="my-3">
                            <Col sm={12} className="mb-3">
                                <label>Department Name</label>
                                <Input
                                    type="text"
                                    placeholder="First Name"
                                    className="form-control"
                                    name="department_name"
                                    reference={register({required: requiredField()})}
                                />
                                {errors.department_name && (
                                    <small className="form-text text-danger">
                                        {errors.department_name.message}
                                    </small>
                                )}
                            </Col>
                            <Col sm={12} className="mb-3">
                                <label>Select Department Head</label>
                                <select
                                    className="form-control"
                                    name="department_director_uuid"
                                    ref={register({})}
                                >
                                    <option value="">Select Employee</option>
                                    {allMember?.employees?.map((item, i) => (
                                        <option key={item.uuid} value={item.uuid}>
                                            {item.first_name} {item.last_name}
                                        </option>
                                    ))}
                                </select>
                            </Col>
                            <Col sm={12}>
                                <label>Select Business Unit</label>
                                <select
                                    className="form-control"
                                    name="business_uuid"
                                    ref={register({})}
                                >
                                    <option value="">Select Bu Head</option>
                                    {allBuHeads?.map((item, i) => (
                                        <option key={item.uuid} value={item.uuid}>
                                            {item.business_unit_name}
                                        </option>
                                    ))}
                                </select>
                            </Col>
                            <Col sm={12} className="buttonSection mt-4">
                                <Button
                                    disabled={!formState.isValid}
                                    variant="primary"
                                    type="submit"
                                >
                                    Add
                                </Button>
                                <Button variant="outline-danger" onClick={addDepartModalClose}>
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

export default Departments;
