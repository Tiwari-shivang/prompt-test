import { useMutation } from "react-query";
import { deleteSkill } from "./deleteSkillApi";
import { toaster } from "../../../utilits/toast";

export const useDeleteSkill = () => {
    return useMutation("deleteSkill", deleteSkill, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Deleted");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};