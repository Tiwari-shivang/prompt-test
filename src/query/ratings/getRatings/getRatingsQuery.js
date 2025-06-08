import {toaster} from "../../../utilits/toast";
import {useNavigate} from "react-router-dom";
import {useQuery} from "react-query";
import {
    getEmployeeRatingByEmpUuid,
    getEmployeeRatingByPm,
    getEmployeeWithSkillRatingByRmId,
} from "./getRatingsApi";

export const useGetEmployeeRatingByPm = (data) => {
    return useQuery(["getEmployeeRatingByPm", data], () => getEmployeeRatingByPm(data), {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useGetEmployeeWithSkillRatingByRmId = (id) => {
    return useQuery(
        ["getEmployeeWithSkillRatingByRmId", id],
        () => getEmployeeWithSkillRatingByRmId(id),
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetEmployeeRatingByEmpUuid = (uuid) => {
    return useQuery(["getEmployeeRatingByEmpUuid", uuid], () => getEmployeeRatingByEmpUuid(uuid), {
        refetchInterval: true,
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};
