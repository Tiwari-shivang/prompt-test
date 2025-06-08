import http from "../../../utilits/httpClient";

export const getAllMembers = async (values) => {
    const page = values && values.newCurrentPage ? values.newCurrentPage : "";
    const size = values && values.itemsPerPage ? values.itemsPerPage : "";
    const searchCriteria = values && values.searchValue ? values.searchValue : "";
    const gender = values && values.gender ? values.gender : "";
    const locationId = values && values.locationId ? values.locationId : "";
    const designationId = values && values.designationId ? values.designationId : "";
    const departmentId = values && values.departmentId ? values.departmentId : "";
    const experienceFrom = values && values.experienceFrom ? values.experienceFrom : "";
    const experienceTo = values && values.experienceTo ? values.experienceTo : "";
    const isBillable = values && values.isBillable ? values.isBillable : "";
    const firstNameSortCriteria =
        values && values.firstNameSortCriteria ? values.firstNameSortCriteria : "";
    const lastNameSortCriteria =
        values && values.lastNameSortCriteria ? values.lastNameSortCriteria : "";

    try {
        const {data} = await http().get(
            `employee/get-all?page=${page}&size=${size}&searchCriteria=${searchCriteria}&locationId=${locationId}&designationId=${designationId}&departmentId=${departmentId}&experienceFrom=${experienceFrom}&experienceTo=${experienceTo}&isBillable=${isBillable}&gender=${gender}&firstNameSortCriteria=${firstNameSortCriteria}&lastNameSortCriteria=${lastNameSortCriteria}`
        );
        // const { data } = await http().get(`employee/get-all?page=${1}&size=${2147483647}&experienceFrom=${0}&experienceTo=${50}`)
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllRms = async (id) => {
    const newId = id ? id : "";
    try {
        const {data} = await http().get(`employee/get-rm?id=${newId}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getRmByEmpUuid = async (id) => {
    const newId = id ? id : "";
    try {
        const {data} = await http().get(`employee/get/reporting_manager_by_emp_id/${newId}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getTimeSheetForApproval = async (values) => {
    const newId = values && values.id ? values.id : "";
    const newStatus = values && values.status ? values.status : "";
    const page = values && values.page ? values.page : "";
    const size = values && values.size ? values.size : "";
    try {
        const {data} = await http().get(
            `/attendance/timesheet/get/pending-approved-status/${newStatus}/${newId}/desc?page=${page}&size=${size}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getTimeSheetSrPmApproval = async (id) => {
    const newId = id ? id : "";
    try {
        const {data} = await http().get(
            `/attendance/timesheet/get/by-senior-reporting-manager/${newId}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getRecentTimeSheet = async (id) => {
    const newId = id ? id : "";
    try {
        const {data} = await http().get(`/attendance/timesheet/get/recent-timesheet/${newId}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getEmpToTransfer = async (id) => {
    const newId = id ? id : "";
    try {
        const {data} = await http().get(`/employee/get-all/employee-get-for-drop-down`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getTimeSheetByStatus = async (values) => {
    const rmUuid = "";
    try {
        const {data} = await http().get(
            `/attendance/timesheet/get/pending-approved-status/APPROVED/${values}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getTimeSheetByUuid = async (id) => {
    try {
        const {data} = await http().get(`/attendance/timesheet/get/by-timesheetuuid/${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getMembersById = async (id) => {
    try {
        const {data} = await http().get(`employee/get/${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getMembersByEmpName = async (name, uuid) => {
    try {
        const {data} = await http().get(`/employee/get/search-by-employee-name/${name}/${uuid}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};
export const getMembersBySkillName = async (skillName) => {
    try {
        const {data} = await http().get(`/employee/skills/get/search-by-skill/${skillName}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getEmpUnderResignation = async (values) => {
    const searchCriteria = values && values.searchValue ? values.searchValue : "";
    const locationId = values && values.locationName ? values.locationName : "";
    const designationId = values && values.designationName ? values.designationName : "";
    const departmentId = values && values.departmentName ? values.departmentName : "";
    try {
        const {data} = await http().get(
            `employee/get-all-employee-under-resignation?searchCriteria=${searchCriteria}&locationId=${locationId}&designationId=${designationId}&departmentId=${departmentId}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getTopPerformer = async () => {
    try {
        const {data} = await http().get(`employee/topPerformers/get-all`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllProjectMembersInPhase = async (values) => {
    const projectId = values.projectId;
    const phaseId = values.phaseId;
    try {
        const {data} = await http().get(
            `/projects/get-all-employee-by-phase-id?projectId=${projectId}&phaseId=${phaseId}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getNewJoinee = async (values) => {
    const searchCriteria = values && values.searchValue ? values.searchValue : "";
    const locationId = values && values.locationName ? values.locationName : "";
    const designationId = values && values.designationName ? values.designationName : "";
    const departmentId = values && values.departmentName ? values.departmentName : "";
    try {
        const {data} = await http().get(
            `employee/get/new-joinees/20?searchCriteria=${searchCriteria}&locationId=${locationId}&designationId=${designationId}&departmentId=${departmentId}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

// export const getMentees = async (id) => {
// 	// const searchCriteria = values && values.searchValue ? values.searchValue : "";
// 	// const locationId = values && values.locationName ? values.locationName : "";
// 	// const designationId = values && values.designationName ? values.designationName : "";
// 	// const departmentId = values && values.departmentName ? values.departmentName : "";
// 	try {
// 		const { data } = await http().get(`/employee/get-all-mentees-by-mentor-id/${id}`);
// 		return data
// 	} catch (error) {
// 		throw Error(error.response.data.message)
// 	}
// };

export const getHexaviewBuzz = async () => {
    try {
        const {data} = await http().get(`/employee/hexaview-buzz/get`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getHexaviewBuzzCommentsAndLikes = async ({buzzUuid, empUuid}) => {
    try {
        const {data} = await http().get(
            `/employee/hexaview-buzz/get-likes-and-comments?buzzUuid=${buzzUuid}&empUuid=${empUuid}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getHexaviewBuzzAllRepliesOnComments = async ({commentUuid, empUuid}) => {
    try {
        const {data} = await http().get(
            `/employee/hexaview-buzz/get-all-replies-on-comment?commentUuid=${commentUuid}&empUuid=${empUuid}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getEmployeeCount = async () => {
    try {
        const {data} = await http().get(`employee/get/employee-count`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllTrainees = async () => {
    try {
        const {data} = await http().get(`employee/get-all-trainees`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllTraineesForRating = async () => {
    try {
        const {data} = await http().get(`employee/get/all-trainee-for-rating`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllRoles = async () => {
    try {
        const {data} = await http().get(`/users/roles/get-all`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllMenteeUnderEmployee = async (id) => {
    try {
        const {data} = await http().get(`/employee/get/all-trainee-for-rating-under?underId=${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getNewHireTrendGraph = async (value) => {
    const newValue = value ? value : "";
    try {
        const {data} = await http().get(`employee/get/new-hire-trend-graph?year=${newValue}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getRatingOfEmpPeriod = async (value, ratedBy) => {
    const trainee_id = value.trainee_id ? value.trainee_id : "";
    const ratingGivenBy = ratedBy == "mentorCall" ? value.mentor_id : value.reporting_manager_id;
    const startDate = value.start_date ? value.start_date : "";
    const endDate = value.end_date ? value.end_date : "";
    try {
        const {data} = await http().get(
            `/employee/get/trainee-rating-given-by?traineeId=${trainee_id}&ratingGivenBy=${ratingGivenBy}&startDate=${startDate}&endDate=${endDate}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getTraineeRatingByEmpId = async (value) => {
    const newValue = value ? value : "";
    try {
        const {data} = await http().get(
            `/employee/get/all-rating-of-trainee?traineeId=${newValue}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllProjectsByEmployeeId = async (id) => {
    try {
        const {data} = await http().get(`employee/get-all-projects-by-employee-id/${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllMenteeMentor = async (id) => {
    try {
        const {data} = await http().get(
            `employee/get-associate-members-under-project-manager/${id}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};
export const getAllMentorMentee = async (id) => {
    try {
        const {data} = await http().get(`/employee/get-all-mentors-by-mentee-id/${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllDirectorAlongDepartmentEmployeeCount = async () => {
    try {
        const {data} = await http().get(
            `employee/get-all-director-along-department-employee-count`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getEmployeeProductivity = async () => {
    try {
        const {data} = await http().get(`employee/topPerformers/get-employee-productivity`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllTicketsById = async (id) => {
    try {
        const {data} = await http().get(`help-desk/it-admin/get-all-tickets-by-employee-id/${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};
