import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

const ProjectHealthDetail = ({ show, handleClose }) => {
    const [isOngoing, setIsOngoing] = useState(false);
     const [viewData, setViewData] = useState({
        client: "client",
        projectName: "ProjectAbc",
        projectType: "development",
        pricingModel: "fixedPrice",
        projectManager: "projectManager",
        baselineStart: "12/01/2023",
        baselineEnd: "12/01/2025",
        projectStatus: "production",
        completed: "80%",
        csatFrequency: "monthly",
        csatPeriod: "april",
        csatValue: 3.5,
        npsValue: 4,
        billableValue: 3,
        nonBillableValue: 2,
        overallStatus: "Green",
        reasonForAmber: "aaa bbbb cccc ddddd eeeeee ffffff gggggg hhhhhhh",
        openRisk: "aaa bbbb cccc ddddd eeeeee ffffff gggggg hhhhhhh",
        riskIntensity: "low",
        mitigationSteps: "abc",
        additionalComments: "aaa bbbb cccc ddddd eeeeee ffffff gggggg hhhhhhh",
      });
      const handleViewChange = (e) => {
        setViewData({ ...viewData, [e.target.name]: e.target.value });
      }
    return (
        <Modal
                show={show}
                onHide={handleClose}
                dialogClassName="custom-modal"
              >
                <Modal.Header closeButton>
                  <Modal.Title className="custom-title">Project Health Assessment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                              <option value="Client">Client 1</option>
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
                              <option value="ProjectAbc">Project ABC</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        
                      </Row>
                      <Row>
                      <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label-font">Project Type</Form.Label>
                            <Form.Select
                              name="projectType"
                              value={viewData.projectType}
                              onChange={handleViewChange}
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
                            <Form.Label className="label-font">Project Status</Form.Label>
                            <Form.Select
                              name="projectStatus"
                              value={viewData.projectStatus}
                              onChange={handleViewChange}
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
                            <Form.Label className="label-font">Pricing Model</Form.Label>
                            <Form.Select
                              name="pricingModel"
                              value={viewData.pricingModel}
                              onChange={handleViewChange}
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
                              <option value="projectManager">Project Manager</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="label-font">Baseline Start Date</Form.Label>
                            <Form.Control
                              type="date"
                              name="baselineStart"
                              value={viewData.baselineStart}
                              onChange={handleViewChange}
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
                            <Form.Label className="label-font">CSAT Frequency</Form.Label>
                            <Form.Select
                              name="csatFrequency"
                              value={viewData.csatFrequency}
                              onChange={handleViewChange}
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
                            <Form.Select
                              name="csatPeriod"
                              value={viewData.csatPeriod}
                              onChange={handleViewChange}
                            >
                              <option value="" disabled hidden>
                                Select Month
                              </option>
                              <option value="january">January</option>
                              <option value="february">February</option>
                              <option value="march">March</option>
                              <option value="april">April</option>
                              <option value="may">May</option>
                              <option value="june">June</option>
                              <option value="july">July</option>
                              <option value="august">August</option>
                              <option value="september">September</option>
                              <option value="october">October</option>
                              <option value="november">November</option>
                              <option value="december">December</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={3}>
                          <Form.Group className="mb-3">
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
                            <Form.Control
                              type="number"
                              name="nonBillableValue"
                                value={viewData.nonBillableValue}
                              placeholder="Non Billable Count"
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
                          <Form.Label className="label-font">Overall Project Status</Form.Label>
                          <Form.Select
                            name="overallStatus"
                            value={viewData.overallStatus}
                            onChange={handleViewChange}
                          >
                            <option value="" disabled hidden>
                              Amber
                            </option>
                            <option value="Amber">Amber</option>
                            <option value="Green">Green</option>
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
                          <Form.Label className="label-font">Risk Intensity</Form.Label>
                          <Form.Select
                            name="riskIntensity"
                            value={viewData.riskIntensity}
                            onChange={handleViewChange}
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
                  <Button variant="secondary" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button style={{backgroundColor: '#d95454', border: 'none'}}>
                    Delete 
                    </Button>
                  <Button variant="primary">
                    Update
                  </Button>
                </Modal.Footer>
        
              </Modal>
    )
}

export default ProjectHealthDetail;