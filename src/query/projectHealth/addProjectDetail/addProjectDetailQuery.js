import { useMutation } from "react-query";
import { createProjectDetail } from "./addProjectDetailApi";
import { toaster } from "../../../utilits/toast";


export const useCreateProjectDetail = () => {
    return useMutation('createProjectDetail', createProjectDetail, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Added");
        },
        onError: (error) => {
            toaster("error", error.message);
        }
    })
}