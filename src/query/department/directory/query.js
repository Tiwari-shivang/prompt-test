import {useQuery, useMutation, useQueryClient} from "react-query";
import {toaster} from "../../../utilits/toast";
import {getDepartmentsWithoutDirector, getAllByEmployeeDepartmentId} from "./api";

export const useGetAllByEmployeeDepartmentId = (data) => {
    return useQuery(
        ["getAllByEmployeeDepartmentId", data],
        () => getAllByEmployeeDepartmentId(data),
         {enabled: data?.id ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useGetDepartmentsWithoutDirector = () => {
    return useQuery("getDepartmentsWithoutDirector", getDepartmentsWithoutDirector, {
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};
