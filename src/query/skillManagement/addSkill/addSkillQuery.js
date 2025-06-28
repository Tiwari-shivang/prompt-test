import { useMutation } from "react-query";
import { createSkill } from "./addSkillApi";
import { toaster } from "../../../utilits/toast";


export const useCreateSkill = () => {
    return useMutation('createSkill', createSkill, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Added");
        },
        onError: (error) => {
            toaster("error", error.message);
        }
    })
}