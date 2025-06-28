import { useMutation } from "react-query";
import { updateProjectDetail } from "./updateProjectDetailApi";
import { toaster } from "../../../utilits/toast";


export const useUpdateProjectDetail = () => {
    return useMutation('updateProjectDetail', updateProjectDetail, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Updated");
        },
        onError: (error) => {
            toaster("error", error.message);
        }
    })
}