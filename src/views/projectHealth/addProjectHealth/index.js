import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useCreateProjectHealth } from "../../../query/projectHealth/addProjectHealth/addProjectHealthQuery";
import { useRecoilValue } from "recoil";
import { authState } from "../../../recoil/authRecoil";
import { useGetClientDetailWithProject } from "../../../query/projectHealth/clientDetailsProject/clientDetailProjectQuery";
import { useCreateProjectDetail } from "../../../query/projectHealth/addProjectDetail/addProjectDetailQuery";
import { useQueryClient } from "react-query";

const AddProjectHealth = ({ show, handleClose, onSubmit }) => {
  const empDetail = useRecoilValue(authState);
  const [errorStepOne, setErrorStepOne] = useState({
    project_type: false,
    project_status: false,
    pricing_model: false,
    baseline_start_date: false,
    csat_frequency: false,
  });
  const [errorStepTwo, setErrorStepTwo] = useState({
    csat_frequency: false,
    start_date: false,
    end_date: false,
    over_all_project: false
  });
  const [errorStepThree, setErrorStepThree] = useState({
    risk_intensity: false
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isOngoing, setIsOngoing] = useState(false);
  const handleBack = () => setCurrentStep((prev) => prev - 1);
  const queryClient = useQueryClient();
  const { data: clientDetails, isLoading: isLoadingClientDetails } =
    useGetClientDetailWithProject(empDetail && empDetail.uuid);
  const {
    mutateAsync: addProjectHealthAsync,
    isLoading: isLoadingAddProjectHealth,
  } = useCreateProjectHealth();
  const {
    mutateAsync: addProjectDetailAsync,
    isLoading: isLoadingAddProjectDetail,
  } = useCreateProjectDetail();

  const validationStep1 = () => {
    const newErrors = {
      project_type: !projectDetails.project_type,
      project_status: !projectDetails.project_status,
      pricing_model: !projectDetails.pricing_model,
      baseline_start_date: !projectDetails.baseline_start_date,
      csat_frequency: !projectDetails.csat_frequency,
    };
  
    setErrorStepOne(newErrors);
  
    return !Object.values(newErrors).includes(true);
  };
  

  const validationStep2 = () => {
    const newErrors = {
      csat_frequency: !projectDets.csat_frequency,
      start_date: !projectDets.start_date,
      end_date: !projectDets.end_date,
      over_all_project: !projectDets.over_all_project
    };
  
    setErrorStepTwo(newErrors);
  
    return !Object.values(newErrors).includes(true);
  };

  const validationStep3 = () => {
    const newErrors = {
      risk_intensity: !projectDets.risk_intensity
    };
  
    setErrorStepThree(newErrors);
  
    return !Object.values(newErrors).includes(true);
  }
  

  const [projectDetails, setProjectDetails] = useState({
    external_Project_id: "",
    project_id: "",
    project_type: "",
    pricing_model: "",
    baseline_start_date: "",
    baseline_end_date: "",
    percent_complition: "",
    csat_frequency: "",
    project_status: "",
  });
  const [projectDets, setProjectDets] = useState({
    project_detail_id: "",
    external_id: "",
    project_id: "",
    csat_frequency: "",
    csat_value: null,
    nps_value: null,
    billable_count: null,
    non_billable_count: null,
    resource_projection: null,
    over_all_project: "",
    reason_for_status: "",
    risk_intensity: "",
    open_risk: "",
    migration_step: "",
    additional_comment: "",
    start_date: "",
    end_date: "",
  });

  const handleCancel = () => {
    setCurrentStep(1);
    setProjectDetails({
      external_Project_id: "",
      project_id: "",
      project_type: "",
      pricing_model: "",
      baseline_start_date: "",
      baseline_end_date: "",
      percent_complition: "",
      csat_frequency: "",
      project_status: "",
    });
    setProjectDets({
      project_detail_id: "",
      external_id: "",
      project_id: "",
      csat_frequency: "",
      csat_value: null,
      nps_value: null,
      billable_count: null,
      non_billable_count: null,
      over_all_project: "",
      reason_for_status: "",
      risk_intensity: "",
      open_risk: "",
      migration_step: "",
      additional_comment: "",
      start_date: "",
      end_date: "",
    });
    handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(projectDetails);
    if (currentStep < 3) {
      if(currentStep === 1 && !validationStep1()) {
        return; // Stop submission if validation fails
      }
      if(currentStep === 2 && !validationStep2()){
        return;
      }
      else{
        setCurrentStep((prev) => prev + 1);
      }
      
    } else {
      if(currentStep === 3 && !validationStep3()){
        return;
      }
      try {
        // Search through clientDetails to find matching external_project_id
        let foundExternalProjectId = projectDetails.project_id;

        for (const client of clientDetails) {
          const matchingProject = client.external_projects?.find(
            (project) =>
              project.id.toString() === projectDetails.project_id.toString()
          );
          if (matchingProject) {
            foundExternalProjectId = matchingProject.external_project_id;
            break;
          }
        }

        // Update projectDetails with found external_project_id
        const updatedProjectDetails = {
          ...projectDetails,
          external_Project_id: foundExternalProjectId,
        };

        setProjectDetails(updatedProjectDetails);
        console.log(updatedProjectDetails);
        let requestBody = { ...updatedProjectDetails };
        console.log(clientDetails);
        const res = await addProjectDetailAsync(updatedProjectDetails);

        // Extract values from response
        const {
          id: project_detail_id,
          external_Project_id,
          project_id
          // baseline_start_date,
          // baseline_end_date,
        } = res;

        // Construct second payload
        const projectHealthPayload = {
          ...projectDets,
          project_detail_id,
          external_id: external_Project_id,
          project_id
          // start_date: baseline_start_date,
          // end_date: baseline_end_date,
        };

        // Second API call: create project health
        await addProjectHealthAsync(projectHealthPayload);

        // Final cleanup
        handleClose();
        setCurrentStep(1);
        queryClient.invalidateQueries([
          "getProjectDetailHealthByManager",
          empDetail && empDetail.uuid,
        ]);
      } catch (error) {
        console.error("Error submitting project:", error);
        // Optionally show error UI here
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    if (name === "external_Project_id" || name === "project_id") {
      const selectedClient = clientDetails.find(
        (c) => c.external_client_id.toString() === value
      );
      const firstProject = selectedClient?.external_projects?.[0];

      setProjectDetails((prev) => ({
        ...prev,
        external_Project_id: value,
        project_id: firstProject?.id || "", // ✅ use the actual `id`
      }));
    }  else {
      setProjectDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleProjectDetsChange = (e) => {
    const { name, value } = e.target;

    setProjectDets((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const StepIndicator = ({ currentStep }) => {
    const steps = {
      1: "Project Essentials",
      2: "Progress Metrics & Project Health",
      3: "Risk Assessment & Action Plans",
    };

    const stepKeys = Object.keys(steps);

    return (
      <div className="stepper-container">
        {stepKeys.map((step, index) => {
          const stepNumber = parseInt(step);
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={step} className="step-wrapper">
              <div
                className={`step-circle 
                  ${isCompleted ? "completed" : ""}
                  ${isActive ? "active" : ""}
                  ${isUpcoming ? "upcoming" : ""}
                `}
              >
                {stepNumber}
              </div>
              <div className="step-label">{steps[step]}</div>

              {/* Render connecting line except after last step */}
              {index !== stepKeys.length - 1 && (
                <div
                  className={`step-line ${
                    currentStep > stepNumber ? "active" : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="section-heading">Project Essentials</h3>
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="label-font">Client</Form.Label>
                  <Form.Select
                    name="external_Project_id"
                    value={projectDetails.external_Project_id}
                    onChange={handleChange}
                    disabled={isLoadingClientDetails}
                  >
                    <option value="" disabled hidden>
                      Client Name
                    </option>
                    {clientDetails?.map((client) => (
                      <option
                        key={client.external_client_id}
                        value={client.external_client_id}
                      >
                        {client.client_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="label-font">Project Name</Form.Label>
                  <Form.Select
                    name="project_id"
                    value={projectDetails.project_id}
                    onChange={handleChange}
                    disabled={
                      isLoadingClientDetails ||
                      !projectDetails.external_Project_id
                    }
                  >
                    <option value="" disabled hidden>
                      Select Project
                    </option>
                    {clientDetails
                      ?.find(
                        (c) =>
                          c.external_client_id.toString() ===
                          projectDetails.external_Project_id.toString()
                      )
                      ?.external_projects?.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.project_name}{" "}
                          {/* ✅ display readable name */}
                        </option>
                      ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="label-font">Project Type *</Form.Label>
                  <Form.Select
                    name="project_type"
                    error={errorStepOne.project_type}
                    value={projectDetails.project_type}
                    onChange={handleChange}
                    className={errorStepOne.project_type ? "is-invalid" : ""} // Add error class if needed
                    required
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
                <Form.Group className="mb-2">
                  <Form.Label className="label-font">Project Status *</Form.Label>
                  <Form.Select
                    name="project_status"
                    error={errorStepOne.project_status}
                    className={errorStepOne.project_status ? "is-invalid" : ""}
                    value={projectDetails.project_status}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled hidden>
                      Select Project Status
                    </option>
                    <option value="development">Development</option>
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
                <Form.Group className="mb-2">
                  <Form.Label className="label-font">Pricing Model *</Form.Label>
                  <Form.Select
                    name="pricing_model"
                    error={errorStepOne.pricing_model}
                    className={errorStepOne.pricing_model ? "is-invalid" : ""}
                    value={projectDetails.pricing_model}
                    onChange={handleChange}
                  >
                    <option value="" disabled hidden>
                      Select Pricing Model
                    </option>
                    <option value="t&m">T&M</option>
                    <option value="fixedPrice">Fixed price</option>
                    <option value="staffAug">Staff Aug</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="label-font">
                    Project Manager
                  </Form.Label>
                  <Form.Select
                    name="projectManager"
                    value={empDetail?.uuid || ""}
                  >
                    <option value={empDetail?.uuid}>
                      {empDetail?.first_name || "Project Manager"}
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="label-font">
                    Baseline Start Date *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="baseline_start_date"
                    error={errorStepOne.baseline_start_date}
                    className={
                      errorStepOne.baseline_start_date ? "is-invalid" : ""  }// Add error class if needed
                    value={projectDetails.baseline_start_date}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
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
                          setProjectDetails((prev) => ({
                            ...prev,
                            baseline_end_date: "",
                          }));
                        }
                      }}
                    />
                  </div>
                  <Form.Control
                    type="date"
                    name="baseline_end_date"
                    value={projectDetails.baseline_end_date}
                    onChange={handleChange}
                    disabled={isOngoing}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="label-font">% Completed</Form.Label>
                  <Form.Control
                    type="text"
                    name="percent_complition"
                    value={projectDetails.percent_complition}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label className="label-font">CSAT Frequency *</Form.Label>
                  <Form.Select
                    name="csat_frequency"
                    error={errorStepOne.csat_frequency}
                    className={
                      errorStepOne.csat_frequency ? "is-invalid" : ""  }// Add error class if needed         
                    value={projectDetails.csat_frequency}
                    onChange={handleChange}
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
          </>
        );
      case 2:
        return (
          <>
            <h3 className="section-heading mb-4">
              Progress Metrics & Project Health
            </h3>
            <Row>
              <Col xs={3}>
                <Form.Group className="mb-2">
                <Form.Label className="label-font">
                    CSAT Frequency *
                  </Form.Label>
                  <Form.Select
                    name="csat_frequency"
                    value={projectDets.csat_frequency}
                    onChange={handleProjectDetsChange}
                    error={errorStepTwo.csat_frequency}
                    className={errorStepTwo.csat_frequency ? "is-invalid" : ""} // Add error class if needed
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
                <Form.Group className="mb-2">
                  <Form.Label className="label-font">
                    Start Date *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date"
                    error={errorStepTwo.start_date} 
                    className={
                      errorStepTwo.start_date ? "is-invalid" : "" // Add error class if needed
                    }
                    value={projectDets.start_date}
                    onChange={handleProjectDetsChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={3}>
                <Form.Group className="mb-2">
                  <Form.Label className="label-font">
                    End Date *
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={projectDets.end_date}
                    error={errorStepTwo.end_date}
                    className={   
                      errorStepTwo.end_date ? "is-invalid" : "" // Add error class if needed
                    }
                    onChange={handleProjectDetsChange}
                  />
                </Form.Group>
              </Col>
              
            </Row>
            <Row>
              <Col xs={3}>
                <Form.Group className="mb-2">
                <Form.Label className="label-font">
                    CSAT Value
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="csat_value"
                    value={projectDets.csat_value}
                    onChange={handleProjectDetsChange}
                    placeholder="CSAT Value"
                  />
                </Form.Group>
              </Col>
              <Col xs={3}>
                <Form.Group className="mb-2">
                <Form.Label className="label-font">
                    NPS Value
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="nps_value"
                    value={projectDets.nps_value}
                    onChange={handleProjectDetsChange}
                    placeholder="NPS Value"
                  />
                </Form.Group>
              </Col>
              <Col xs={3}>
                <Form.Group className="mb-2">
                <Form.Label className="label-font">
                    Billable Count
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="billable_count"
                    value={projectDets.billable_count}
                    onChange={handleProjectDetsChange}
                    placeholder="Billable Count"
                  />
                </Form.Group>
              </Col>
              <Col xs={3}>
                <Form.Group className="mb-2">
                <Form.Label className="label-font">
                    Non Billable Count
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="non_billable_count"
                    value={projectDets.non_billable_count}
                    onChange={handleProjectDetsChange}
                    placeholder="Non Billable Count"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
            <Col xs={3}>
                <Form.Group className="mb-3">
                <Form.Label className="label-font">
                Resource Projection
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="resource_projection"
                    value={projectDets.resource_projection}
                    onChange={handleProjectDetsChange}
                    placeholder="Resource Projection"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Group >
                  <Form.Label className="label-font">
                    Overall Project Status *
                  </Form.Label>
                  <Form.Select
                    name="over_all_project"
                    value={projectDets.over_all_project}
                    error={errorStepTwo.over_all_project}
                    className={ 
                      errorStepTwo.over_all_project ? "is-invalid" : "" // Add error class if needed  
                    }
                    onChange={handleProjectDetsChange}
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
                <Form.Group className="mb-2">
                  <Form.Label className="label-font">
                    Reason for Amber/Red
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="reason_for_status"
                    value={projectDets.reason_for_status}
                    onChange={handleProjectDetsChange}
                    placeholder="Reason for Amber/Red"
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="section-heading mb-4">
              Risk Assessment & Action Plans
            </h3>
            <Row className="mb-4">
              <Col xs={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="label-font">Risk Intensity *</Form.Label>
                  <Form.Select
                    name="risk_intensity"
                    value={projectDets.risk_intensity}
                    onChange={handleProjectDetsChange}
                    error={errorStepThree.risk_intensity}
                    className={errorStepThree.risk_intensity ? "is-invalid" : ""} // Add error class if needed
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
                <Form.Group className="mb-4">
                  <Form.Label className="label-font">Open risk</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="open_risk"
                    value={projectDets.open_risk}
                    onChange={handleProjectDetsChange}
                    placeholder="Risk description"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label className="label-font">
                    Mitigation Steps
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="migration_step"
                    value={projectDets.migration_step}
                    onChange={handleProjectDetsChange}
                    placeholder="Enter mitigation steps"
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label className="label-font">
                    Additional Comments
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="additional_comment"
                    value={projectDets.additional_comment}
                    onChange={handleProjectDetsChange}
                    placeholder="Enter comments"
                  />
                </Form.Group>
              </Col>
            </Row>
          </>
        );
      default:
        return null;
    }
  };
  useEffect(() => {
    if (clientDetails?.length && !projectDetails.external_Project_id) {
      const firstClient = clientDetails[0];
      const firstProject = firstClient.external_projects?.[0];

      setProjectDetails((prev) => ({
        ...prev,
        external_Project_id: firstClient.external_client_id,
        project_id: firstProject?.id || "", // ✅ store the actual `id` now
      }));
    }
  }, [clientDetails]);

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
      <Modal.Header>
        <StepIndicator currentStep={currentStep} />
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {renderStep()}

          {/* <div className="d-flex justify-content-between mt-1">
    
  </div> */}
        </Modal.Body>
        <Modal.Footer>
          <>
            <Button variant="secondary" type="button" onClick={handleCancel}>
              Cancel
            </Button>
            {currentStep > 1 && (
              <Button variant="secondary" type="button" onClick={handleBack}>
                Back
              </Button>
            )}

            <Button
              variant={currentStep < 3 ? "primary" : "success"}
              type="submit"
              onClick={handleSubmit}
            >
              {currentStep < 3 ? "Next" : "Submit"}
            </Button>
          </>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
export default AddProjectHealth;
