import { useMutation, useQueryClient } from "react-query";
import { toaster } from "../../../utilits/toast";
import { updateIdentity } from "./updateIdentityApi";

export const useUpdateIdentity = () => {
    const cache = useQueryClient()
    return useMutation('updateIdentity', updateIdentity, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Updated"); 
          cache.invalidateQueries("getIdentityById")
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }