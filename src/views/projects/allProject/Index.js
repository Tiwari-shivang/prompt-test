import Moment from "moment";
import React, {useState} from "react";
import {Button, Card, Col, Modal, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {useForm} from "react-hook-form";
import {AiOutlineEye, AiOutlineMenu, AiOutlinePlusCircle, AiOutlineSearch} from "react-icons/ai";
import {BiEdit} from "react-icons/bi";
import {BsCheckLg, BsGrid, BsTrash} from "react-icons/bs";
import {FaUserAlt} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import {useRecoilValue, useSetRecoilState} from "recoil";
import Breadcrumb from "../../../components/Breadcrumb";
import {useGetAllProjectWithAssociatedEmployee} from "../../../query/projects/allProjects/allProjectsQuery";
import {useDeleteProject} from "../../../query/projects/deleteProjects/deleteProjectsQuery";
import {authRoleState, authState} from "../../../recoil/authRecoil";
import {gridViewProjectState} from "../../../recoil/gridViewCheck";
import RoleAccess from "../../../utilits/RoleAccess";
import Paginations from "../../commonComponent/pagination/Index";
import Loader from "../../widgets/loader/Loader";
import "./style.scss";

const AllProject = () => {
    const [deleteModel, setDeleteModel] = useState(false);
    const [ids, setIds] = useState("");
    const setViewCheckValue = useSetRecoilState(gridViewProjectState);
    const viewCheckValue = useRecoilValue(gridViewProjectState);
    const empDetail = useRecoilValue(authState);
    const accessList = empDetail && empDetail.module_names;
    const getRole = useRecoilValue(authRoleState);
    const authRoles = getRole && getRole?.Role;
    const [searchCriteria, setSearchCriteria] = useState({
        itemsPerPage: 9,
        newCurrentPage: 1,
        searchValue: "",
    });

    const {data: projectWithEmp, isLoading: isLoadingProjects} =
        useGetAllProjectWithAssociatedEmployee(searchCriteria);
    const navigate = useNavigate();

    const goToAddProject = () => {
        navigate("/projects/addProject");
    };

    const {register, handleSubmit, errors, reset, setValue} = useForm();

    const handleDeleteProject = (id) => {
        setIds(id);
        setDeleteModel(true, id);
    };

    const handleEditProject = (id) => {
        navigate(`/projects/updateProject/${id}`);
    };
    const handleOnSearch = (data) => {
        setSearchCriteria({...searchCriteria, searchValue: data.search, newCurrentPage: 1});
    };
    const allItemsCount = projectWithEmp?.project_with_employee
        ? projectWithEmp?.total_project
        : null;

    const columns = [
        {
            dataField: "project_name",
            text: "Project Name",
            formatter: (cellContent, row) => (
                <div
                    className="projectNameList"
                    onClick={() => navigate(`/projects/projectDetail/${row.project.uuid}`)}
                >
                    {row.project?.project_name}
                </div>
            ),
        },
        {
            dataField: "Created_date",
            text: "Created Date",
            formatter: (cellContent, row) => <div>{row.project?.project_start_date}</div>,
        },
        {
            dataField: "Project_Manager",
            text: "Project Manager",
            formatter: (cellContent, row) => (
                <div>
                    {row.project_manager?.first_name} {row.project_manager?.last_name}
                </div>
            ),
        },
        {
            dataField: "",
            text: "Action",
            hidden: accessList && accessList.includes("Add Project") ? false : true,
            formatter: (cellContent, row) => (
                <div className="ActionIcon">
                    <a className="editIcon">
                        <BiEdit
                            className="icon"
                            onClick={() => handleEditProject(row.project?.uuid)}
                        />
                    </a>
                    <a
                        className="deleteIcon"
                        onClick={() => handleDeleteProject(row.project?.uuid)}
                    >
                        <BsTrash className="icon" />
                    </a>
                </div>
            ),
        },
    ];

    return (
        <div className="allProject container">
            <Row className="mb-3">
                <Col xs={7}>
                    <Breadcrumb />
                </Col>
                <Col xs={5} className="projectButtonGroup">
                    <div className="filterSection">
                        {viewCheckValue ? (
                            <Button variant="light" onClick={() => setViewCheckValue(false)}>
                                <AiOutlineMenu />
                            </Button>
                        ) : (
                            <Button variant="light" onClick={() => setViewCheckValue(true)}>
                                <BsGrid />
                            </Button>
                        )}
                        <div className="searchSection">
                            <form className="d-flex" onSubmit={handleSubmit(handleOnSearch)}>
                                <input
                                    className="form-control form-control-sm me-sm-2"
                                    placeholder="Search"
                                    name="search"
                                    ref={register({})}
                                />
                                <button color="light" className="btn" type="submit">
                                    <AiOutlineSearch />
                                </button>
                            </form>
                        </div>
                        {accessList && accessList.includes("Add Project") ? (
                            <Button
                                className="addButton"
                                variant="primary"
                                onClick={goToAddProject}
                            >
                                <AiOutlinePlusCircle className="icon" />
                                Add Project
                            </Button>
                        ) : (
                            ""
                        )}
                    </div>
                </Col>
            </Row>
            <div className="minHeightForPagination container">
                {isLoadingProjects ? (
                    <Loader />
                ) : viewCheckValue ? (
                    <Row>
                        {projectWithEmp &&
                        projectWithEmp.project_with_employee &&
                        projectWithEmp.project_with_employee.length > 0 ? (
                            projectWithEmp.project_with_employee.map((item, index) => (
                                <Col xs="12" lg="6" xl="4" className="px-2 mb-3" key={index}>
                                    <div className="currentProject container">
                                        <Row className="gx-0">
                                            <Col xs={9}>
                                                <div className="projectName">
                                                    {item?.project?.project_name}
                                                </div>
                                            </Col>
                                            <Col xs={3}>
                                                {accessList &&
                                                accessList.includes("Add Project") ? (
                                                    <span className="moreOption">
                                                        <div className="icon">
                                                            <Link
                                                                to={`/projects/projectDetail/${item?.project?.uuid}`}
                                                            >
                                                                <AiOutlineEye
                                                                    className="viewIcon"
                                                                    title="View Project Details"
                                                                />
                                                            </Link>
                                                        </div>

                                                        <div className="icon">
                                                            <Link
                                                                to={`/projects/updateProject/${item?.project?.uuid}`}
                                                            >
                                                                <BiEdit
                                                                    className="editIcon"
                                                                    title="Edit Project"
                                                                />
                                                            </Link>
                                                        </div>
                                                        <div className="icon">
                                                            <BsTrash
                                                                onClick={() =>
                                                                    handleDeleteProject(
                                                                        item?.project?.uuid
                                                                    )
                                                                }
                                                                className="deleteIcon"
                                                                title="Delete Project"
                                                            />
                                                        </div>
                                                    </span>
                                                ) : (
                                                    <span className="moreOption justify-content-end">
                                                        <div className="icon">
                                                            <Link
                                                                to={`/projects/projectDetail/${item?.project?.uuid}`}
                                                            >
                                                                <AiOutlineEye
                                                                    className="viewIcon"
                                                                    title="View Project Details"
                                                                />
                                                            </Link>
                                                        </div>
                                                    </span>
                                                )}
                                            </Col>
                                        </Row>
                                        <div className="progressPriority">
                                            <p>
                                                Created{" "}
                                                {Moment(item?.project?.created_at).format(
                                                    "DD-MM-YYYY"
                                                )}
                                            </p>
                                            {/* <p> `${item?.created_at.getDate()}-${item?.created_at.getMonth() + 1}-${item?.created_at.getFullYear()}`</p> */}
                                            <span>{item?.phase ? "Inprogress" : "Completed"}</span>
                                            <p>Priority : {item?.project?.priority}</p>
                                            <p>
                                                Started :
                                                {Moment(item?.project?.project_start_date).format(
                                                    "DD-MM-YYYY"
                                                )}
                                            </p>
                                        </div>
                                        <div className="projectDescription">
                                            {item?.project?.description}
                                        </div>
                                        <Row className="projectCompletion gx-0 w-100">
                                            <Col className="projectCompLeft">
                                                <div className="projectManager">
                                                    <div className="projectManagerPic">
                                                        {item &&
                                                        item.project_manager &&
                                                        item.project_manager.profile_picture ? (
                                                            <img
                                                                src={
                                                                    item.project_manager
                                                                        .profile_picture
                                                                }
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <FaUserAlt className="userIcon" />
                                                        )}
                                                    </div>
                                                    <p>
                                                        Project Manager{" "}
                                                        <span>
                                                            {item?.project_manager?.first_name}{" "}
                                                            {item?.project_manager?.last_name}
                                                        </span>
                                                    </p>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <div className="teamMember">
                                                <p>Team Member</p>
                                                <div className="teamMembers">
                                                    {item &&
                                                        item.employees &&
                                                        item.employees
                                                            .slice(0, 8)
                                                            .map((empImg, index) => (
                                                                <OverlayTrigger
                                                                    placement="top"
																	key={`${index}`}
                                                                    delay={{show: 250, hide: 400}}
                                                                    overlay={
                                                                        <Tooltip id="button-tooltip">
                                                                            {empImg?.first_name}{" "}
                                                                            {empImg?.last_name}
                                                                        </Tooltip>
                                                                    }
                                                                >
                                                                    <div
                                                                        className="teamMembersPic"
                                                                        onClick={() =>
                                                                            navigate(
                                                                                `/members/memberDetail/${empImg.uuid}`
                                                                            )
                                                                        }
                                                                    >
                                                                        {empImg &&
                                                                        empImg?.profile_picture ? (
                                                                            <img
                                                                                src={
                                                                                    empImg.profile_picture
                                                                                }
                                                                                alt=""
                                                                            />
                                                                        ) : (
                                                                            <FaUserAlt className="userIcon" />
                                                                        )}
                                                                    </div>
                                                                </OverlayTrigger>
                                                            ))}
                                                    {item?.employees?.length > 8 && (
                                                        <div className="hiddenTeamMembersPic">
                                                            <p>+{item?.employees?.length - 8}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Row>
                                    </div>
                                </Col>
                            ))
                        ) : (
                            <div className="dataNotFound">
                                <p>Data not found</p>
                            </div>
                        )}
                    </Row>
                ) : (
                    <Row>
                        {projectWithEmp &&
                        projectWithEmp.project_with_employee &&
                        projectWithEmp.project_with_employee.length > 0 ? (
                            <Col xs={12}>
                                `{" "}
                                <Card>
                                    <div className="card-body">
                                        <BootstrapTable
                                            keyField="id"
                                            wrapperClasses="customScroll"
                                            data={
                                                projectWithEmp &&
                                                projectWithEmp.project_with_employee
                                                    ? projectWithEmp.project_with_employee
                                                    : []
                                            }
                                            columns={columns}
                                            condensed
                                        />
                                    </div>
                                </Card>
                            </Col>
                        ) : (
                            <div className="dataNotFound">
                                <p>Data not found</p>
                            </div>
                        )}
                    </Row>
                )}
                <div className="pagination">
                    <Paginations
                        itemsCount={allItemsCount}
                        itemsPerPage={searchCriteria.itemsPerPage}
                        currentPage={searchCriteria.newCurrentPage}
                        setCurrentPage={(e) =>
                            setSearchCriteria({...searchCriteria, newCurrentPage: e})
                        }
                    />
                    <DeleteProjectModal
                        deleteModalOpen={deleteModel}
                        deleteModalClose={() => setDeleteModel(false)}
                        deleteId={ids}
                    />
                </div>
            </div>
        </div>
    );
};

export const DeleteProjectModal = (props) => {
    const {deleteModalOpen, deleteModalClose, deleteId} = props;
    const {error, isError, mutateAsync} = useDeleteProject();

    const deleteProjectHandler = (e) => {
        e.preventDefault();
        const details = {
            id: deleteId,
        };
        mutateAsync(details.id);
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
                    <Modal.Title>Delete Project</Modal.Title>
                </Modal.Header>
                <Modal.Body className="container">
                    <Row className="my-3">
                        <Col sm={12}>
                            <p>Are you sure want to delete this Project ?</p>
                        </Col>
                    </Row>
                    <Row className="mt-4 mb-2">
                        <Col sm={12}>
                            <div className="buttonSection">
                                <Button variant="primary" onClick={(e) => deleteProjectHandler(e)}>
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

export default AllProject;
