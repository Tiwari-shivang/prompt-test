import { useMutation, useQuery, useQueryClient } from "react-query";
import { toaster } from "../../utilits/toast";
import {
	bulkApproveTimesheets,
	createProjectTimesheet,
	createUpdateDeleteProjectTeamMembers,
	employeeCheckIn,
	employeeCheckOut,
	getAllLeavesCalendar,
	getAllProjects,
	getAttendanceListView,
	getChangeHistoryOfEmployee,
	getEmployeeAttendanceStatus,
	getProjectInfoByEmpUuid,
	getProjectResources,
	getProjectResourcesByProjectUuid,
	getProjectResourcesBySpmUuid,
	getResourceUtilizationReport,
	getRm,
	getSearchProjectResource,
	getTeamMemberProjectInfoByEmpUuid,
	getTimesheetByMonth,
	getTimesheetByRm,
	getTimesheetDetails,
	getTimesheetExportData,
	getTimesheetSearchResult,
	saveProjectTimesheet,
	transferTimesheets
} from "./attendanceApi";

export const useEmployeeCheckIn = () => {
    const cache = useQueryClient();
    return useMutation("employeeCheckIn", employeeCheckIn, {
        onSuccess: (res, variables, context) => {
            cache.invalidateQueries("getEmployeeAttendanceStatus");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetEmployeeAttendanceStatus = (id) => {
    return useQuery(
        ["getEmployeeAttendanceStatus", id],
        () => getEmployeeAttendanceStatus(id),
        {refetchInterval: true},
        {enabled: id ? true : false},
        {
            refetchInterval: true,
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetTimesheetSearchResult = (values) => {
    return useQuery(
        ["getTimesheetSearchResult", values?.search],
        () => getTimesheetSearchResult(values),
        // {refetchInterval: true},
        {enabled: values && values?.search != "" ? true : false},
        {
            refetchInterval: true,
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetTimesheetByRm = (values) => {
    return useQuery(
        ["getTimesheetByRm", values?.reporting_manager_uuid],
        () => getTimesheetByRm(values),
        {enabled: values && values?.reporting_manager_uuid ? true : false},
        {
            refetchInterval: true,
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};
export const useGetTimesheetByMonth = (values) => {
    return useQuery(["getTimesheetByMonth", values], () => getTimesheetByMonth(values), {
        refetchInterval: true,
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetTimesheetDetails = (values) => {
    return useQuery(
        ["getTimesheetDetails", values?.timeSheetUuid],
        () => getTimesheetDetails(values),
        {enabled: values && values?.timeSheetUuid ? true : false},
        {
            refetchInterval: true,
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetSearchProjectResource = (empUuid) => {
    return useQuery(
        ["getSearchProjectResource", empUuid],
        () => getSearchProjectResource(empUuid),
        {enabled: false},
        {
            refetchInterval: false,
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetAllProjects = () => {
    return useQuery(["getAllProjects"], () => getAllProjects(), {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetProjectResourcesByProjectUuid = (projectUuid) => {
    return useQuery(
        ["getProjectResourcesByProjectUuid"],
        () => getProjectResourcesByProjectUuid(projectUuid),
        {enabled: false},
        {
            refetchInterval: false,
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetProjectResourcesByPmUuid = (values) => {
    return useQuery(
        ["getProjectResources"],
        () => getProjectResources(values),
        {enabled: false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetProjectInfoByEmpUuid = (values) => {
    return useQuery(
        ["getProjectInfoByEmpUuid", values],
        () => getProjectInfoByEmpUuid(values),
        {enabled: false},
        {
            refetchInterval: true,
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetTeamMemberProjectInfoByEmpUuid = (uuid) => {
    return useQuery(
        ["getTeamMemberProjectInfoByEmpUuid", uuid],
        () => getTeamMemberProjectInfoByEmpUuid(uuid),
        {
            enabled: false,
        },
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetResourceUtilizationReport = (values) => {
    return useQuery(
        ["getResourceUtilizationReport", values],
        () => getResourceUtilizationReport(values),
        {
            enabled: values && values.startDate === "" ? false : true,
        },
        {
            enabled: false,
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetTimesheetExportData = (values) => {
    return useQuery(
        ["getTimesheetExportData", values],
        () => getTimesheetExportData(values),
        {
            enabled:  values && values.startDate === "" || values && values.startDate === undefined ? false : true,
        },
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

// export const useUpdateAllocationBillability = (
//     refetchProjectInfoOfCurrentEmp,
//     refetchGetEmployeeHistory,
//     refetchMembers
// ) => {
//     return useMutation("updateAllocationBillability", updateAllocationBillability, {
//         onSuccess: (res, variables, context) => {
//             if (refetchProjectInfoOfCurrentEmp) refetchProjectInfoOfCurrentEmp();
//             toaster("success", "Successfully Updated.");
// 			console.log("yes");
//             if (refetchMembers != "") {
// 				console.log("ok");
//                 refetchMembers();
//             }
//             refetchGetEmployeeHistory();
//         },
//         onError: (error) => {
//             toaster("error", error.message);
//         },
//     });
// };

export const useCreateUpdateDeleteProjectTeamMembers = (
    refetchGetEmployeeHistory,
    refetchProjectInfoOfCurrentEmp,
    refetchMembers
) => {
    return useMutation(
        "createUpdateDeleteProjectTeamMembers",
        createUpdateDeleteProjectTeamMembers,
        {
            onSuccess: (res, variables, context) => {
                refetchProjectInfoOfCurrentEmp();
                refetchGetEmployeeHistory();
                if (refetchMembers != "") {
                    refetchMembers();
                }
                toaster("success", "Successfully Updated.");
            },
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetRm = (uuid) => {
    return useQuery(["getRm"], () => getRm(uuid), {
        refetchInterval: true,
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetAllLeavesCalendar = (values) => {
    return useQuery(
        ["getAllLeavesCalendar", values],
        () => getAllLeavesCalendar(values),
        {enabled: values == "" ? false : true},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};
export const useGetProjectResourcesBySpmUuid = (spmUuid) => {
    return useQuery(
        ["getProjectResourcesBySpmUuid", spmUuid],
        () => getProjectResourcesBySpmUuid(spmUuid),
        {enabled: spmUuid == "" ? false : true},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetChangeHistoryOfEmployee = (uuid) => {
    return useQuery(
        ["getChangeHistoryOfEmployee", uuid],
        () => getChangeHistoryOfEmployee(uuid),
        {enabled: false},
        {
            refetchInterval: false,
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useEmployeeCheckOut = () => {
    const cache = useQueryClient();
    return useMutation("employeeCheckOut", employeeCheckOut, {
        onSuccess: (res, variables, context) => {
            cache.invalidateQueries("getEmployeeAttendanceStatus");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetAttendanceListView = (data) => {
    const id = data && data.empUuid ? data.empUuid : "";
    return useQuery(
        ["getAttendanceListView", id],
        () => getAttendanceListView(data),
        {enabled: id ? true : false},
        {
            refetchInterval: true,
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useCreateProjectTimesheet = () => {
    const cache = useQueryClient();
    return useMutation("createProjectTimesheet", createProjectTimesheet, {
        onSuccess: (res, variables, context) => {
            cache.invalidateQueries("getTimesheetByMonth");
            cache.invalidateQueries("getRecentTimeSheet");
            toaster("success", "Successfully Submitted");
        },
        onError: (error) => {
            cache.invalidateQueries("getRecentTimeSheet");
            toaster("error", error.message);
        },
    });
};

export const useTransferTimesheets = () => {
    const cache = useQueryClient();
    return useMutation("transferTimesheets", transferTimesheets, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Transferred");
			cache.invalidateQueries('getTimeSheetForApproval')
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};
export const useBulkApproveTimesheets = () => {
    const cache = useQueryClient();
    return useMutation("bulkApproveTimesheets", bulkApproveTimesheets, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Bulk Approval Successful");
			cache.invalidateQueries('getTimeSheetForApproval')
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useSaveProjectTimesheet = () => {
    return useMutation("createProjectTimesheet", saveProjectTimesheet, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Created");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};
