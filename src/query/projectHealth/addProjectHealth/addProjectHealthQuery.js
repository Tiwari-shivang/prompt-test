import { useMutation } from "react-query";
import { createProjectHealth } from "./addProjectHealthApi";
import { toaster } from "../../../utilits/toast";


export const useCreateProjectHealth = () => {
    return useMutation('createProjectHealth', createProjectHealth, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Added");
        },
        onError: (error) => {
            toaster("error", error.message);
        }
    })
}