import {useQuery} from "react-query";
import {toaster} from "../../../utilits/toast";
import {
    downloadProjectCSVFile,
    getActiveProjects,
    getAllEmployeeByProjectId,
    getAllProjectCount,
    getAllProjectDetailsByPhase,
    getAllProjectWithAssociatedEmployee,
    getAllProjectofMangerbyId,
    getAllStatusAdmin,
    getEmployeeUtilizationByEmpUuid,
    getProject,
    getProjectById,
    getProjectCountByTimeSpan,
    getProjectMemberById,
    getProjectMemberByProjectId,
    getProjectPhaseById,
} from "./allProjectsApi";

export const useProjectDownloadCSVFile = () => {
    return useQuery("downloadCsvFile", downloadProjectCSVFile, {
        onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }

export const useGetAllProjectWithAssociatedEmployee = (values) => {
    return useQuery(
        ["getAllProjectWithAssociatedEmployee", values],
        () => getAllProjectWithAssociatedEmployee(values),
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetAllProjectCount = () => {
    return useQuery("getAllProjectCount", getAllProjectCount, {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetProjectMemberByProjectId = (id) => {
    return useQuery(
        ["getProjectMemberByProjectId", id],
        () => getProjectMemberByProjectId(id),
        {enabled: id ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetEmployeeUtilizationByEmpUuid = (list) => {
    return useQuery(
        ["getEmployeeUtilizationByEmpUuid", list],
        () => getEmployeeUtilizationByEmpUuid(list),
        {
            enabled: false,
			refetchInterval: false,
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetProjectMemberById = (id) => {
    return useQuery(
        ["getProjectMemberById", id],
        () => getProjectMemberById(id),
        {enabled: id ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetProject = () => {
    return useQuery("getProject", getProject, {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};
export const useGetActiveProjects = () => {
    return useQuery("getActiveProjects", getActiveProjects, {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetProjectById = (id) => {
    return useQuery(
        ["getProjectById", id],
        () => getProjectById(id),
        {enabled: id ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetProjectPhaseById = (id) => {
    return useQuery(
        ["getProjectPhaseById", id],
        () => getProjectPhaseById(id),
        {enabled: id ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};
export const useGetAllProjectDetailsByPhase = (values) => {
    return useQuery(
        ["getAllProjectDetailsByPhase", values.phaseId],
        () => getAllProjectDetailsByPhase(values),
        {enabled: values.phaseId ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetAllProjectofMangerbyId = (id) => {
    return useQuery(
        ["getAllProjectofMangerbyId", id],
        () => getAllProjectofMangerbyId(id),
        {enabled: id ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetAllEmployeeByProjectId = (id) => {
    return useQuery(
        ["getAllEmployeeByProjectId", id],
        () => getAllEmployeeByProjectId(id),
        {enabled: id ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetAllStatusAdmin = (data) => {
    return useQuery(["getAllStatusAdmin", data], () => getAllStatusAdmin(data), {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetProjectCountByTimeSpan = (value) => {
    return useQuery(
        ["getProjectCountByTimeSpan", value],
        () => getProjectCountByTimeSpan(value),
        {enabled: value ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};
