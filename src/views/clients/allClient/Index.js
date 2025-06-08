import React, {useState} from "react";
import {Row, Col, Button, Card, Modal} from "react-bootstrap";
import Paginations from "../../commonComponent/pagination/Index";
import {Link, useNavigate} from "react-router-dom";
import Breadcrumb from "../../../components/Breadcrumb";
import {authState} from "../../../recoil/authRecoil";
import BootstrapTable from "react-bootstrap-table-next";
import Loader from "../../widgets/loader/Loader";
import {FaUserAlt} from "react-icons/fa";
import {AiOutlineMore, AiOutlinePlusCircle, AiOutlineMenu, AiOutlineSearch} from "react-icons/ai";
import {BsTrash, BsGrid} from "react-icons/bs";
import {BiEdit} from "react-icons/bi";
import {useForm} from "react-hook-form";
import {useGetAllClients} from "../../../query/clients/allClients/allClientsQuery";
import {useDeleteClient} from "../../../query/clients/deleteClient/deleteClientQuery";
import avatar1 from "../../../assets/images/avatars/1.jpg";
import AddClient from "../addClient/Index";
import "./style.scss";
import {gridViewClientState} from "../../../recoil/gridViewCheck";
import {authRoleState} from "../../../recoil/authRecoil";
import {useRecoilValue, useSetRecoilState} from "recoil";
import RoleAccess from "../../../utilits/RoleAccess";

const AllClient = () => {
    const [deleteModel, setDeleteModel] = useState(false);
    const setViewCheckValue = useSetRecoilState(gridViewClientState);
    const viewCheckValue = useRecoilValue(gridViewClientState);
    const getRole = useRecoilValue(authRoleState);
    const authRoles = getRole && getRole?.Role;
    const empDetail = useRecoilValue(authState);
    const accessList = empDetail && empDetail.module_names;
    const [ids, setIds] = useState("");
    const navigate = useNavigate();
    const [searchCriteria, setSearchCriteria] = useState({
        itemsPerPage: 12,
        newCurrentPage: 1,
        searchValue: "",
        searchDepartmentCriteria: empDetail?.department_uuid,
    });
    const {data, isLoading} = useGetAllClients(searchCriteria);
    const [popover, setPopover] = useState(false);
    //const [gridView, setGridView] = useState(true)

    const {register, handleSubmit, errors, reset, setValue} = useForm();

    const handlePopover = (id) => {
        if (popover === id) {
            setPopover(null);
        } else {
            setPopover(id);
        }
    };
    const goToAddClient = () => {
        navigate("/clients/addClient");
    };

    const handleDeleteClient = (id) => {
        setIds(id);
        setDeleteModel(true, id);
    };

    const handleEditClient = (id) => {
        navigate(`/clients/updateClient/${id}`);
    };

    const handleOnSearch = (data) => {
        setSearchCriteria({...searchCriteria, searchValue: data.search, newCurrentPage: 1});
    };

    const allItemsCount = data && data.total_client ? data.total_client : null;

    const columns = [
        {
            dataField: "name",
            text: "Client Name",
            formatter: (cellContent, row) => (
                <div className="departmentHead">
                    <div className="headPic">
                        {row && row.logo ? (
                            <img src={row.logo} alt="" />
                        ) : (
                            <FaUserAlt className="userIcon" />
                        )}
                    </div>
                    <Link to={`/clients/clientDetail/${row.id}`}>{cellContent}</Link>
                </div>
            ),
        },
        {
            dataField: "web_url",
            text: "Web Url",
        },
        {
            dataField: "country",
            text: "Country",
        },
        {
            dataField: "time_zone",
            text: "Time Zone",
        },
        {
            dataField: "",
            text: "Action",
            hidden: accessList && accessList.includes("Add Client") ? false : true,
            formatter: (cellContent, row) => (
                <div className="ActionIcon">
                    <a className="editIcon" onClick={() => handleEditClient(row.id)}>
                        <BiEdit className="icon" />
                    </a>
                    <a className="deleteIcon" onClick={() => handleDeleteClient(row.id)}>
                        <BsTrash className="icon" />
                    </a>
                </div>
            ),
        },
    ];

    return (
        <div className="container allClients">
            <Row className="mb-2">
                <Col xs={5}>
                    <Breadcrumb />
                </Col>
                <Col xs={7} className="clientButtonGroup">
                    {viewCheckValue ? (
                        <Button variant="light" onClick={() => setViewCheckValue(false)}>
                            <AiOutlineMenu />
                        </Button>
                    ) : (
                        <Button variant="light" onClick={() => setViewCheckValue(true)}>
                            <BsGrid />
                        </Button>
                    )}
                    <div className="filterSection">
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
                    </div>
                    <Button className="addButton" variant="primary" onClick={goToAddClient}>
                        <AiOutlinePlusCircle className="icon" />
                        Add client
                    </Button>
                </Col>
            </Row>
            <div className="minHeightForPagination container">
                {isLoading ? (
                    <Loader />
                ) : viewCheckValue ? (
                    <Row>
                        {data && data.clients && data.clients.length > 0 ? (
                            data.clients.map((item, index) => (
                                <Col
                                    xs={12}
                                    md={6}
                                    lg={4}
                                    xl={3}
                                    className="px-2"
                                    key={index}
                                >
                                    <div className="AboutClient">
                                        {accessList && accessList.includes("Add Client") ? (
                                            <div className="more">
                                                <AiOutlineMore
                                                    className="moreIcon"
                                                    onClick={() => handlePopover(item.client_id)}
                                                />
                                                <div
                                                    className={`popover-menu ${
                                                        popover === item.client_id ? "show" : ""
                                                    }`}
                                                >
                                                    <div
                                                        className="popover-item"
                                                        onClick={() =>
                                                            handleEditClient(item.client_id)
                                                        }
                                                    >
                                                        <BiEdit className="EditIcon mr-2" />
                                                        Edit
                                                    </div>
                                                    <div
                                                        className="popover-item"
                                                        onClick={() =>
                                                            handleDeleteClient(item.client_id)
                                                        }
                                                    >
                                                        <BsTrash className="deleteIcon mr-2" />
                                                        Delete
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}

                                        <div className="projectClientDetail">
                                            <div className="clientPic">
                                                {item && item.logo ? (
                                                    <img src={item.logo} alt="" />
                                                ) : (
                                                    <FaUserAlt className="userIcon" />
                                                )}
                                            </div>
                                            <h6>{item?.name}</h6>
                                            <p>{item?.country?.split("-")[1]}</p>
                                            {/* <p>Jarrett Designer</p> */}
                                        </div>
                                        <div className="buttonGroup">
                                            <Button variant="primary">Message</Button>
                                            <Button
                                                variant="outline-primary"
                                                className="fullProfile"
                                            >
                                                <Link
                                                    to={`/clients/clientDetail/${item.client_id}`}
                                                >
                                                    Full profile
                                                </Link>
                                            </Button>
                                        </div>
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
                        <Col xs={12}>
                            <Card>
                                <div className="card-body">
                                    <BootstrapTable
                                        keyField="id"
                                        wrapperClasses="customScroll"
                                        data={data && data.clients ? data.clients : []}
                                        columns={columns}
                                        condensed
                                        // remote={{
                                        //   sort: true,
                                        //   pagination: true,
                                        // }}
                                        // onTableChange={onTableChange}
                                        // pagination={paginationFactory({
                                        //   page: 4,
                                        //   sizePerPage: 10,
                                        //   totalSize: 100,
                                        //   nextPageText: 'Next',
                                        //   prePageText: 'Prev',
                                        //   alwaysShowAllBtns: true,
                                        //   withFirstAndLast: false,
                                        //   nextPageTitle: 'Next Page',
                                        //   prePageTitle: 'Previous Page',
                                        // firstPageTitle: 'First Page',
                                        // lastPageTitle: 'Last Page',
                                        // })}
                                    />
                                </div>
                            </Card>
                        </Col>
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
                </div>
                <DeleteClientModal
                    deleteModalOpen={deleteModel}
                    deleteModalClose={() => setDeleteModel(false)}
                    deleteId={ids}
                />
            </div>
        </div>
    );
};

export const DeleteClientModal = (props) => {
    const {deleteModalOpen, deleteModalClose, deleteId} = props;
    const {error, isError, mutateAsync} = useDeleteClient();

    const deleteClientHandler = (e) => {
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
                    <Modal.Title>Delete Client</Modal.Title>
                </Modal.Header>
                <Modal.Body className="container">
                    <Row className="my-3">
                        <Col sm={12}>
                            <p>Are you sure want to delete this Client ?</p>
                        </Col>
                    </Row>
                    <Row className="mt-4 mb-2">
                        <Col sm={12}>
                            <div className="buttonSection">
                                <Button variant="primary" onClick={(e) => deleteClientHandler(e)}>
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

export default AllClient;
