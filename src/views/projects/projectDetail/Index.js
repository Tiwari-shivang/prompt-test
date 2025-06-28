import Moment from "moment";
import React, {useEffect, useState} from "react";
import {Button, Col, Modal, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {BiEdit} from "react-icons/bi";
import {BsTrash} from "react-icons/bs";
import {FaUserAlt} from "react-icons/fa";
import {Link, useNavigate, useParams} from "react-router-dom";
import Breadcrumb from "../../../components/Breadcrumb";
import {useGetClientById} from "../../../query/clients/allClients/allClientsQuery";
import {
    useGetAllProjectMembersInPhase,
    useGetAllRms,
} from "../../../query/members/allMembers/allMembersQuery";
import {
    useGetAllProjectDetailsByPhase,
    useGetProjectById,
    useGetProjectPhaseById,
} from "../../../query/projects/allProjects/allProjectsQuery";
import {
    useHardDeleteTeamMember,
    useSoftDeleteTeamMember,
} from "../../../query/projects/deleteProjects/deleteProjectsQuery";
import Loader from "../../widgets/loader/Loader";
import "./style.scss";
import DeleteTeamMember from "../../modals/deleteTeamMember/Index";
import { useRecoilValue } from "recoil";
import { authState } from "../../../recoil/authRecoil";

const ProjectDetail = () => {
    const empDetail = useRecoilValue(authState);
	const accessList = empDetail && empDetail.module_names;
    const [deleteModel, setDeleteModel] = useState(false);
    const [ids, setIds] = useState("");
    const params = useParams(); //getting the project Id from the route.
    const navigate = useNavigate();
    const {data: phaseDetail, isLoading: isLoadingProjectPhases} = useGetProjectPhaseById(
        params?.id
    ); //all phases in this project.
    const [currentPhaseId, setCurrentPhaseId] = useState(phaseDetail && phaseDetail[0]?.uuid);
    const {data: projectDetail, isLoading: isLoadingProjectData} = useGetProjectById(params?.id);
    //const { data: allEmpOfProject, isLoading: isAllEmpOfProjectLoading } = useGetProjectMemberByProjectId(params?.id);
    const {data: projDetailInCurPhase, isLoading: isProjDetailInCurPhaseLoading} =
        useGetAllProjectDetailsByPhase({projectId: params.id, phaseId: currentPhaseId});
    const {data: clientDetail, isLoading: isClientDetailLoading} = useGetClientById(
        projDetailInCurPhase?.client_uuid
    );
    const {data: dataAllRm, isLoading: isLoadingAllRm} = useGetAllRms();
    const {data: phaseMembers} = useGetAllProjectMembersInPhase({
        phaseId: currentPhaseId,
        projectId: params.id,
    });
    const filterRm = dataAllRm?.filter((dataAllRm) => {
        return dataAllRm?.uuid === projectDetail?.pm_uuid;
    });

    const phaseChangeListener = (e) => {
        setCurrentPhaseId(e.target.value);
    };
    useEffect(() => {
        setCurrentPhaseId(phaseDetail && phaseDetail[0]?.uuid);
    }, [phaseDetail]);

    const columns = [
        {
            dataField: "",
            text: "Photos",
            formatter: (cellContent, row) => (
                <div
                    className="departmentHead"
                    onClick={() => navigate(`/members/memberDetail/${row.uuid}`)}
                >
                    <div className="headPic">
                        {row && row.profile_picture ? (
                            <img src={row.profile_picture} alt="" />
                        ) : (
                            <FaUserAlt className="userIcon" />
                        )}
                    </div>
                </div>
            ),
        },
        {
            dataField: "name",
            text: "Name",
        },
        {
            dataField: "email",
            text: "Email",
        },
        {
            text: "Allocation",
            formatter: (cellContent, row) => (
                <div className="allocation">
                    <div className={`${row?.allocation > 100 ? "text-danger" : "text-success"}`}>
                        {row?.allocation}
                    </div>
                </div>
            ),
        },
        {
            dataField: "role",
            text: "Role",
        },
        {
            dataField: "",
            text: "Action",
			hidden: !accessList || !accessList.includes('Add Project'),
            formatter: (cellContent, row) => (
                <div className="actionIcon">
                    <div className="icon">
                        <a
                            onClick={() =>
                                navigate(`/teamMember/updateTeamMember/${row.uuid}`, {
                                    state: {
                                        phaseId: currentPhaseId,
                                        id: projDetailInCurPhase.phase,
                                        projectUuid: params?.id,
                                        updateEmplyeeUuid: row?.uuid,
                                    },
                                })
                            }
                        >
                            <BiEdit className="editIcon" />
                        </a>
                    </div>
                    <a className="deleteIcon" onClick={() => deleteTeamMemberHandler(row.uuid)}>
                        <BsTrash className="icon" />
                    </a>
                </div>
            ),
        },
    ];

    const deleteTeamMemberHandler = (id) => {
        setIds(id);
        setDeleteModel(true, id);
    };

    if (isLoadingProjectPhases) {
        return <p>loading---</p>;
    }

    return (
        <div className="projectDetail container" >
            <Row className="mb-2">
                <Col xs={5}>
                    <Breadcrumb />
                </Col>
                <Col xs={7} className="buttSection" hidden>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                            navigate(`/projects/addPhaseInProject/${params.id}/update`, {
                                state: {phaseId: currentPhaseId, id: projDetailInCurPhase.phase},
                            })
                        }
                    >
                        {" "}
                        Update Phase
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                            navigate(`/projects/addPhaseInProject/${params.id}/add`, {
                                state: {phaseId: currentPhaseId, id: projDetailInCurPhase.phase},
                            })
                        }
                    >
                        Add Phase
                    </Button>
                    <select className="form-control" onChange={(e) => phaseChangeListener(e)}>
                        {phaseDetail &&
                            phaseDetail?.map((option, index) => (
                                <option value={option?.uuid}>Phase {index + 1}</option>
                            ))}
                    </select>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={5} md={4} lg={3} className="px-2 projectDetailRight">
                    <div className="projectDetailAboutClient">
                        {isClientDetailLoading || isProjDetailInCurPhaseLoading ? (
                            <Loader />
                        ) : (
                            <>
                                <div className="title">About Clients</div>
                                <div className="projectClientDetail">
                                    <div className="clientPic">
                                        {clientDetail && clientDetail.logo ? (
                                            <img src={clientDetail.logo} alt="" />
                                        ) : (
                                            <FaUserAlt className="userIcon" />
                                        )}
                                    </div>
                                    <h6>
                                        {clientDetail && clientDetail.name
                                            ? clientDetail.name
                                            : "Client Name"}
                                    </h6>
                                    <p>
                                        {clientDetail &&
                                        clientDetail.country &&
                                        clientDetail.country.length
                                            ? clientDetail.country
                                            : "Country Name"}
                                    </p>
                                </div>
                                <div className="buttonGroup">
                                    <Button variant="primary">
                                        <Link
                                            to={`/clients/clientDetail/${projDetailInCurPhase?.client_uuid}`}
                                        >
                                            Profile
                                        </Link>
                                    </Button>
                                    <Button variant="primary">Message</Button>
                                </div>
                            </>
                        )}
                    </div>
                </Col>
                <Col xs={12} sm={7} md={8} lg={9} className="px-2 projectDetailLeft">
                    {
                        <div className="currentProject">
                            {isProjDetailInCurPhaseLoading ? (
                                <Loader />
                            ) : (
                                <>
                                    <div className="projectName">{projectDetail?.project_name}</div>
                                    <div className="progressPriority">
                                        <p>
                                            <span>Inprogress</span> Priority :{" "}
                                            {projDetailInCurPhase?.priority}
                                        </p>
                                    </div>
                                    <div className="projectDescription customScroll">
                                        {projDetailInCurPhase?.phase_description}
                                    </div>
                                    <div className="projectCreatedAndDeadlineAndPM">
                                        <p className="pm">
                                            Project Manager: {filterRm && filterRm[0]?.first_name}{" "}
                                            {filterRm && filterRm[0]?.last_name}
                                        </p>
                                        <p>
                                            Created{" "}
                                            {Moment(projDetailInCurPhase?.start_date).format(
                                                "DD-MM-YYYY"
                                            )}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    }
                </Col>
                <Col xs={12}>
                    <div className="contact-card-body">
                        <h2>Team Members</h2>
                        <div className="main-card">
                            {phaseMembers?.length > 0 ? (
                                <BootstrapTable
                                    keyField="id"
                                    data={phaseMembers ? phaseMembers : []}
                                    columns={columns}
                                    condensed
                                />
                            ) : (
                                <p>No Team Member available.</p>
                            )}
                        </div>
                        <DeleteTeamMember
                            deleteModalOpen={deleteModel}
                            deleteModalClose={() => setDeleteModel(false)}
                            deleteId={ids}
                        />
                        <div className="addContactButton">
                            <Button
                                variant="primary"
                                onClick={() =>
                                    navigate(
                                        `/teamMember/addTeamMember/${params.id}/${currentPhaseId}`,
                                        {
                                            state: {
                                                "phaseUuid": currentPhaseId,
                                                "phaseNo": projDetailInCurPhase?.phase,
                                            },
                                        }
                                    )
                                }
                            >
                                Add Team Member
                            </Button>
                            {/* <Button size='md' onClick={() => navigate(`/projects/addPhaseInProject/${projectDetail.id}`)}>Add Phase</Button> */}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

// export const DeleteTeamMemberModal = (props) => {
// 	const { deleteModalOpen, deleteModalClose, deleteId } = props
// 	const { mutateAsync: softDeleteMutateAsync } = useSoftDeleteTeamMember()
// 	const { mutateAsync: hardDeleteMutateAsync } = useHardDeleteTeamMember()

// 	const TeamMemberHandler = (e, data) => {
// 		e.preventDefault()
// 		debugger
// 		data === "soft" ? softDeleteMutateAsync(deleteId) : hardDeleteMutateAsync(deleteId)
// 		deleteModalClose()
// 	}

// 	return (
// 		<>
// 			<Modal
// 				className="commonModal"
// 				show={deleteModalOpen}
// 				onHide={deleteModalClose}
// 				centered
// 			>
// 				<Modal.Header closeButton >
// 					<Modal.Title>Delete Team member</Modal.Title>
// 				</Modal.Header>
// 				<Modal.Body>
// 					<Row className="my-3">
// 						<Col sm={12}>
// 							<p>Are you sure want to delete this Member ?</p>
// 						</Col>
// 					</Row>
// 					<Row className="mt-4 mb-2">
// 						<Col sm={12}>
// 							<div className='buttonSection deleteButtons'>
// 								<Button variant="primary" onClick={(e) => TeamMemberHandler(e, "hard")}>
// 									Parmanent <BsTrash className='icon' />
// 								</Button>
// 								<Button variant="outline-danger" onClick={(e) => TeamMemberHandler(e, "soft")}>
// 									Soft <BsTrash className='icon' />
// 								</Button>
// 							</div>
// 						</Col>
// 					</Row>
// 				</Modal.Body>
// 			</Modal>
// 		</>
// 	)
// }

export default ProjectDetail;
