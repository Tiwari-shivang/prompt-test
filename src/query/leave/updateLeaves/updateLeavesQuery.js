import { toaster } from '../../../utilits/toast'
import { useMutation, useQueryClient  } from 'react-query'
import { updateLeaveStatus } from './updateLeavesApi'

export const useUpdateLeaveStatus = () => {
    const cache = useQueryClient()
  return useMutation('updateLeaveStatus', updateLeaveStatus, {
    onSuccess: (res, variables, context) =>{
        variables.newStatus=="Approved"? toaster("success", "Successfully Approved"): toaster("success", "Successfully Rejected");
        cache.invalidateQueries("getPendingLeaves")
    },
    onError: (error) =>{
		toaster("error", error.message);
		cache.invalidateQueries("getPendingLeaves")
    }
    })
}