import { useState, useEffect } from "react";
import { Button, Col, Form, Modal, Row, Alert, Spinner } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { authState } from "../../../recoil/authRecoil";
import { useUpdateProjectDetail } from "../../../query/projectHealth/updateProjectDetail/updateProjectDetailQuery";
import { useUpdateProjectHealth } from "../../../query/projectHealth/updateProjectHealth/updateProjectHealthQuery";
import { useQueryClient } from "react-query";
import { useGetClientDetailWithProject } from "../../../query/projectHealth/clientDetailsProject/clientDetailProjectQuery";

const ProjectHealthDetail = ({ show, handleClose, projectData }) => {
    console.log(projectData);
    const [isOngoing, setIsOngoing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const queryClient = useQueryClient();
    const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });
    
    const empDetail = useRecoilValue(authState);
    console.log(empDetail);
    const { data: clientDetails, isLoading: isLoadingClientDetails } =
        useGetClientDetailWithProject(empDetail && empDetail.uuid);
    
    // API hooks for update operations
    const updateProjectDetailMutation = useUpdateProjectDetail();
    const updateProjectHealthMutation = useUpdateProjectHealth();
    
    const [viewData, setViewData] = useState({
        client: "",
        projectName: "",
        projectType: "",
        pricingModel: "",
        projectManager: "",
        baselineStart: "",
        baselineEnd: "",
        projectStatus: "",
        completed: "",
        csatFrequency: "",
        csatPeriod: "",
        startDate:"",
        endDate:"",
        csatValue: "",
        npsValue: "",
        billableValue: "",
        nonBillableValue: "",
        resourceProjection:"",
        overallStatus: "",
        reasonForAmber: "",
        openRisk: "",
        riskIntensity: "",
        mitigationSteps: "",
        additionalComments: "",
    });

    const [ error, setError] = useState({
      projectType: false,
      pricingModel: false,
      baselineStart: false,
      csatFrequency: false,
      projectStatus:false,
      csatPeriod: false,
      startDate:false,
      endDate: false,
      overallStatus:false,
      riskIntensity:false
    })
    // Populate form data when projectData changes

    const validations = () => {
      const newErrors = {
        projectType: !viewData.projectType,
        pricingModel: !viewData.pricingModel,
        baselineStart: !viewData.baselineStart,
        csatFrequency: !viewData.csatFrequency,
        projectStatus: !viewData.projectStatus,
        csatPeriod: !viewData.csatPeriod,
        riskIntensity: !viewData.riskIntensity,
        startDate: !viewData.startDate,
        endDate: !viewData.endDate,
        overallStatus: !viewData.overallStatus,
      };
    
      setError(newErrors);
    
      return !Object.values(newErrors).includes(true);
    };
    useEffect(() => {
        if (projectData) {
            const health = projectData.project_health_list?.[0];
            
            setViewData({
                client: projectData.client || "",
                projectName: projectData.project_name || "",
                projectType: projectData.project_type || "",
                pricingModel: projectData.pricing_model || "",
                projectManager: empDetail?.uuid || "",
                baselineStart: projectData.baseline_start_date || "",
                baselineEnd: projectData.baseline_end_date || "",
                projectStatus: projectData.project_status || "",
                completed: `${projectData.percent_complition || 0}%`,
                csatFrequency: projectData.csat_frequency || "",
                csatPeriod: health?.csat_frequency || "",
                startDate:health?.start_date || "",
                endDate:health?.end_date || "",
                csatValue: health?.csat_value || "",
                npsValue: health?.nps_value || "",
                billableValue: health?.billable_count || "",
                nonBillableValue: health?.non_billable_count || "",
                resourceProjection: health?.resource_projection || "",
                overallStatus: health?.over_all_project || "",
                reasonForAmber: health?.reason_for_project_status || "",
                openRisk: health?.open_risk || "",
                riskIntensity: health?.risk_intensity || "",
                mitigationSteps: health?.migration_step || "",
                additionalComments: health?.additional_comment || "",
            });

            // Check if end date is ongoing
            setIsOngoing(!projectData.baseline_end_date);
        }
    }, [projectData, empDetail]);

    const handleViewChange = (e) => {
        setViewData({ ...viewData, [e.target.name]: e.target.value });
    };

    // Enterprise-grade data mapping for API Section 1
    const mapProjectDetailData = () => {
        // Clean percentage value - remove % sign and convert to number
        const percentCompleted = parseInt(viewData.completed.toString().replace('%', ''), 10) || 0;
        
        return {
            id: projectData?.id || 0,
            external_Project_id: projectData?.external_Project_id || "",
            project_id: projectData?.project_id || 0,
            project_type: viewData.projectType,
            pricing_model: viewData.pricingModel,
            baseline_start_date: viewData.baselineStart,
            baseline_end_date: isOngoing ? null : viewData.baselineEnd,
            percent_complition: percentCompleted,
            csat_frequency: viewData.csatFrequency,
            project_status: viewData.projectStatus
        };
    };

    // Enterprise-grade data mapping for API Section 2
    const mapProjectHealthData = () => {
        const health = projectData?.project_health_list?.[0];
        
        return {
            id: health?.id || 0,
            project_detail_id: projectData?.id || 0,
            external_project: projectData?.external_Project_id || "",
            project_id: projectData?.project_id || 0,
            csat_frequency: viewData.csatFrequency,
            csat_value: parseFloat(viewData.csatValue) || 0,
            nps_value: parseFloat(viewData.npsValue) || 0,
            billable_count: parseInt(viewData.billableValue, 10) || 0,
            non_billable_count: parseInt(viewData.nonBillableValue, 10) || 0,
            resource_projection: parseFloat(viewData.resourceProjection) || 0,
            over_all_project: viewData.overallStatus,
            reason_for_project_status: viewData.reasonForAmber,
            open_risk: viewData.openRisk,
            risk_intensity: viewData.riskIntensity,
            migration_step: viewData.mitigationSteps,
            additional_comment: viewData.additionalComments,
            start_date: viewData.baselineStart,
            end_date: isOngoing ? null : viewData.baselineEnd
        };
    };

    // Enterprise-grade sequential API update handler
    const handleUpdate = async () => {
    //   const isValid = validations(); // this runs your `validations` function and sets errors

    // if (!isValid) {
       
    //     return; // Prevent API call
    // }
        if (!projectData) {
            setUpdateStatus({ type: 'error', message: 'No project data available for update.' });
            return;
        }

        setIsUpdating(true);
        setUpdateStatus({ type: '', message: '' });
// if(!validations()){
//   return
// }
        try {
            // Step 1: Update Project Detail (Section 1)
            const projectDetailPayload = mapProjectDetailData();
            console.log('Updating Project Detail:', projectDetailPayload);
            
            const projectDetailResponse = await updateProjectDetailMutation.mutateAsync(projectDetailPayload);
            
            if (!projectDetailResponse || projectDetailResponse.error) {
                throw new Error('Failed to update project details');
            }

            // Step 2: Update Project Health (Section 2)
            const projectHealthPayload = mapProjectHealthData();
            console.log('Updating Project Health:', projectHealthPayload);
            
            const projectHealthResponse = await updateProjectHealthMutation.mutateAsync(projectHealthPayload);
            
            if (!projectHealthResponse || projectHealthResponse.error) {
                throw new Error('Failed to update project health information');
            }

            // Success handling
            setUpdateStatus({ 
                type: 'success', 
                message: 'Project details and health information updated successfully!' 
            });

            // Optional: Close modal after a brief delay to show success message
            setTimeout(() => {
                handleClose();
                setUpdateStatus({ type: '', message: '' });
                queryClient.invalidateQueries(["getProjectDetailHealthByManager", empDetail && empDetail.uuid]);
            }, 2000);

        } catch (error) {
            console.error('Update failed:', error);
            setUpdateStatus({ 
                type: 'error', 
                message: error.message || 'Failed to update project information. Please try again.' 
            });
        } finally {
            setIsUpdating(false);
        }
    };

    // Clear status messages when modal closes
    const handleModalClose = () => {
        setUpdateStatus({ type: '', message: '' });
        handleClose();
    };

    return (
        <Modal
                show={show}
                onHide={handleModalClose}
                dialogClassName="custom-modal"
              >
                <Modal.Header closeButton>
                  <Modal.Title className="custom-title">Project Health Assessment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {/* Status Alert */}
                  {updateStatus.message && (
                    <Alert 
                      variant={updateStatus.type === 'success' ? 'success' : 'danger'}
                      className="mb-3"
                    >
                      {updateStatus.message}
                    </Alert>
                  )}
                  
                  <Form>
                    <section className="border-bottom mb-3">
                    <h3 className="section-heading">Project Essentials</h3>
                      <Row>
                        <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label-font">Client</Form.Label>
                            <Form.Select
                              name="client"
                              value={viewData.client}
                              onChange={handleViewChange}
                            >
                              <option value="" disabled hidden>
                                Client Name
                              </option>
                              <option value="66110000014715047">Hexaview</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label-font">Project Name</Form.Label>
                            <Form.Select
                              name="projectName"
                              value={viewData.projectName}
                              onChange={handleViewChange}
                            >
                              <option value="" disabled hidden>
                                Select Project
                              </option>
                              <option value="66110000016944335">HVT - Developer Productivity Platform</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        
                      </Row>
                      <Row>
                      <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label-font">Project Type *</Form.Label>
                            <Form.Select
                              name="projectType"
                              value={viewData.projectType}
                              onChange={handleViewChange}
                              error={error.projectType}
                              className={error.projectType ? "is-invalid" : ""} // Add error class if needed
                            >
                              <option value="" disabled hidden>
                                Select Project Type
                              </option>
                              <option value="development">Development</option>
                              <option value="implementation">Implementation</option>
                              <option value="consulting">Consulting</option>
                              <option value="training">Training</option>
                              <option value="support">Maintenance & Support</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label-font">Project Status *</Form.Label>
                            <Form.Select
                              name="projectStatus"
                              value={viewData.projectStatus}
                              onChange={handleViewChange}
                              error={error.projectStatus}
                              className={error.projectStatus ? "is-invalid" : ""} // Add error class if needed
                            >
                              <option value="" disabled hidden>
                                Select Project Status
                              </option>
                              <option value="Development">Development</option>
                              <option value="hyperCare">Hyper Care</option>
                              <option value="qa">QA/UAT</option>
                              <option value="support">Support & Maintenance</option>
                              <option value="requirement">Requirement Gathering</option>
                              <option value="production">Production Release</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label-font">Pricing Model *</Form.Label>
                            <Form.Select
                              name="pricingModel"
                              value={viewData.pricingModel}
                              onChange={handleViewChange}
                              error={error.pricingModel}
                              className={error.pricingModel ? "is-invalid" : ""} // Add error class if needed
                            >
                              <option value="" disabled hidden>
                                Select Pricing Model
                              </option>
                              <option value="tm">T&M</option>
                              <option value="fixedPrice">Fixed price</option>
                              <option value="staffAug">Staff Aug</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label-font">Project Manager</Form.Label>
                            <Form.Select
                              name="projectManager"
                              value={viewData.projectManager}
                              onChange={handleViewChange}
                            >
                              <option value="" disabled hidden>
                                Select Project Manager
                              </option>
                              {empDetail ? (
                                <option value={empDetail.uuid}>
                                  {empDetail.first_name} {empDetail.last_name}
                                </option>
                              ) : (
                                <option value="default" disabled>
                                  Loading...
                                </option>
                              )}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label-font">Baseline Start Date *</Form.Label>
                            <Form.Control
                              type="date"
                              name="baselineStart"
                              value={viewData.baselineStart}
                              onChange={handleViewChange}
                              error={error.baselineStart}
                              className={error.baselineStart ? "is-invalid" : ""} // Add error class if needed
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <div
                              className="d-flex align-items-center justify-content-between"
                              style={{ marginBottom: "7px" }}
                            >
                              <Form.Label className="me-2 mb-0 label-font">
                                Baseline End Date
                              </Form.Label>
                              <Form.Check
                                type="checkbox"
                                id="baselineOngoing"
                                label="Ongoing"
                                className="mb-0"
                                checked={isOngoing}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setIsOngoing(checked);
                                  if (checked) {
                                    // Clear date if checkbox is checked
                                    setViewData((prev) => ({
                                      ...prev,
                                      baselineEnd: "",
                                    }));
                                  }
                                }}
                              />
                            </div>
                            <Form.Control
                              type="date"
                              name="baselineEnd"
                              value={viewData.baselineEnd}
                              onChange={handleViewChange}
                              disabled={isOngoing}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label-font">% Completed</Form.Label>
                            <Form.Control
                              type="text"
                              name="completed"
                              value={viewData.completed}
                              onChange={handleViewChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label-font">CSAT Frequency *</Form.Label>
                            <Form.Select
                              name="csatFrequency"
                              value={viewData.csatFrequency}
                              onChange={handleViewChange}
                              error={error.csatFrequency}
                              className={error.csatFrequency ? "is-invalid" : ""} // Add error class if needed
                            >
                              <option value="" disabled hidden>
                                Select Frequency
                              </option>
                              <option value="ann">Annually</option>
                              <option value="quar">Quarterly</option>
                              <option value="monthly">Monthly</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </section>
                    <section className="custom-section-border mb-3">
                    <h3 className="section-heading">Progress Metrics</h3>
                      <Row>
                        <Col xs={3}>
                          <Form.Group className="mb-3">
                          <Form.Label className="label-font">CSAT Frequency *</Form.Label>
                            <Form.Select
                              name="csatPeriod"
                              value={viewData.csatPeriod}
                              onChange={handleViewChange}
                              error={error.csatPeriod}
                              className={error.csatPeriod ? "is-invalid" : ""} // Add error class if needed
                            >
                              <option value="" disabled hidden>
                      Select Frequency
                    </option>
                    <option value="ann">Annually</option>
                    <option value="quar">Quarterly</option>
                    <option value="monthly">Monthly</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col xs={3}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label-font">Start Date *</Form.Label>
                            <Form.Control
                              type="date"
                              name="startDate"
                              value={viewData.startDate}
                              onChange={handleViewChange}
                              error={error.startDate}
                              className={error.startDate ? "is-invalid" : ""} // Add error class if needed
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={3}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label-font">End Date *</Form.Label>
                            <Form.Control
                              type="date"
                              name="endDate"
                              value={viewData.endDate}
                              onChange={handleViewChange}
                              error={error.endDate}
                              className={error.endDate ? "is-invalid" : ""} // Add error class if needed
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={3}>
                          <Form.Group className="mb-3">
                          <Form.Label className="label-font">CAST Value</Form.Label>
                            <Form.Control
                              type="number"
                              name="csatValue"
                              value={viewData.csatValue}
                              onChange={handleViewChange}
                              placeholder="CSAT Value"
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={3}>
                          <Form.Group className="mb-3">
                          <Form.Label className="label-font">NPS Value</Form.Label>
                            <Form.Control
                              type="number"
                              name="npsValue"
                              value={viewData.npsValue}
                              onChange={handleViewChange}
                              placeholder="NPS Value"
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={3}>
                          <Form.Group className="mb-3">
                          <Form.Label className="label-font">Billable Count</Form.Label>
                            <Form.Control
                              type="number"
                              name="billableValue"
                                value={viewData.billableValue}
                                onChange={handleViewChange}
                              placeholder="Billable Count"
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={3}>
                          <Form.Group className="mb-3">
                          <Form.Label className="label-font">Non Billable Count</Form.Label>
                            <Form.Control
                              type="number"
                              name="nonBillableValue"
                                value={viewData.nonBillableValue}
                              placeholder="Non Billable Count"
                              onChange={handleViewChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                      <Col xs={3}>
                          <Form.Group className="mb-3">
                          <Form.Label className="label-font">Resource Projection</Form.Label>
                            <Form.Control
                              type="number"
                              name="resourceProjection"
                                value={viewData.resourceProjection}
                              placeholder="Resource Projection"
                              onChange={handleViewChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </section>
                    <section className="custom-section-border mb-3">
                    <h3 className="section-heading">Project Health</h3>
                    <Row>
                    
                      <Col xs={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="label-font">Overall Project Status *</Form.Label>
                          <Form.Select
                            name="overallStatus"
                            value={viewData.overallStatus}
                            onChange={handleViewChange}
                            error={error.overallStatus}
                              className={error.overallStatus ? "is-invalid" : ""} // Add error class if needed
                          >
                            <option value="" disabled hidden>
                              Amber
                            </option>
                            <option value="Amber">Amber</option>
                            <option value="Green">Green</option>
                            <option value="Red">Red</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col xs={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="label-font">Reason for Amber/Red</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="reasonForAmber"
                            value={viewData.reasonForAmber}
                            onChange={handleViewChange}
                            placeholder="Reason for Amber/Red"
                          />
                        </Form.Group>
                      </Col>
                      
                    </Row>
                    </section>
                    <section className="custom-section-border mb-3">
                    <h3 className="section-heading">Risk Assessment</h3>
                    <Row>
                        
                      <Col xs={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="label-font">Risk Intensity *</Form.Label>
                          <Form.Select
                            name="riskIntensity"
                            value={viewData.riskIntensity}
                            onChange={handleViewChange}
                            error={error.riskIntensity}
                              className={error.riskIntensity ? "is-invalid" : ""} // Add error class if needed
                          >
                            <option value="" disabled>
                              Select Risk Intensity
                            </option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    <Col xs={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="label-font">Open risk</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="openRisk"
                            value={viewData.openRisk}
                            onChange={handleViewChange}
                            placeholder="Risk description"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    </section>
                    <section >
                        <h3 className="section-heading">Action Plan & Remarks</h3>
                    <Row>
                    <Col xs={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="label-font">Mitigation Steps</Form.Label>
                          <Form.Control
                            type="text"
                            name="mitigationSteps"
                            value={viewData.mitigationSteps}
                            onChange={handleViewChange}
                            placeholder="Enter mitigation steps"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="label-font">Additional Comments</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="additionalComments"
                            value={viewData.additionalComments}
                            onChange={handleViewChange}
                            placeholder="Enter comments"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    </section>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button 
                    variant="secondary" 
                    onClick={handleModalClose}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button 
                    style={{backgroundColor: '#d95454', border: 'none'}}
                    disabled={isUpdating}
                  >
                    Delete 
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={handleUpdate}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Updating...
                      </>
                    ) : (
                      'Update'
                    )}
                  </Button>
                </Modal.Footer>
        
              </Modal>
    )
}

export default ProjectHealthDetail;