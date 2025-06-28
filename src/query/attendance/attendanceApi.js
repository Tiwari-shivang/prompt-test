import http from "../../utilits/httpClient";
import {toaster} from "../../utilits/toast";

export const employeeCheckIn = async (values) => {
    try {
        const {data} = await http().post(`attendance/create/check-in`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getEmployeeAttendanceStatus = async (id) => {
    try {
        const {data} = await http().get(`attendance/get/attendance-status/${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getTimesheetSearchResult = async (values) => {
    try {
        const {data} = await http().get(
            `/attendance/timesheet/search/${values?.empUuid}/${values?.search}`,
            values
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getTimesheetByRm = async (values) => {
    try {
        const {data} = await http().get(
            `/attendance/project-timesheet/get/by-rm/${values?.reporting_manager_uuid}`,
            values
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getResourceUtilizationReport = async (values) => {
    const employeeUuid = values && values.employeeUuid ? values.employeeUuid : "";
    const startDate = values && values.startDate ? values.startDate : "";
    const endDate = values && values.endDate ? values.endDate : "";
    try {
        const {data} = await http().get(
            `/projects/get-resource-utilization-report?startDate=${startDate}&endDate=${endDate}&employeeUuid=${employeeUuid}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getTimesheetExportData = async (values) => {
    const project_uuid = values && values.project_uuid ? values.project_uuid : "";
    const startDate = values && values.startDate ? values.startDate : "";
    const endDate = values && values.endDate ? values.endDate : "";
    try {
        const {data} = await http().get(
            `/attendance/timesheet/get/all-timesheet-by-project-uuid?startDate=${startDate}&endDate=${endDate}&projectUuid=${project_uuid}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getTimesheetByMonth = async (values) => {
    try {
        const {data} = await http().get(
            `/attendance/get-get-timesheet-status/${values?.empUuid}/${values?.month}/${values?.year}`,
            values
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getTimesheetDetails = async (values) => {
    try {
        const {data} = await http().get(
            `/attendance/project-timesheet/get/by-timesheetuuid/${values?.timeSheetUuid}`,
            values
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getSearchProjectResource = async (empUuid) => {
    try {
        const {data} = await http().get(`/projects/get-search-project-resource/${empUuid}`);
        return data;
    } catch (error) {
        if (error.response.status == 404) {
            toaster("error", "No Projects assigned to this employee.");
        }
        throw Error(error?.response?.status);
    }
};

export const getProjectResources = async (values) => {
    //// todo
    try {
        const {data} = await http().get(`/projects/get-project-resources?pmUuid=${values?.pmUuid}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getProjectResourcesByProjectUuid = async (projectUuid) => {
    //// todo
    try {
        const {data} = await http().get(
            `/projects/get-project-utilization-by-project-uuid/${projectUuid}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data);
    }
};

export const getProjectInfoByEmpUuid = async (values) => {
    //// todo
    try {
        const {data} = await http().get(
            `/projects/get-projectUuid-projectName-by-empuuid?empUuid=${values?.empUuid}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getTeamMemberProjectInfoByEmpUuid = async (uuid) => {
    try {
        const {data} = await http().get(`/projects/get-team-member-by-empUuid/${uuid}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getRm = async (uuid) => {
    try {
        const {data} = await http().get(`/projects/get-all-project-managers-under-senior-project-manager/${uuid}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getProjectResourcesBySpmUuid = async (spmUuid) => {
    try {
        const {data} = await http().get(`/projects/get-project-resources-by-spm/${spmUuid}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllProjects = async () => {
    try {
        const {data} = await http().get(`/projects/get`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllLeavesCalendar = async (values) => {
	const empUuid = values && values.empUuid ? values.empUuid : "";
    const status = values && values.status ? values.status : "";
    try {
        const {data} = await http().get(`/attendance/leave/get-all-leaves-by-emp-id?empUuid=${empUuid}&status=${status}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getChangeHistoryOfEmployee = async (uuid) => {
    try {
        const {data} = await http().get(`/projects/get-employee-history-by-id/${uuid}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const employeeCheckOut = async (values) => {
    try {
        const {data} = await http().put(`attendance/create/check-out`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

// export const updateAllocationBillability = async ({spmUuid, editJson}) => {
//     try {
//         const {data} = await http().put(
//             `/projects/update-allocation-billability?spmUuid=${spmUuid}`,
//             editJson
//         );
//         return data;
//     } catch (error) {
//         throw Error(error.response.data.message);
//     }
// };

export const createUpdateDeleteProjectTeamMembers = async ({payload, comment}) => {
    try {
        const {data} = await http().post(
            `/projects/create-update-delete-project-team-members?comment=${comment}`,
            payload
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};
export const transferTimesheets = async (val) => {
    try {
        const {data} = await http().post(`/attendance/timesheet/update/transfer-timesheets`, val);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};
export const bulkApproveTimesheets = async (val) => {
    try {
        const {data} = await http().post(`/attendance/timesheet/update/bulk_approve`, val);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAttendanceListView = async (values) => {
    const empUuid = values && values.empUuid ? values.empUuid : "";
    const startDate = values && values.startDate ? values.startDate : "";
    const endDate = values && values.endDate ? values.endDate : "";
    try {
        const {data} = await http().get(
            `attendance/get/listview-by-emp-uuid?empUuid=${empUuid}&startDate=${startDate}&endDate=${endDate}`,
            values
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const createProjectTimesheet = async (values) => {
    try {
        const {data} = await http().post(`/attendance/timesheet/create/timesheet`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const saveProjectTimesheet = async (values) => {
    try {
        const {data} = await http().post(`/attendance/timesheet/save`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};
