import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import "./style.scss";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useCreateSkill } from "../../../query/skillManagement/addSkill/addSkillQuery";
import { useGetAllSkills } from "../../../query/skillManagement/getSkill/getSkillQuery";

// Constants
const MODAL_MODES = {
  ADD: 'add',
  VIEW: 'view'
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

/**
 * AddSkill Modal Component
 * 
 * A comprehensive modal component for adding and viewing employee skills.
 * Supports two modes: 'add' for creating new skills and 'view' for viewing/editing existing skills.
 * In view mode, users can directly edit fields and update the skill.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.show - Controls modal visibility
 * @param {Function} props.handleClose - Callback to close the modal
 * @param {Object|null} props.selectedSkill - Selected skill object for view mode
 * @param {'add'|'view'} props.mode - Current modal mode
 * @param {Function} props.setMode - Function to change modal mode
 * @param {Function} [props.onDeleteSkill] - Callback for skill deletion
 * @param {boolean} [props.isDeleting=false] - Loading state for delete operation
 * @param {Function} [props.onUpdateSkill] - Callback for skill update
 * @param {boolean} [props.isUpdating=false] - Loading state for update operation
 * 
 * @example
 * <AddSkill
 *   show={isModalOpen}
 *   handleClose={() => setIsModalOpen(false)}
 *   selectedSkill={selectedSkillData}
 *   mode="view"
 *   setMode={setModalMode}
 *   onDeleteSkill={handleDelete}
 *   isDeleting={isDeletingSkill}
 * />
 */
const AddSkill = ({ show, handleClose, selectedSkill, mode, setMode, onDeleteSkill, isDeleting, onUpdateSkill, isUpdating }) => {
  // State management
  const [formData, setFormData] = useState(getInitialFormState());
  const [showCertificateFields, setShowCertificateFields] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);

  // API hooks
  const { mutateAsync: createSkillAsync, isLoading: isLoadingCreateSkill } = useCreateSkill();
  const { data: skillsData, isLoading: isLoadingSkills } = useGetAllSkills();

  // Computed values
  const isViewMode = mode === MODAL_MODES.VIEW;
  const isAddMode = mode === MODAL_MODES.ADD;
  const isFieldsDisabled = false; // Fields are always enabled for direct editing

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
  const handleUpdateClick = useCallback(async () => {
    if (!onUpdateSkill) {
      console.error('Update callback not provided');
      return;
    }

    try {
      const success = await onUpdateSkill(formData);
      // Modal will be closed by the parent component if update is successful
      if (!success) {
        console.warn('Skill update was cancelled or failed');
      }
    } catch (error) {
      console.error('Error during skill update:', error);
    }
  }, [formData, onUpdateSkill]);

  const handleDeleteClick = useCallback(async () => {
    if (!onDeleteSkill) {
      console.error('Delete callback not provided');
      return;
    }

    try {
      const success = await onDeleteSkill(selectedSkill);
      // Modal will be closed by the parent component if deletion is successful
      if (!success) {
        console.warn('Skill deletion was cancelled or failed');
      }
    } catch (error) {
      console.error('Error during skill deletion:', error);
    }
  }, [selectedSkill, onDeleteSkill]);

  const handleCancelClick = useCallback(() => {
    // Close modal for both view and add modes
    handleClose();
  }, [handleClose]);

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
            onClick={handleUpdateClick}
            disabled={isUpdating}
            style={{ fontSize: "14px" }}
          >
            {isUpdating ? "Updating..." : "Update"}
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            style={{ fontSize: "14px" }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
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

// PropTypes for type safety and documentation
AddSkill.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedSkill: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    skill_uuid: PropTypes.string,
    skill_name: PropTypes.string,
    employee_uuid: PropTypes.string,
    certificate_uuid: PropTypes.string,
    is_certified: PropTypes.bool,
    skill_rating_by_pm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    skills_remarks: PropTypes.string,
    remark_date: PropTypes.string,
    proficiency_level: PropTypes.string,
    skill_version: PropTypes.string,
    skill_type: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    certificate_name: PropTypes.string,
    certificate: PropTypes.string,
  }),
  mode: PropTypes.oneOf(['add', 'view']).isRequired,
  setMode: PropTypes.func.isRequired,
  onDeleteSkill: PropTypes.func,
  isDeleting: PropTypes.bool,
  onUpdateSkill: PropTypes.func,
  isUpdating: PropTypes.bool,
};

AddSkill.defaultProps = {
  selectedSkill: null,
  onDeleteSkill: null,
  isDeleting: false,
  onUpdateSkill: null,
  isUpdating: false,
};

export default AddSkill;