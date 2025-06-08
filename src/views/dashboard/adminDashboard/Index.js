import React, {useState,useRef, useEffect} from "react";
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

import * as powerbi from 'powerbi-client';
import {Button, Col, Modal, Row} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import {useForm} from "react-hook-form";
import {BiFilterAlt} from "react-icons/bi";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {
    useGetAllMembers,
    useGetMembersById,
} from "../../../query/members/allMembers/allMembersQuery";
import {
    useGetAllProjectCount,
    useGetAllStatusAdmin,
    useGetProjectCountByTimeSpan,
} from "../../../query/projects/allProjects/allProjectsQuery";
import {authState} from "../../../recoil/authRecoil";
import BirthdayCard from "../../../views/commonComponent/birthdayCard/Index";
import Employee from "../../commonComponent/employee/Index";
import LeaveApply from "../../commonComponent/leaveApply/Index";
import ResignationList from "../../commonComponent/resignationList/Index";
import TopPerformer from "../../commonComponent/topPerformer/Index";
import WeatherAttendance from "../../commonComponent/weatherAttendance/Index";
import ProjectStackedChart from "../../widgets/charts/projectStackedChart/StackedChart";

import Attendance from "../../commonComponent/attendance/Index";
import HexaviewBuzz from "../../commonComponent/hexaviewBuzzSlider/Index";
import LeaveApproval from "../../commonComponent/leaveApproval/Index";
import ListOfEmployee from "../../commonComponent/listOfEmployee/Index";
import NewJoinee from "../../commonComponent/newJoinee/Index";
import QuickAccess from "../../commonComponent/quickAccess/Index";
import TodoList from "../../commonComponent/todoList/Index";
import UpcomingHolidays from "../../commonComponent/upcomingHolidays/Index";
import WorkAnniversary from "../../commonComponent/workAnniversary/Index";
import OnLeave from "../../commonComponent/onLeave/Index";
import "./style.scss";
import CommonHeading from "../commonHeading/Index";
import AssignedProjects from "../../commonComponent/assignedProjects/Index";
import CertificatesCard from "../../commonComponent/certificatesCard/Index";
import { usePowerBiReport } from "../../../query/powerBi/powerBiQuery";
import { powerBiPagesState } from "../../../recoil/powerBi";
import { useSetRecoilState } from "recoil";

const AdminDashboard = () => {

    const { data: reportToken, isLoading } = usePowerBiReport();
    // const queryString = window.location.search.substring(1);
    const [pages, setPages] = useState([]);
    const [params] = useSearchParams();
    const reportType = params.get("reportType");
    const navigate = useNavigate();
    const setPowerBiPages = useSetRecoilState(powerBiPagesState);

    const embedConfig = {
		type: 'report',
		id: "6cddb44b-fd80-439c-bd4e-bb0e53443b87",
		embedUrl: "https://app.powerbi.com/reportEmbed?reportId=6cddb44b-fd80-439c-bd4e-bb0e53443b87&groupId=8ce08a6b-ad9d-4868-a530-660e9730ab01&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLUlORElBLUNFTlRSQUwtQS1QUklNQVJZLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0IiwiZW1iZWRGZWF0dXJlcyI6eyJ1c2FnZU1ldHJpY3NWTmV4dCI6dHJ1ZX19",
		// accessToken: queryString,
        accessToken: reportToken,
        tokenType: models.TokenType.Embed,
		settings: {
		  panes: {
			filters: {
			   expanded: false,
			   visible: false,
			},
            
		  },
		  navContentPaneEnabled: false,
		},
	}

    const renderPage = async () => {
        if(reportType){
            const targetPage = pages.find((page) => page.name === reportType);
            if(targetPage){
                try {
                    await targetPage.setActive();
                    console.log("Page set to active:", targetPage.displayName);
                } catch (error) {
                    console.error("Failed to set page active", error);
                }
            }
        }
        else{
            if(pages.length > 0){
            const targetPage = pages[0];
            navigate(`?reportType=${targetPage.name}`);}
        }
    }

    const handleGetEmbeddedComponent = async (report) => {
        try {
          const pages = await report.getPages();
          let pagesBI = [];
          pages.forEach((page) => {
            pagesBI.push({
              name: page.name,
              displayName: page.displayName,
              isActive: page.isActive,
            });
          });
          setPages(pages);
          setPowerBiPages(pagesBI);
          const pageInfo = pages.map((page) => ({
            name: page.name,
            displayName: page.displayName,
            isActive: page.isActive,
          }));
          console.log("Pages info:", pageInfo);
          console.log(pageInfo);
        } catch (error) {
          console.error("Failed to get pages", error);
        }
      };

    // const navigate = useNavigate();
    // const empDetail = useRecoilValue(authState);
    // const {
    //     data: getByIdDetails,
    //     isLoading: MemberData,
    //     refetch,
    // } = useGetMembersById(empDetail && empDetail.uuid);
    // const [projectFilterModal, setProjectFilterModal] = useState(false);
    // const [filterValues, setFilterValues] = useState({});
    // const [duration, setDuration] = useState(2023);
    // const {data: allMember, isLoading} = useGetAllMembers();
    // const {data: allProjectCount, isLoadingAllProjectCount} = useGetAllProjectCount();
    // const {data: projectCountByTimeSpan} = useGetProjectCountByTimeSpan(duration);
    // const {data: projectStatus, isLoading: isProjectStatusLoading} =
    //     useGetAllStatusAdmin(filterValues);

    // const projectSummaryColumns = [
    //     {
    //         dataField: "project_name",
    //         text: "Project Name",
    //     },
    //     {
    //           dataField: 'asdf',
    //         text: "Project Status",
    //         formatter: (cellContent, row) => (
    //             <div className="projectStatus d-flex align-items-center">
    //                 <div
    //                     className="status"
    //                     style={{backgroundColor: row.end_date == null ? "#F03737" : "#6DD400"}}
    //                 ></div>
    //                 <p>{row.end_date == null ? "In Progress" : "Complete"}</p>
    //             </div>
    //         ),
    //     },
    //     {
    //         dataField: "payment_status",
    //         text: "Payment Status",
    //     },
    // ];

    // const handleEmployeeDetail = (id) => {
    //     navigate(`/members/memberDetail/${id}`);
    // };

    // const handleTotalProject = (e) => {
    //     setDuration(e.target.value);
    // };

    useEffect(() => {
        renderPage();
    },[pages, reportType])

    return (
      <>
        {
				reportToken ?
					<div className="powerBiStyle" style={{ height: '100vh', width: '100%' }}>
						<PowerBIEmbed embedConfig={embedConfig} getEmbeddedComponent={(report) => report.on("loaded", () => handleGetEmbeddedComponent(report))}/>
					</div>
					:
					<div style={{ height: '100vh', width: '100%', display:"flex" , justifyContent:'center' , alignContent:'center' }}>
						<span style={{ fontSize: '25px', fontWeight: '600' }}>Please wait...</span>
					</div>
			}

        {/* <div
          className="powerBiStyle"
          style={{ height: "100vh", width: "100%" }}
        >
          <PowerBIEmbed embedConfig={embedConfig} getEmbeddedComponent={(report) => report.on("loaded", () => handleGetEmbeddedComponent(report))} />
        </div> */}

        {/* <Row>
                <CommonHeading /> 
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="px-2 mb-3 ">
                </Col>
                
                {/* <Col xs={12} md={6} lg={8} className="px-2 mb-3 ">
                    <LeaveApply />
                </Col>
                <Col xs={12} md={6} lg={4} className="px-2 mb-3">
                    <WeatherAttendance />
                </Col>
                <Col xs={12} md={6} lg={5} className="px-2 mb-3 ">
                    <Employee />
                </Col>
                <Col xs={12} md={6} lg={7} className="px-2 mb-3 ">
                    <div className="totalProject cardShadow">
                        <div className="totalEmployeeSection">
                            <div className="title">
                                <p>
                                    Total Projects : <span>{allProjectCount}</span>
                                </p>
                            </div>
                            <div className="selctDuration">
                                <p>Year: </p>
                                <select
                                    className="form-control"
                                    name="departmentHead"
                                    onChange={(e) => {
                                        handleTotalProject(e);
                                    }}
                                >
                                    <option key="2023" value="2023">2023</option>
                                    <option key="2022" value="2022">2022</option>
                                    <option key="2021" value="2021">2021</option>
                                    <option key="2020" value="2020">2020</option>
                                    <option key="2019" value="2019">2019</option>
                                    <option key="2018" value="2018">2018</option>
                                    <option key="2017" value="2017">2017</option>
                                    <option key="2016" value="2016">2016</option>
                                    <option key="2015" value="2015">2015</option>
                                    <option key="2014" value="2014">2014</option>
                                    <option key="2013" value="2013">2013</option>
                                    <option key="2012" value="2012">2012</option>
                                    <option key="2011" value="2011">2011</option>
                                </select>
                            </div>
                        </div>
                        <div className="currentProject">
                            <p>
                                Currently Running : <span>{projectCountByTimeSpan?.length}</span>
                            </p>
                        </div>
                        <ProjectStackedChart
                            className="projectsGraph"
                            data={projectCountByTimeSpan ? projectCountByTimeSpan : []}
                        />
                    </div>
                </Col>
                <Col xs={12} md={12} lg={8} xl={6} className="px-2 mb-3">
                    <div className="projectSummary cardShadow">
                        <div className="titleSection">
                            <div className="cardCustomTitle">Project Summary</div>
                            <div className="filterSection">
                                <div className="filter" onClick={() => setProjectFilterModal(true)}>
                                    <p>Filter</p>
                                    <BiFilterAlt />
                                </div>
                            </div>
                        </div>
                        <div className="summaryTables">
                            <BootstrapTable
                                keyField="id"
                                data={projectStatus ? projectStatus : []}
                                columns={projectSummaryColumns}
                                condensed
                            />
                        </div>
                    </div>
                </Col>
                <Col sm={6} xs={12} md={6} lg={4} xl={3} className="px-2 mb-3">
                    <WorkAnniversary />
                </Col>
                <Col xs={12} sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
                    <BirthdayCard />
                </Col>
                <Col xs={12} sm={12} md={12} lg={8} xl={6} className="px-2 mb-3">
                    <HexaviewBuzz />
                </Col>
                <Col sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
                    <NewJoinee />
                </Col>
                <Col sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
                    <ListOfEmployee />
                </Col>
                <Col sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
                    <ResignationList />
                </Col>
                <Col sm={6} md={6} lg={4} xl={3} className="px-2 mb-3">
                    <TopPerformer />
                </Col>
                <Col sm={12} xs={12} md={6} lg={8} xl={6} className="px-2 mb-3">
                    <LeaveApproval />
                </Col>
                <Col sm={6} xs={12} md={6} lg={4} xl={3} className="px-2 mb-3">
                    <UpcomingHolidays />
                </Col>
                <Col sm={6} xs={12} md={6} lg={4} xl={3} className="px-2 mb-3">
                    <QuickAccess />
                </Col>
                <Col xs={12} sm={6} md={6} lg={4} xl={3} className="customCol2 px-2 mb-3">
                    <TodoList />
                </Col>
                <Col xs={12} sm={6} md={6} lg={4} xl={3} className="customCol2 px-2 mb-3">
                    <Attendance />
                </Col>
                <Col xs={12} sm={6} md={6} lg={4} xl={3} className="customCol2 px-2 mb-3">
                    <OnLeave />
                </Col>
            </Row> */}
        {/* <ProjectFilterModal
                modalOpen={projectFilterModal}
                modalClose={() => setProjectFilterModal(false)}
                filterValue={(data) => setFilterValues(data)}
            /> */}
      </>
    );
};

// export const ProjectFilterModal = (props) => {
//     const {modalOpen, modalClose, filterValue} = props;

//     const {register, handleSubmit, formState} = useForm({
//         mode: "onTouched",
//     });

//     const handleOnSubmit = (data) => {
//         filterValue(data);
//         modalClose();
//     };

//     return (
//         <>
//             <Modal className="commonModal" show={modalOpen} onHide={modalClose} centered>
//                 <Modal.Header closeButton>
//                     <div className="cardCustomTitle">Project Filter</div>
//                 </Modal.Header>
//                 <Modal.Body className="container">
//                     <Row>
//                         <Col sm={12}>
//                             <form onSubmit={handleSubmit(handleOnSubmit)}>
//                                 <Row className="my-3 gx-0">
//                                     <Col sm={12} className="mb-3">
//                                         <input
//                                             type="text"
//                                             name="project"
//                                             placeholder="Project name"
//                                             className="form-control"
//                                             ref={register({})}
//                                         />
//                                     </Col>
//                                     <Col sm={12} className="mb-3">
//                                         <select
//                                             className="form-control"
//                                             name="status"
//                                             ref={register({})}
//                                         >
//                                             <option value="">Select Project Status</option>
//                                             <option value="incompleted">In Progress</option>
//                                             <option value="completed">Complete</option>
//                                         </select>
//                                     </Col>
//                                     <Col sm={12} className="mb-3">
//                                         <select
//                                             className="form-control"
//                                             name="payment"
//                                             ref={register({})}
//                                         >
//                                             <option value="">Select Payment Status</option>
//                                             <option value="Pending">Pending</option>
//                                             <option value="Completed">Completed</option>
//                                         </select>
//                                     </Col>
//                                     <Col sm={12} className="buttonSection">
//                                         <Button
//                                             disabled={!formState.isValid}
//                                             variant="primary"
//                                             type="submit"
//                                         >
//                                             Apply
//                                         </Button>
//                                         <Button variant="outline-danger" onClick={modalClose}>
//                                             Cancel
//                                         </Button>
//                                     </Col>
//                                 </Row>
//                             </form>
//                         </Col>
//                     </Row>
//                 </Modal.Body>
//             </Modal>
//         </>
//     );
// };

export default AdminDashboard;