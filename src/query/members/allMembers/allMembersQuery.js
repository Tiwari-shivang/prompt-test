import { useQuery } from "react-query";
import { toaster } from "../../../utilits/toast";
import {
	getAllDirectorAlongDepartmentEmployeeCount,
	getAllMembers,
	getAllMenteeMentor,
	getAllMenteeUnderEmployee,
	getAllMentorMentee,
	getAllProjectMembersInPhase,
	getAllProjectsByEmployeeId,
	getAllRms,
    getRmByEmpUuid,
	getAllRoles,
	getAllTicketsById,
	getAllTrainees,
	getAllTraineesForRating,
	getEmpUnderResignation,
	getEmployeeCount,
	getEmployeeProductivity,
	getHexaviewBuzz,
	getHexaviewBuzzAllRepliesOnComments,
	getHexaviewBuzzCommentsAndLikes,
	getMembersByEmpName,
	getMembersById,
	getNewHireTrendGraph,
	getNewJoinee,
	getRatingOfEmpPeriod,
	getTimeSheetForApproval,
	getTimeSheetSrPmApproval,
	getTopPerformer,
	getTraineeRatingByEmpId,
    getRecentTimeSheet,
    getTimeSheetByStatus,
    getTimeSheetByUuid,
	getMembersBySkillName,
	getEmpToTransfer
} from './allMembersApi';

export const useGetAllMembers = (data) => {
    return useQuery(["getAllMembers", data], () => getAllMembers(data), {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetMembersById = (id) => {
    return useQuery(
        ["getMembersById", id],
        () => getMembersById(id),
        {enabled: id ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetMembersByEmpName = (name, uuid) => {
    return useQuery(
        ["getMembersByEmpName", name],
        () => getMembersByEmpName(name, uuid),
        {enabled: (!name || name == "") ? false : true},
        {	
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetMembersBySkillName = (name) => {
    return useQuery(
        ["getMembersBySkillName", name],
        () => getMembersBySkillName(name),
        {enabled: (!name || name == "") ? false : true},
        {	
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetAllRms = (id) => {
    return useQuery(["getAllRms", id], () => getAllRms(id), {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
}; 

export const useGetRmByEmpUuid = (id) => {
    return useQuery(["getRmByEmpUuid", id], () => getRmByEmpUuid(id), {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetTimeSheetForApproval = (values) => {
    return useQuery(["getTimeSheetForApproval", values], () => getTimeSheetForApproval(values), {
        onError: (error) => {
            toaster("error", error.message);
        },
    })
}

export const useGetTimeSheetSrPmApproval = (id , Role) => {
    return useQuery(['getTimeSheetSrPmApproval', id], () => getTimeSheetSrPmApproval(id),
        { enabled: (Role == "User" || Role == "Reporting_Managers") ? false : true }, {
        onError: (error) => {
            toaster('error', error.message)
        },
    })
}

export const useGetRecentTimeSheet = (id) => {
    return useQuery(['getRecentTimeSheet', id], () => getRecentTimeSheet(id),
	{refetchInterval: true},
		{ enabled: id ? true : false }, {
        onError: (error) => {
            toaster('error', error.message)
        },
    })
}

export const useGetEmpToTransfer = () => {
    return useQuery(['getEmpToTransfer'], () => getEmpToTransfer(),
	{refetchInterval: true}, {
        onError: (error) => {
            toaster('error', error.message)
        },
    })
}

export const useGetTimeSheetByStatus = (data) => {
    return useQuery(['getTimeSheetByStatus', data], () => getTimeSheetByStatus(data),
	 {
        onError: (error) => {
            toaster('error', error.message)
        },
    })
}

export const useGetTimeSheetByUuid = (id) => {
    return useQuery(['getTimeSheetByUuid', id], () => getTimeSheetByUuid(id),
        { enabled: id =="" ? false : true }, {
        onError: (error) => {
            toaster('error', error.message)
        },
    })
}

export const UseGetAllMenteeUnderEmployee = (id) => {
    return useQuery(["getAllMenteeUnderEmployee", id], () => getAllMenteeUnderEmployee(id), {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetEmpUnderResignation = (data) => {
    return useQuery(["getEmpUnderResignation", data], () => getEmpUnderResignation(data), {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetTopPerformer = () => {
    return useQuery("getTopPerformer", getTopPerformer, {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetAllProjectMembersInPhase = (data) => {
    return useQuery(
        ["getAllProjectMembersInPhase", data],
        () => getAllProjectMembersInPhase(data),
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetNewJoinee = (data) => {
    return useQuery(["getNewJoinee", data], () => getNewJoinee(data), {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetTraineeRatingByEmpId = (value) => {
    return useQuery(
        ["getTraineeRatingByEmpId", value],
        () => getTraineeRatingByEmpId(value),
        {enabled: value ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetRatingOfEmpPeriod = (value, ratedBy) => {
    return useQuery(
        ["getRatingOfEmpPeriod", value, ratedBy],
        () => getRatingOfEmpPeriod(value, ratedBy),
        {enabled: value ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetNewHireTrendGraph = (value) => {
    return useQuery(
        ["getNewHireTrendGraph", value],
        () => getNewHireTrendGraph(value),
        {enabled: value ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetAllProjectsByEmployeeId = (id) => {
    return useQuery(
        ["getAllProjectsByEmployeeId", id],
        () => getAllProjectsByEmployeeId(id),
        {enabled: id ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetHexaviewBuzz = () => {
    return useQuery("getHexaviewBuzz", getHexaviewBuzz, {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetHexaviewBuzzCommentsAndLikes = (value) => {
    return useQuery(
        ["getHexaviewBuzzCommentsAndLikes", value],
        () => getHexaviewBuzzCommentsAndLikes(value),
        {
            enabled: value?.buzzUuid !== "" ? true : false,
        },
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetHexaviewBuzzAllRepliesOnComments = (value) => {
    return useQuery(
        ["getHexaviewBuzzAllRepliesOnComments", value],
        () => getHexaviewBuzzAllRepliesOnComments(value),
        {
            enabled: value?.commentUuid !== "" ? true : false,
        },
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

// export const useGetNewHireTrendGraph = (value) => {
// 	return useQuery(
// 		["getNewHireTrendGraph", value],
// 		() => getNewHireTrendGraph(value),
// 		{
// 			enabled: value ? true : false
// 		},
// 		{
// 			onError: (error) => {
// 				toaster("error", error.message);
// 			}
// 		});
// }

export const useGetEmployeeCount = () => {
    return useQuery("getEmployeeCount", getEmployeeCount, {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetAllTrainees = () => {
    return useQuery("getAllTrainees", getAllTrainees, {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetAllTraineesForRating = () => {
    return useQuery("getAllTraineesForRating", getAllTraineesForRating, {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetAllRoles = () => {
    return useQuery("getAllRoles", getAllRoles, {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetAllMenteeMentor = (id) => {
    return useQuery(
        ["getAllMenteeMentor", id],
        () => getAllMenteeMentor(id),
        {enabled: id ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};
export const useGetAllMentorMentee = (id) => {
    return useQuery(
        ["getAllMentorMentee", id],
        () => getAllMentorMentee(id),
        {enabled: id ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetAllDirectorAlongDepartmentEmployeeCount = () => {
    return useQuery(
        "getAllDirectorAlongDepartmentEmployeeCount",
        getAllDirectorAlongDepartmentEmployeeCount,
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetEmployeeProductivity = () => {
    return useQuery("getEmployeeProductivity", getEmployeeProductivity, {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetAllTicketsById = (id) => {
    return useQuery(["getAllTicketsById", id], () => getAllTicketsById(id), {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};
