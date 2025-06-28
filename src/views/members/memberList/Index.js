import React, {useEffect, useState} from "react";
import {Button, Card, Col, Modal, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import {useForm} from "react-hook-form";
import {AiOutlineMenu, AiOutlineMore, AiOutlineSearch} from "react-icons/ai";
import {BiEdit, BiFilterAlt} from "react-icons/bi";
import {BsGrid, BsTrash} from "react-icons/bs";
import {FaUserAlt} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";
import {useRecoilValue, useSetRecoilState} from "recoil";
import Breadcrumb from "../../../components/Breadcrumb";
import {useGetAllDepartments} from "../../../query/department/allDepartments/allDepartmentsQuery";
import {useGetAllDesignation} from "../../../query/designation/allDesignation/allDesignationQuery";
import {useGetAllLocations} from "../../../query/location/allLocation/allLocationQuery";
import {useGetAllMembers, useGetAllRms} from "../../../query/members/allMembers/allMembersQuery";
import {useDeleteMembers} from "../../../query/members/deleteMembers/deleteMembersQuery";
import {authRoleState, authState} from "../../../recoil/authRecoil";
import {gridViewMemberState} from "../../../recoil/gridViewCheck";
import {universalSearchState} from "../../../recoil/universalSearch";
import RoleAccess from "../../../utilits/RoleAccess";
import Paginations from "../../commonComponent/pagination/Index";
import {Input} from "../../widgets/formComponents/Input";
import Loader from "../../widgets/loader/Loader";
import "./style.scss";

const MemberList = () => {
    const universalSearchValue = useRecoilValue(universalSearchState);
    const setViewCheckValue = useSetRecoilState(gridViewMemberState);
    const viewCheckValue = useRecoilValue(gridViewMemberState);
    const getRole = useRecoilValue(authRoleState);
    const authRoles = getRole && getRole?.Role;
    const empDetail = useRecoilValue(authState);
    const accessList = empDetail && empDetail.module_names;
    let navigate = useNavigate();
    const [ids, setIds] = useState("");
    const [popover, setPopover] = useState();
    const [filters, setFilters] = useState(false);
    const [deleteModel, setDeleteModel] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({
        itemsPerPage: 9,
        newCurrentPage: 1,
        searchValue: "",
        departmentName: "",
        designationName: "",
        locationName: "",
        experienceFrom: "",
        experienceTo: "",
    });
    const [searchBarShow, setSearchBarShow] = useState(false);
    const {register, handleSubmit, errors, reset, setValue} = useForm();
    const searchIconClickHandler = () => {
        setSearchBarShow((s) => !s);
    };
    const handlePopover = (id) => {
        if (popover === id) {
            setPopover(null);
        } else {
            setPopover(id);
        }
    };
    const {data: allMember, isLoading: allMemberLoading} = useGetAllMembers(searchCriteria);
    const {data: dataAllRm, isLoading: isLoadingAllRm} = useGetAllRms();

    const {error, isError, mutateAsync} = useDeleteMembers();

    const allItemsCount = allMember?.total_employee ? allMember.total_employee : null;
    const [isAvailableMembers, setIsAvailableMembers] = useState(false);
    useEffect(() => {
        if (universalSearchValue.searchV != "") {
            setSearchCriteria({
                ...searchCriteria,
                searchValue: universalSearchValue && universalSearchValue.searchV,
                locationName: "",
                designationName: "",
                departmentName: "",
                newCurrentPage: 1,
                experienceFrom: "",
                experienceTo: "",
            });
        }
    }, [universalSearchValue.searchV]);

    const handleFilter = (e) => {
        setFilters(true);
    };

    const handleDeleteMember = (id) => {
        mutateAsync(id);
    };

    const handleEditMember = (id) => {
        navigate(`/members/updateMember/${id}`);
    };

    const handleOnSearch = (data) => {
        setSearchCriteria({
            ...searchCriteria,
            searchValue: data.search,
            locationName: "",
            designationName: "",
            departmentName: "",
            newCurrentPage: 1,
            experienceFrom: "",
            experienceTo: "",
        });
        setSearchBarShow(false);
    };

    const columns = [
        {
            dataField: "name",
            text: "Name",
            formatter: (cellContent, row) => (
                <div
                    className="nameAndPic"
                    onClick={() => {
                        navigate(`/members/memberDetail/${row.uuid}`);
                    }}
                >
                    <div className="headPic">
                        {row && row.profile_picture ? (
                            <img src={row.profile_picture} alt="" />
                        ) : (
                            <FaUserAlt className="userIcon" />
                        )}
                    </div>
                    <p>
                        {row.first_name} {row.last_name}
                    </p>
                </div>
            ),
        },
        {
            dataField: "office_id",
            text: "EMPLOYEE Id",
        },
        {
            dataField: "phone_number",
            text: "Mobile Number",
        },
        {
            dataField: "total_allocation",
            text: "Allocation",
            formatter: (cellContent, row) => <div className="allocationCol">{cellContent}%</div>,
        },
        {
            dataField: "total_billable",
            text: "Billable",
            formatter: (cellContent, row) => <div className="allocationCol">{cellContent}%</div>,
        },
        {
            dataField: "Project_Manager",
            text: "Project Manager",
            formatter: (cellContent, row) => (
                <div className="ProjectName">
                    <span>
                        {dataAllRm
                            ?.filter(function (dataAllRm) {
                                return dataAllRm?.uuid == row?.reporting_manager_uuid;
                            })
                            .map(function (dataAllRm) {
                                return dataAllRm?.first_name + " " + dataAllRm?.last_name;
                            })}
                    </span>
                </div>
            ),
        },
        {
            dataField: "",
            text: "Action",
            hidden: accessList && accessList.includes("Add Member") ? false : true,
            formatter: (cellContent, row) => (
                <div className="ActionIcon">
                    <a className="editIcon">
                        <BiEdit className="icon" onClick={() => handleEditMember(row.uuid)} />
                    </a>
                    <a className="deleteIcon" onClick={() => openDeletePopup(row.uuid)}>
                        <BsTrash className="icon" />
                    </a>
                </div>
            ),
        },
    ];

    const openDeletePopup = (id, e) => {
        setIds(id);
        setDeleteModel(true, id);
    };
    const checkBoxClickHandler = ({target: {checked}}) => {
        setIsAvailableMembers(checked);
    };
    return (
        <div className="memberList container">
            <Row className="mb-3 headerRow">
                <Col xs={9} md={3}>
                    <Breadcrumb />
                </Col>
                <Col xs={3} md={9}>
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
                        <div className="searchSection d-none d-md-block">
                            <form className="d-flex" onSubmit={handleSubmit(handleOnSearch)}>
                                <input
                                    className="form-control form-control-sm "
                                    placeholder="Search"
                                    name="search"
                                    ref={register({})}
                                />
                                <button color="light" className="btn" type="submit">
                                    <AiOutlineSearch />
                                </button>
                            </form>
                        </div>
                        <button
                            className="filter d-none d-md-block"
                            onClick={(e) => handleFilter(e)}
                        >
                            <BiFilterAlt /> Filter
                        </button>
                        <AiOutlineSearch
                            className="searchIcon d-md-none "
                            onClick={searchIconClickHandler}
                        />
                        <BiFilterAlt
                            className="filterIcon d-md-none "
                            onClick={(e) => handleFilter(e)}
                        />
                    </div>
                </Col>
                <Col sm={12} className="d-flex mt-1 ms-2 align-items-center justify-content-start">
                    <Input
                        type="checkbox"
                        className="checkboxSection me-1"
                        name="rememberMe"
                        reference={register()}
                        onChangeHandler={checkBoxClickHandler}
                    />
                    <p className="mx-1 d-inline">Show Available Employees</p>
                </Col>
                {/* <Col sm={12} xs={12} className={searchBarShow ? 'd-sm-block d-md-none' : 'd-none'} >
					<div className='filterSection'>
						<div className='searchSection'>
							<form className="d-flex" onSubmit={handleSubmit(handleOnSearch)}>
								<input className="form-control form-control-sm me-sm-0 me-md-2" placeholder="Search" name="search" ref={register({})} />
								<button color="light" className="btn" type="submit">
									<AiOutlineSearch />
								</button>
							</form>
						</div>
					</div>
				</Col> */}
            </Row>
            <div className="minHeightForPagination container">
                {allMemberLoading ? (
                    <Loader />
                ) : viewCheckValue ? (
                    isAvailableMembers ? (
                        <Row>
                            {allMember?.employees.length > 0 ? (
                                allMember.employees
                                    .filter((item) => item?.total_allocation < 100)
                                    .map((item, index) => (
                                        <Col
                                            key={`${index}`}
                                            xs={12}
                                            md={6}
                                            xl={4}
                                            className="mb-3 px-2"
                                        >
                                            <div className="memberCard cardShadow">
                                                <div className="memberRow">
                                                    <div className="memberCol3">
                                                        <div className="memberPic">
                                                            {item && item.profile_picture ? (
                                                                <img
                                                                    src={item.profile_picture}
                                                                    alt=""
                                                                />
                                                            ) : (
                                                                <FaUserAlt className="userIcon" />
                                                            )}
                                                        </div>
                                                        <div className="buttonGroup">
                                                            <Button
                                                                onClick={() => {
                                                                    navigate(
                                                                        `/members/memberDetail/${item.uuid}`
                                                                    );
                                                                }}
                                                            >
                                                                Full Profile
                                                            </Button>
                                                            <p>
                                                                Emp Id:{" "}
                                                                <span>{item.office_id}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="memberCol9">
                                                        <div className="memberDetail">
                                                            <div className="memberDetailRow gx-0">
                                                                <Col xs={11}>
                                                                    <div className="memberName">
                                                                        {item.first_name}{" "}
                                                                        {item.last_name}
                                                                    </div>
                                                                    <div className="memberDesignation">
                                                                        <OverlayTrigger
                                                                            placement="top"
                                                                            delay={{
                                                                                show: 250,
                                                                                hide: 400,
                                                                            }}
                                                                            overlay={
                                                                                <Tooltip id="button-tooltip">
                                                                                    {
                                                                                        item.designation_name
                                                                                    }
                                                                                </Tooltip>
                                                                            }
                                                                        >
                                                                            <span>
                                                                                {
                                                                                    item.designation_short_form
                                                                                }
                                                                            </span>
                                                                        </OverlayTrigger>
                                                                        <OverlayTrigger
                                                                            placement="top"
                                                                            delay={{
                                                                                show: 250,
                                                                                hide: 400,
                                                                            }}
                                                                            overlay={
                                                                                <Tooltip id="button-tooltip">
                                                                                    {
                                                                                        item.total_allocation
                                                                                    }
                                                                                    % allocated
                                                                                </Tooltip>
                                                                            }
                                                                        >
                                                                            <span >
                                                                                {
                                                                                    item.total_allocation
                                                                                }
                                                                                %
                                                                            </span>
                                                                        </OverlayTrigger>
                                                                    </div>
                                                                </Col>
                                                                <Col xs={1}>
                                                                    {accessList &&
                                                                    accessList.includes(
                                                                        "Add Member"
                                                                    ) ? (
                                                                        <span className="more">
                                                                            <AiOutlineMore
                                                                                className="moreIcon"
                                                                                onClick={() =>
                                                                                    handlePopover(
                                                                                        item.uuid
                                                                                    )
                                                                                }
                                                                            />
                                                                            <div
                                                                                className={`popover-menu ${
                                                                                    popover ===
                                                                                    item.uuid
                                                                                        ? "show"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                <div className="popover-item">
                                                                                    <Link
                                                                                        to={`/members/updateMember/${
                                                                                            item &&
                                                                                            item.uuid
                                                                                        }`}
                                                                                    >
                                                                                        {" "}
                                                                                        <BiEdit className="EditIcon mr-2" />
                                                                                        Edit
                                                                                    </Link>
                                                                                </div>
                                                                                <div
                                                                                    className="popover-item"
                                                                                    onClick={(e) =>
                                                                                        openDeletePopup(
                                                                                            item &&
                                                                                                item.uuid,
                                                                                            e
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <BsTrash className="deleteIcon mr-2" />
                                                                                    Delete
                                                                                </div>
                                                                            </div>
                                                                        </span>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </Col>
                                                            </div>
                                                            <div className="memberDescription">
                                                                <p>{item.department_name}</p>
                                                                <p>
                                                                    {"+"}
                                                                    {item?.phone_number.substring(
                                                                        0,
                                                                        2
                                                                    )}
                                                                    -
                                                                    {item?.phone_number.substring(
                                                                        2
                                                                    )}
                                                                </p>
                                                                <p>{item.email}</p>
                                                                <p>
                                                                    Reports to :
                                                                    <span>
                                                                        {dataAllRm
                                                                            ?.filter(function (
                                                                                dataAllRm
                                                                            ) {
                                                                                return (
                                                                                    dataAllRm?.uuid ==
                                                                                    item?.reporting_manager_uuid
                                                                                );
                                                                            })
                                                                            .map(function (
                                                                                dataAllRm
                                                                            ) {
                                                                                return (
                                                                                    dataAllRm?.first_name +
                                                                                    " " +
                                                                                    dataAllRm?.last_name
                                                                                );
                                                                            })}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div className="memberSkills">
                                                                {item &&
                                                                    item.skills &&
                                                                    item.skills.map(
                                                                        (skill, ind) => (
                                                                            <span key={ind}>
                                                                                {skill.skill_name}
                                                                            </span>
                                                                        )
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>
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
                            {allMember?.employees.length > 0 ? (
                                allMember.employees.map((item, index) => (
                                    <Col xs={12} md={6} xl={4} className="mb-3 px-2" key={index}>
                                        <div className="memberCard">
                                            <div className="memberRow">
                                                <div className="memberCol3">
                                                    <div className="memberPic">
                                                        {item && item.profile_picture ? (
                                                            <img
                                                                src={item.profile_picture}
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <FaUserAlt className="userIcon" />
                                                        )}
                                                    </div>
                                                    <div className="buttonGroup">
                                                        <Button
                                                            onClick={() => {
                                                                navigate(
                                                                    `/members/memberDetail/${item.uuid}`
                                                                );
                                                            }}
                                                        >
                                                            Full Profile
                                                        </Button>
                                                        <p>
                                                            Emp Id: <span>{item.office_id}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="memberCol9">
                                                    <div className="memberDetail">
                                                        <div className="memberDetailRow gx-0">
                                                            <Col xs={11}>
                                                                <div className="memberName">
                                                                    {item.first_name}{" "}
                                                                    {item.last_name}
                                                                </div>
                                                                <div className="memberDesignation">
                                                                    <OverlayTrigger
                                                                        placement="top"
                                                                        delay={{
                                                                            show: 250,
                                                                            hide: 400,
                                                                        }}
                                                                        overlay={
                                                                            <Tooltip id="button-tooltip">
                                                                                {
                                                                                    item.designation_name
                                                                                }
                                                                            </Tooltip>
                                                                        }
                                                                    >
                                                                        <span>
                                                                            {
                                                                                item.designation_short_form
                                                                            }
                                                                        </span>
                                                                    </OverlayTrigger>
                                                                    <OverlayTrigger
                                                                        placement="top"
                                                                        delay={{
                                                                            show: 250,
                                                                            hide: 400,
                                                                        }}
                                                                        overlay={
                                                                            <Tooltip id="button-tooltip">
                                                                                {
                                                                                    item.total_allocation
                                                                                }
                                                                                % allocated
                                                                            </Tooltip>
                                                                        }
                                                                    >
                                                                        <span>
                                                                            {item.total_allocation}%
                                                                        </span>
                                                                    </OverlayTrigger>
                                                                </div>
                                                            </Col>
                                                            <Col xs={1}>
                                                                {accessList &&
                                                                accessList.includes(
                                                                    "Add Member"
                                                                ) ? (
                                                                    <span className="more">
                                                                        <AiOutlineMore
                                                                            className="moreIcon"
                                                                            onClick={() =>
                                                                                handlePopover(
                                                                                    item.uuid
                                                                                )
                                                                            }
                                                                        />
                                                                        <div
                                                                            className={`popover-menu ${
                                                                                popover ===
                                                                                item.uuid
                                                                                    ? "show"
                                                                                    : ""
                                                                            }`}
                                                                        >
                                                                            <div className="popover-item">
                                                                                <Link
                                                                                    to={`/members/updateMember/${
                                                                                        item &&
                                                                                        item.uuid
                                                                                    }`}
                                                                                >
                                                                                    {" "}
                                                                                    <BiEdit className="EditIcon mr-2" />
                                                                                    Edit
                                                                                </Link>
                                                                            </div>
                                                                            <div
                                                                                className="popover-item"
                                                                                onClick={(e) =>
                                                                                    openDeletePopup(
                                                                                        item &&
                                                                                            item.uuid,
                                                                                        e
                                                                                    )
                                                                                }
                                                                            >
                                                                                <BsTrash className="deleteIcon mr-2" />
                                                                                Delete
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </Col>
                                                        </div>
                                                        <div className="memberDescription">
                                                            <p>{item.department_name}</p>
                                                            <p>
                                                                {"+"}
                                                                {item?.phone_number.substring(0, 2)}
                                                                -{item?.phone_number.substring(2)}
                                                            </p>
                                                            <p>{item.email}</p>
                                                            <p>
                                                                Reports to:{" "}
                                                                <span>
                                                                    {dataAllRm
                                                                        ?.filter(function (
                                                                            dataAllRm
                                                                        ) {
                                                                            return (
                                                                                dataAllRm?.uuid ==
                                                                                item?.reporting_manager_uuid
                                                                            );
                                                                        })
                                                                        .map(function (dataAllRm) {
                                                                            return (
                                                                                dataAllRm?.first_name +
                                                                                " " +
                                                                                dataAllRm?.last_name
                                                                            );
                                                                        })}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div className="memberSkills">
                                                            {item &&
                                                                item.skills &&
                                                                item.skills.map((skill, ind) => (
                                                                    <span key={ind}>
                                                                        {skill.skill_name}
                                                                    </span>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </div>
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
                    )
                ) : isAvailableMembers ? (
                    <Row>
                        {allMember && allMember.employees && allMember.employees.length > 0 ? (
                            <Col xs={12}>
                                <Card>
                                    <div className="card-body">
                                        <BootstrapTable
                                            keyField="id"
                                            wrapperClasses="customScroll"
                                            data={
                                                allMember && allMember.employees
                                                    ? allMember.employees.filter(
                                                          (item) => item?.total_allocation < 100
                                                      )
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
                ) : (
                    <Row>
                        {allMember && allMember.employees && allMember.employees.length > 0 ? (
                            <Col xs={12}>
                                <Card>
                                    <div className="card-body">
                                        <BootstrapTable
                                            keyField="id"
                                            wrapperClasses="customScroll"
                                            data={
                                                allMember && allMember.employees
                                                    ? allMember.employees
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
                <Row>
                    <Col xs={12}>
                        <DeleteMemberModal
                            deleteModalOpen={deleteModel}
                            deleteModalClose={() => setDeleteModel(false)}
                            deleteId={ids}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col xs={12}>
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
                        <FilterModal
                            filterModalOpen={filters}
                            filterModalClose={() => setFilters(false)}
                            setFilterValue={(data) =>
                                setSearchCriteria({
                                    ...searchCriteria,
                                    newCurrentPage: 1,
                                    locationName: data.locationName,
                                    designationName: data.designationName,
                                    departmentName: data.departmentName,
                                    searchValue: "",
                                    experienceFrom: data.experienceFrom,
                                    experienceTo: data.experienceTo,
                                })
                            }
                        />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

const statusOptions = [
    {label: "True", value: true},
    {label: "False", value: false},
];

export const FilterModal = (props) => {
    const {filterModalOpen, filterModalClose, setFilterValue} = props;

    const {data: allDepartment} = useGetAllDepartments();
    const {data: allDesignation} = useGetAllDesignation();
    const {data: allLocation} = useGetAllLocations();
    const {register, handleSubmit, errors, watch, clearErrors, formState} = useForm({
        mode: "onTouched",
    });

    const experienceFromWatch = watch("experienceFrom");
    const experienceToWatch = watch("experienceTo");

    const filtertHandler = (data) => {
        setFilterValue({
            ...data,
            experienceFrom: !isNaN(data.experienceFrom) ? data.experienceFrom : "",
            experienceTo: !isNaN(data.experienceTo) ? data.experienceTo : "",
        });
        filterModalClose();
    };

    return (
        <>
            <Modal
                className="commonModal"
                show={filterModalOpen}
                onHide={filterModalClose}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className="cardCustomTitle">Filter</Modal.Title>
                </Modal.Header>
                <Modal.Body className="container">
                    <form onSubmit={handleSubmit(filtertHandler)}>
                        <Row className="my-3">
                            <Col sm={12}>
                                <label>Location</label>
                                <select
                                    className="form-control"
                                    name="locationName"
                                    ref={register({})}
                                >
                                    <option key="0" value="">
                                        Select Location
                                    </option>
                                    {allLocation &&
                                        allLocation.map((option, index) => (
                                            <option key={index + 1} value={option.id}>
                                                {option.location_name}
                                            </option>
                                        ))}
                                </select>
                            </Col>
                            <Col sm={12}>
                                <label>Designation</label>
                                <select
                                    className="form-control"
                                    name="designationName"
                                    ref={register({})}
                                >
                                    <option key="0" value="">
                                        Select Designation
                                    </option>
                                    {allDesignation &&
                                        allDesignation.map((option, index) => (
                                            <option key={index + 1} value={option.id}>
                                                {option.designation_name}
                                            </option>
                                        ))}
                                </select>
                            </Col>
                            <Col sm={12}>
                                <label>Department</label>
                                <select
                                    className="form-control"
                                    name="departmentName"
                                    ref={register({})}
                                >
                                    <option key='0' value="">Select Department</option>
                                    {allDepartment &&
                                        allDepartment.map((option, index) => (
                                            <option key={index + 1} value={option.id}>
                                                {option.department_name}
                                            </option>
                                        ))}
                                </select>
                            </Col>
                            <Col sm={6}>
                                <label className={`${errors.experienceFrom ? "text-danger" : ""}`}>
                                    Experience From
                                </label>
                                <Input
                                    type="number"
                                    placeholder="From"
                                    className="form-control"
                                    name="experienceFrom"
                                    reference={register({
                                        valueAsNumber: true,
                                        required:
                                            isNaN(experienceToWatch) && isNaN(experienceFromWatch)
                                                ? false
                                                : "Value required",
                                        validate: {
                                            lessThan: (v) => {
                                                if (v === "" && isNaN(experienceToWatch))
                                                    return true;
                                                if (experienceToWatch > Number(v)) {
                                                    clearErrors("experienceTo");
                                                }
                                                return (
                                                    experienceToWatch > Number(v) ||
                                                    `Should be less than ${
                                                        isNaN(experienceToWatch)
                                                            ? "experience to"
                                                            : experienceToWatch
                                                    }`
                                                );
                                            },
                                        },
                                    })}
                                />
                                {errors.experienceFrom && (
                                    <small className="form-text text-danger">
                                        {errors.experienceFrom.message}
                                    </small>
                                )}
                            </Col>
                            <Col sm={6}>
                                <label className={`${errors.experienceTo ? "text-danger" : ""}`}>
                                    Experience To
                                </label>
                                <Input
                                    type="number"
                                    placeholder="To"
                                    className="form-control"
                                    name="experienceTo"
                                    reference={register({
                                        valueAsNumber: true,
                                        required:
                                            isNaN(experienceToWatch) && isNaN(experienceFromWatch)
                                                ? false
                                                : "Value required",
                                        validate: {
                                            greaterThan: (v) => {
                                                if (v === "" && isNaN(experienceFromWatch))
                                                    return true;
                                                if (experienceFromWatch < Number(v)) {
                                                    clearErrors("experienceFrom");
                                                }
                                                return (
                                                    experienceFromWatch < Number(v) ||
                                                    `Should be greater than ${
                                                        isNaN(experienceFromWatch)
                                                            ? "experience from"
                                                            : experienceFromWatch
                                                    }`
                                                );
                                            },
                                        },
                                    })}
                                />
                                {errors.experienceTo && (
                                    <small className="form-text text-danger">
                                        {errors.experienceTo.message}
                                    </small>
                                )}
                            </Col>
                            <Col sm={12}>
                                <label>Status</label>
                                <select
                                    className="form-control"
                                    name="isBillable"
                                    ref={register({})}
                                >
                                    <option index="0" value="">
                                        Select Option
                                    </option>
                                    {statusOptions &&
                                        statusOptions.map((option, ix) => (
                                            <option key={`${ix}`} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                </select>
                            </Col>
                        </Row>
                        <Row className="mt-4 mb-2">
                            <Col sm={12} className="buttonSection">
                                <Button
                                    disabled={!formState.isValid}
                                    variant="primary"
                                    type="submit"
                                >
                                    Apply
                                </Button>
                                <Button variant="outline-danger" onClick={filterModalClose}>
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
export const DeleteMemberModal = (props) => {
    const {deleteModalOpen, deleteModalClose, deleteId} = props;
    const {mutateAsync} = useDeleteMembers();

    const deleteMemberHandler = (e) => {
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
                    <Modal.Title>Delete Member</Modal.Title>
                </Modal.Header>
                <Modal.Body className="container">
                    <Row className="my-3">
                        <Col sm={12}>
                            <p>Are you sure want to delete this member ?</p>
                        </Col>
                    </Row>
                    <Row className="mt-4 mb-2">
                        <Col sm={12}>
                            <div className="buttonSection">
                                <Button variant="primary" onClick={(e) => deleteMemberHandler(e)}>
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

export default MemberList;
