import {useMutation, useQueryClient} from "react-query";
import {useLocation, useNavigate} from "react-router-dom";
import {useSetRecoilState} from "recoil";
import {authState} from "../../../recoil/authRecoil";
import {resetAddMemberState} from "../../../recoil/resetFormRecoil";
import {toaster} from "../../../utilits/toast";
import {
    unreactOnHexaviewBuzz,
    unreactOnHexaviewBuzzComment,
    updateDeleteDirector,
    updateDepartment,
    updateHexaviewBuzz,
    timeSheetApproval,
    updateMembers,
    updateMenteeMentor,
    updateMenteeRating,
    updateTraneeApproval,
    updateRejectedTimesheet
} from "./updateMembersApi";

export const useUpdateMembers = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const empDetail = JSON.parse(localStorage.getItem("response"));
    const setAuthDetailState = useSetRecoilState(authState);
    const setResetAddMemberState = useSetRecoilState(resetAddMemberState);
    return useMutation("updateMembers", updateMembers, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Updated");
            if (location.pathname !== "/profile") {
                navigate("/members/memberList");
                setResetAddMemberState(true);
            }
            if (res.id == empDetail.uuid) {
                var newResponse = Object.assign({}, empDetail, res);
                localStorage.setItem("response", JSON.stringify(newResponse));
                setAuthDetailState(res);
            }
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useUpdateDeleteDirector = () => {
    const cache = useQueryClient();
    return useMutation("updateDeleteDirector", updateDeleteDirector, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Updated");
            cache.invalidateQueries("getAllDirectorAlongDepartmentEmployeeCount");
            cache.invalidateQueries("getDepartmentsWithoutDirector");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useTimeSheetApproval = () => {
    const cache = useQueryClient();
    return useMutation("timeSheetApproval", timeSheetApproval, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Updated");
            cache.invalidateQueries("getTimeSheetForApproval");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useUpdateDepartment = () => {
    const cache = useQueryClient();
    const navigate = useNavigate();
    return useMutation("updateDepartment", updateDepartment, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Updated");
            cache.invalidateQueries("getAllDepartments");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useUpdateHexaviewBuzz = () => {
    const cache = useQueryClient();
    return useMutation("updateHexaviewBuzz", updateHexaviewBuzz, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Updated");
            cache.invalidateQueries("updateHexaviewBuzz");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useUpdateRejectedTimeSheet = () => {
    const cache = useQueryClient();
    return useMutation("updateRejectedTimesheet", updateRejectedTimesheet, {
        onSuccess: (res, variables, context) => {
            cache.invalidateQueries("getTimesheetByMonth");
            cache.invalidateQueries("getRecentTimeSheet");
            toaster("success", "Submitted Successfully.");
        },
        onError: (error) => {
            cache.invalidateQueries("getRecentTimeSheet");
            toaster("error", error.message);
        },
    });
};

export const useUnreactOnHexaviewBuzz = () => {
    const cache = useQueryClient();
    return useMutation("unreactOnHexaviewBuzz", unreactOnHexaviewBuzz, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Reaction removed.");
            cache.invalidateQueries("getHexaviewBuzzCommentsAndLikes");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useUnreactOnHexaviewBuzzComment = () => {
    const cache = useQueryClient();
    return useMutation("unreactOnHexaviewBuzzComment", unreactOnHexaviewBuzzComment, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Reaction removed.");
            cache.invalidateQueries("getHexaviewBuzzCommentsAndLikes");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

// export const useReactOnHexaviewBuzz = () => {
// 	const cache = useQueryClient();
// 	const navigate = useNavigate()
// 	return useMutation('updateHexaviewBuzz', updateHexaviewBuzz, {
// 		onSuccess: (res, variables, context) => {
// 			toaster("success", "Successfully Updated");
// 			cache.invalidateQueries("getHexaviewBuzz");
// 		},
// 		onError: (error) => {
// 			toaster("error", error.message);
// 		}
// 	})
// }

export const useUpdateMenteeRating = () => {
    const cache = useQueryClient();
    const navigate = useNavigate();
    return useMutation("updateMenteeRating", updateMenteeRating, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Updated");
            //cache.invalidateQueries("getHexaviewBuzz");
            navigate(-1);
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useUpdateMenteeMentor = () => {
    const cache = useQueryClient();
    const navigate = useNavigate();
    return useMutation("updateMenteeMentor", updateMenteeMentor, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Updated");
            cache.invalidateQueries("getAllMenteeMentor");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useUpdateTraneeApproval = () => {
    const cache = useQueryClient();
    return useMutation("updateTraneeApproval", updateTraneeApproval, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Added");
            cache.invalidateQueries("getAllTrainees");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};
