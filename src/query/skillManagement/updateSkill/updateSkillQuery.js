import { useMutation } from "react-query";
import { updateSkill } from "./updateSkillApi";
import { toaster } from "../../../utilits/toast";

export const useUpdateSkill = () => {
    return useMutation('updateSkill', updateSkill, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Updated"); 
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }