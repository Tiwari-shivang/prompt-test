import { useMutation, useQuery, useQueryClient } from "react-query";
import { toaster } from "../../utilits/toast";
import { addRegularization, getRegularizationByEmpId, getRegularizationByPmId, updateRegularizationRequest } from "./regularizationApi";

export const useAddRegularization = () => {
return useMutation('addRegularization', addRegularization, {
  onSuccess: (res, variables, context) =>{
      toaster("success", "Successfully Added"); 
  },
  onError: (error) =>{
      toaster("error", error.message);
  }
  })
}

export const useGetRegularizationByPmId = (id) => {
  return useQuery(['getRegularizationByPmId', id], () => getRegularizationByPmId(id), {enabled: id ? true : false},{
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useGetRegularizationByEmpId = (id) => {
  return useQuery(['getRegularizationByEmpId', id], () => getRegularizationByEmpId(id), {enabled: id ? true : false},{
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useUpdateRegularizationRequest = () => {
  const cache = useQueryClient()
  return useMutation('updateRegularizationRequest', updateRegularizationRequest, {
    onSuccess: ({pm_review}, variables, context) =>{
        toaster("success", `Successfully ${pm_review}`); 
        cache.invalidateQueries("getRegularizationByPmId")
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
