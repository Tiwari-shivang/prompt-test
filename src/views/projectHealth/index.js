import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Modal,
  Form,
  Pagination,
} from "react-bootstrap";
import Breadcrumb from "../../components/Breadcrumb";
import {
  AiOutlineDelete,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import "./style.scss";
import { useEffect, useState, useMemo, useCallback } from "react";
import AddProjectHealth from "./addProjectHealth";
import ProjectHealthDetail from "./projectHealthDetail";
import { useGetProjectDetailHealthByManager } from "../../query/projectHealth/projectDetailHealthManager/projectDetailHealthManagerQuery";
import { authState } from "../../recoil/authRecoil";
import { useRecoilValue } from "recoil";

const Index = () => {
  // State management with proper typing and validation
  const [deleteForm, setDeleteForm] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  
  const empDetail = useRecoilValue(authState);
  
  const { data: apiProjectHealthData, isLoading: isLoadingProjectHealthData, error: apiError } = useGetProjectDetailHealthByManager(empDetail && empDetail.uuid);
  
  const projectHealthData = useMemo(() => {
    if (!apiProjectHealthData || !Array.isArray(apiProjectHealthData)) {
      return [];
    }
  
    return [...apiProjectHealthData].sort((a, b) => b.id - a.id);
  }, [apiProjectHealthData]);
  const handleDeleteOpen = useCallback(() => setDeleteForm(true), []);
  const handleDeleteClose = useCallback(() => setDeleteForm(false), []);
  const handleShowSecond = useCallback(() => setShowSecondModal(true), []);
  const handleCloseSecond = useCallback(() => setShowSecondModal(false), []);
  const handleShowDetailModal = useCallback((project = null) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  }, []);
  const handleCloseDetailModal = useCallback(() => {
    setSelectedProject(null);
    setShowDetailModal(false);
  }, []);

  const handleProjectHealthSubmit = useCallback((formData) => {
    console.log("Received form data from modal:", formData);
    setShowSecondModal(false);
  }, []);

  const handleRowsPerPageChange = useCallback((e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= 50) {
      setRowsPerPage(value);
      setCurrentPage(1);
    }
  }, []);

  const transformedTableData = useMemo(() => {
    if (!projectHealthData || !Array.isArray(projectHealthData)) {
      return [];
    }
  
    return projectHealthData.flatMap((item) => {
      const sortedHealthList = (item.project_health_list || []).sort((a, b) => b.id - a.id); // Sort in descending order
  
      return sortedHealthList.map((health) => ({
        id: item.id,
        externalProjectId: item.project_name || "N/A",
        startDate: health?.start_date || "N/A",
        endDate: health?.end_date || "N/A",
        completion: `${item.percent_complition || 0}%`,
        overallProject: health?.over_all_project || "N/A",
        lastUpdate: health?.updated_at 
          ? new Date(health.updated_at).toLocaleDateString() 
          : "N/A",
        fullData: item
      }));
    });
  }, [projectHealthData]);
  
  
  const paginationData = useMemo(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = transformedTableData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(transformedTableData.length / rowsPerPage);
    console.log(currentRows)
    return {
      currentRows,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
      totalItems: transformedTableData.length
    };
  }, [transformedTableData, currentPage, rowsPerPage]);

  const handlePrev = useCallback(() => {
    if (paginationData.hasPrev) {
      setCurrentPage(prev => prev - 1);
    }
  }, [paginationData.hasPrev]);

  const handleNext = useCallback(() => {
    if (paginationData.hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  }, [paginationData.hasNext]);

  const handleRowClick = useCallback((project) => {
    console.log("project", project);
    // setSelectedProject(project.fullData); // fullData is still the parent project object
    // handleShowDetailModal(project.fullData);
  }, [handleShowDetailModal]);

  return (
    <>
      <Container>
        <Row>
          <Col xs={10}>
            <Breadcrumb />
          </Col>
          <Col sm={2} className="d-flex justify-content-end">
            <Button
              className="addButton"
              variant="primary"
              onClick={handleShowSecond}
            >
              <AiOutlinePlusCircle className="icon" />
              Add
            </Button>
          </Col>
        </Row>
      </Container>

      <Container className="mt-1">
        <Row className="my-2 d-flex align-items-end justify-content-between">
          <Col xs="auto">
            <div className="d-flex align-items-center">
              <span className="me-3 text-muted">
                <strong>Total Projects:</strong> {paginationData.totalItems}
              </span>
              <span className="me-3 text-muted">
                <strong>Page:</strong> {currentPage} of {paginationData.totalPages || 1}
              </span>
            </div>
          </Col>
          <Col xs="auto">
            <div className="d-flex align-items-center">
              <Form.Label htmlFor="rowsInput" className="col-form-label me-2">
                Rows per page:
              </Form.Label>
              <Form.Control
                id="rowsInput"
                type="number"
                min={1}
                max={50}
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                style={{ width: '70px' }}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="table-responsive">
              <Table striped bordered hover className="equal-width-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>% Completion</th>
                    <th>Overall Project</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingProjectHealthData ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div className="text-muted">
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Loading project health data...
                        </div>
                      </td>
                    </tr>
                  ) : apiError ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div className="text-danger">
                          <h5>Error loading data</h5>
                          <p>Unable to fetch project health data. Please try again later.</p>
                        </div>
                      </td>
                    </tr>
                  ) : paginationData.currentRows.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <div className="text-muted">
                          <h5>No project data available</h5>
                          <p>Add new projects to see them here.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginationData.currentRows.map((project, index) => (
                      <tr 
                        key={`project-${project.id}-${index}`} 
                        onClick={() => {
                          
                        }} 
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{project.externalProjectId}</td>
                        <td>{project.startDate}</td>
                        <td>{project.endDate}</td>
                        <td>{project.completion}</td>
                        <td>{project.overallProject}</td>
                        <td>{project.lastUpdate}</td>
                        {/* <td>{project.overallProject}</td> */}
                        {/* <td className="open-risk-cell">{project.openRisk}</td> */}
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>

        {paginationData.totalPages > 1 && (
          <Row>
            <Col className="d-flex justify-content-between align-items-center">
              <div className="text-muted">
                Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, paginationData.totalItems)} of {paginationData.totalItems} entries
              </div>
              <Pagination>
                <Pagination.First 
                  onClick={() => setCurrentPage(1)} 
                  disabled={!paginationData.hasPrev} 
                />
                <Pagination.Prev 
                  onClick={handlePrev} 
                  disabled={!paginationData.hasPrev} 
                />
                <Pagination.Item active>
                  {currentPage}
                </Pagination.Item>
                <Pagination.Next 
                  onClick={handleNext} 
                  disabled={!paginationData.hasNext} 
                />
                <Pagination.Last 
                  onClick={() => setCurrentPage(paginationData.totalPages)} 
                  disabled={!paginationData.hasNext} 
                />
              </Pagination>
            </Col>
          </Row>
        )}
      </Container>

      <AddProjectHealth 
        show={showSecondModal} 
        handleClose={handleCloseSecond} 
        onSubmit={handleProjectHealthSubmit} 
      />
      <ProjectHealthDetail 
        show={showDetailModal} 
        handleClose={handleCloseDetailModal}
        projectData={selectedProject}
      />
    </>
  );
};

export default Index;