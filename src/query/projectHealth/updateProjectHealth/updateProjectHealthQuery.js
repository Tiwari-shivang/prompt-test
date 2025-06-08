import { useMutation } from "react-query";
import { updateProjectHealth } from "./updateProjectHealthApi";
import { toaster } from "../../../utilits/toast";


export const useUpdateProjectHealth = () => {
    return useMutation('updateProjectHealth', updateProjectHealth, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Updated");
        },
        onError: (error) => {
            toaster("error", error.message);
        }
    })
}