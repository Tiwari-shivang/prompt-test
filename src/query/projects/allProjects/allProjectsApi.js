import http from "../../../utilits/httpClient";

export const downloadProjectCSVFile = async (id) => {
    try {
        const { data } = await http().get(`projects/get/project-csv-standard-format`);
        return data
        } catch (error){
            throw Error(error.response.data.message)
        }
  };

export const getAllProjectWithAssociatedEmployee = async (values) => {
    const clientId = values && values.clientId ? values.clientId : "";
    const empId = values && values.empId ? values.empId : "";
    const page = values && values.newCurrentPage ? values.newCurrentPage : "";
    const size = values && values.itemsPerPage ? values.itemsPerPage : "";
    const searchCriteria = values && values.searchValue ? values.searchValue : "";
    try {
        const {data} = await http().get(
            `projects/get-all-project-with-associated-employee?empId=${empId}&clientId=${clientId}&page=${page}&size=${size}&searchCriteria=${searchCriteria}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getProjectMemberByProjectId = async (id) => {
    try {
        const {data} = await http().get(`projects/get-project-members-by-project-id/${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getActiveProjects = async () => {
    try {
        const {data} = await http().get(`/projects/get-all-project`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getEmployeeUtilizationByEmpUuid = async (list) => {
    try {
        let url = "/projects/get/employee-utilization-by-empUuid?";
        if (!list || !list.length) return [];
        list &&
            list.forEach((uuid, index) => {
                url += `empUuids=${uuid}` + (index < list.length - 1 ? "&" : "");
            });
        const {data} = await http().get(url);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getProjectMemberById = async (id) => {
    try {
        const {data} = await http().get(`/projects/get-team-member/${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getProject = async () => {
    try {
        const {data} = await http().get(`projects/get-all-project`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllProjectCount = async () => {
    try {
        const {data} = await http().get(`/projects/get/project-count`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getProjectById = async (id) => {
    try {
        const {data} = await http().get(`projects/get-project/${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getProjectPhaseById = async (id) => {
    try {
        const {data} = await http().get(`/projects/get-project-phase/${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllProjectDetailsByPhase = async (values) => {
    const projectId = values && values.projectId ? values.projectId : "";
    const phaseId = values && values.phaseId ? values.phaseId : "";
    try {
        const {data} = await http().get(
            `/projects/get-project-details-by-phase?phaseId=${phaseId}&projectId=${projectId}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllProjectofMangerbyId = async (id) => {
    try {
        const {data} = await http().get(`projects/get-all-project-manager-projects/${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllEmployeeByProjectId = async (id) => {
    try {
        const {data} = await http().get(`projects/get-all-employee-by-project-id/${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllStatusAdmin = async (data) => {
    const project = data.project ? data.project : "";
    const status = data.status ? data.status : "";
    const payment = data.payment ? data.payment : "";
    try {
        const {data} = await http().get(
            `projects/get-all-project-status-admin?project-name=${project}&project-status=${status}&payment-status=${payment}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getProjectCountByTimeSpan = async (value) => {
    try {
        const {data} = await http().get(`projects/get/project-count-by-time-span?year=${value}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};
