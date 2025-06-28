import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import "./style.scss";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useCreateSkill } from "../../../query/skillManagement/addSkill/addSkillQuery";
import { useGetAllSkills } from "../../../query/skillManagement/getSkill/getSkillQuery";

// Constants
const MODAL_MODES = {
  ADD: 'add',
  VIEW: 'view', 
  EDIT: 'edit'
};

const SKILL_TYPES = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' }
];

const PROFICIENCY_LEVELS = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' }
];

// Initial form state
const getInitialFormState = () => ({
  employee_uuid: "",
  skill_uuid: "",
  skill_name: "",
  certificate_uuid: "",
  is_certified: false,
  skill_rating_by_pm: "",
  skills_remarks: "",
  remark_date: "",
  proficiency_level: "",
  skill_version: "",
  skill_type: "",
  start_date: "",
  end_date: "",
  certificate_name: "",
  certificate: ""
});

const AddSkill = ({ show, handleClose, selectedSkill, mode, setMode }) => {
  // State management
  const [formData, setFormData] = useState(getInitialFormState());
  const [showCertificateFields, setShowCertificateFields] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);

  // API hooks
  const { mutateAsync: createSkillAsync, isLoading: isLoadingCreateSkill } = useCreateSkill();
  const { data: skillsData, isLoading: isLoadingSkills } = useGetAllSkills();

  // Computed values
  const isViewMode = mode === MODAL_MODES.VIEW;
  const isEditMode = mode === MODAL_MODES.EDIT;
  const isAddMode = mode === MODAL_MODES.ADD;
  const isFieldsDisabled = isViewMode;

  // Modal title computation
  const modalTitle = useMemo(() => {
    if (isAddMode) return 'Add Skill';
    if (selectedSkill?.skill_name) return selectedSkill.skill_name;
    return 'Skill Details';
  }, [isAddMode, selectedSkill?.skill_name]);

  // Form data population effect
  useEffect(() => {
    if (selectedSkill && !isAddMode) {
      const populatedData = {
        employee_uuid: selectedSkill.employee_uuid || "",
        skill_uuid: selectedSkill.skill_uuid || "",
        skill_name: selectedSkill.skill_name || "",
        certificate_uuid: selectedSkill.certificate_uuid || "",
        is_certified: selectedSkill.is_certified || false,
        skill_rating_by_pm: selectedSkill.skill_rating_by_pm || "",
        skills_remarks: selectedSkill.skills_remarks || "",
        remark_date: selectedSkill.remark_date || "",
        proficiency_level: selectedSkill.proficiency_level || "",
        skill_version: selectedSkill.skill_version || "",
        skill_type: selectedSkill.skill_type || "",
        start_date: selectedSkill.start_date || "",
        end_date: selectedSkill.end_date || "",
        certificate_name: selectedSkill.certificate_name || "",
        certificate: selectedSkill.certificate || ""
      };
      
      setFormData(populatedData);
      setOriginalFormData(populatedData);
      setShowCertificateFields(selectedSkill.is_certified || false);
    } else if (isAddMode) {
      const initialData = getInitialFormState();
      setFormData(initialData);
      setOriginalFormData(null);
      setShowCertificateFields(false);
    }
  }, [selectedSkill, mode, isAddMode]);

  // Form change handler
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  // Certificate checkbox handler
  const handleCertifiedChange = useCallback((e) => {
    const isChecked = e.target.checked;
    setShowCertificateFields(isChecked);
    handleChange(e);
  }, [handleChange]);

  // Form submission handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!isAddMode) return;

    try {
      const submissionData = {
        ...formData,
        skill_rating_by_pm: parseFloat(formData.skill_rating_by_pm) || 0,
        is_certified: showCertificateFields,
      };

      // Remove certificate fields if not certified
      if (!showCertificateFields) {
        delete submissionData.certificate_uuid;
        delete submissionData.certificate_name;
        delete submissionData.certificate;
      }

      await createSkillAsync(submissionData);
      
      // Reset and close on success
      setFormData(getInitialFormState());
      setShowCertificateFields(false);
      setOriginalFormData(null);
      handleClose();
      
    } catch (error) {
      console.error("Error creating skill:", error);
    }
  }, [formData, showCertificateFields, createSkillAsync, handleClose, isAddMode]);

  // Mode change handlers
  const handleEditClick = useCallback(() => {
    setMode(MODAL_MODES.EDIT);
  }, [setMode]);

  const handleUpdateClick = useCallback(() => {
    // TODO: Implement update functionality
    console.log('Update skill:', formData);
    // After update API call, switch back to view mode
    // setMode(MODAL_MODES.VIEW);
  }, [formData]);

  const handleDeleteClick = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      console.log('Delete skill:', selectedSkill);
      // TODO: Implement delete API call
      handleClose();
    }
  }, [selectedSkill, handleClose]);

  const handleCancelClick = useCallback(() => {
    if (isEditMode) {
      // Reset to original data and switch to view mode
      if (originalFormData) {
        setFormData(originalFormData);
        setShowCertificateFields(originalFormData.is_certified || false);
      }
      setMode(MODAL_MODES.VIEW);
    } else {
      // Close modal for view/add modes
      handleClose();
    }
  }, [isEditMode, originalFormData, setMode, handleClose]);

  // Render form field with consistent styling
  const renderFormField = (label, name, type = "text", options = null, required = false) => (
    <Form.Group className="mb-2">
      <Form.Label className="label-font">
        {label} {required && '*'}
      </Form.Label>
      {type === 'select' ? (
        <Form.Select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          disabled={isFieldsDisabled}
        >
          <option value="">{`Select ${label}`}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      ) : (
        <Form.Control
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          disabled={isFieldsDisabled}
        />
      )}
    </Form.Group>
  );

  // Render action buttons based on mode
  const renderActionButtons = () => {
    if (isAddMode) {
      return (
        <>
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit}
            disabled={isLoadingCreateSkill}
            style={{ fontSize: "14px" }}
          >
            {isLoadingCreateSkill ? "Adding..." : "Add Skill"}
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={handleClose}
            disabled={isLoadingCreateSkill}
            style={{ fontSize: "14px" }}
          >
            Cancel
          </Button>
        </>
      );
    }

    if (isViewMode) {
      return (
        <>
          <Button
            variant="primary"
            type="button"
            onClick={handleEditClick}
            style={{ fontSize: "14px" }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={handleDeleteClick}
            style={{ fontSize: "14px" }}
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={handleCancelClick}
            style={{ fontSize: "14px" }}
          >
            Cancel
          </Button>
        </>
      );
    }

    if (isEditMode) {
      return (
        <>
          <Button
            variant="primary"
            type="button"
            onClick={handleUpdateClick}
            style={{ fontSize: "14px" }}
          >
            Update
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={handleCancelClick}
            style={{ fontSize: "14px" }}
          >
            Cancel
          </Button>
        </>
      );
    }

    return null;
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="custom-modal-skill"
    >
      <Modal.Header className="custom-modal-header">
        <Modal.Title style={{ fontSize: "18px" }}>{modalTitle}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ height: "480px", overflowY: "auto" }}>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label className="label-font">Skill Name *</Form.Label>
                <Form.Select
                  name="skill_uuid"
                  value={formData.skill_uuid}
                  onChange={handleChange}
                  disabled={isLoadingSkills || isFieldsDisabled}
                >
                  <option value="">
                    {isLoadingSkills ? "Loading..." : "Select Skill"}
                  </option>
                  {skillsData?.map((skill) => (
                    <option key={skill.skill_uuid} value={skill.skill_uuid}>
                      {skill.skill_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col xs={6}>
              {renderFormField("Skill Version", "skill_version", "text", null, true)}
            </Col>

            <Col xs={6}>
              {renderFormField("Skill Type", "skill_type", "select", SKILL_TYPES, true)}
            </Col>

            <Col xs={6}>
              {renderFormField("Skill Rating By RM", "skill_rating_by_pm", "text", null, true)}
            </Col>

            <Col xs={6}>
              {renderFormField("Skill Remarks", "skills_remarks", "text", null, true)}
            </Col>

            <Col xs={6}>
              {renderFormField("Proficiency Level", "proficiency_level", "select", PROFICIENCY_LEVELS, true)}
            </Col>

            <Col xs={6}>
              {renderFormField("Remark Date", "remark_date", "date", null, true)}
            </Col>

            <Col xs={6}>
              {renderFormField("Start Date", "start_date", "date", null, true)}
            </Col>

            <Col xs={6}>
              {renderFormField("End Date", "end_date", "date", null, true)}
            </Col>

            <Col xs={6}>
              <Form.Group className="mb-2">
                <Form.Label className="label-font">Certified</Form.Label>
                <Form.Check
                  type="checkbox"
                  id="certifiedCheckbox"
                  name="is_certified"
                  checked={showCertificateFields}
                  onChange={handleCertifiedChange}
                  disabled={isFieldsDisabled}
                />
              </Form.Group>
            </Col>

            {showCertificateFields && (
              <>
                <Col xs={6}>
                  {renderFormField("Certificate Name", "certificate_name", "text", null, true)}
                </Col>

                <Col xs={6}>
                  <Form.Group className="mb-2">
                    <Form.Label className="label-font">Certificate Upload *</Form.Label>
                    <Form.Control
                      type="file"
                      disabled={isFieldsDisabled}
                    />
                  </Form.Group>
                </Col>
              </>
            )}
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer className="custom-modal-footer">
        {renderActionButtons()}
      </Modal.Footer>
    </Modal>
  );
};

export default AddSkill;