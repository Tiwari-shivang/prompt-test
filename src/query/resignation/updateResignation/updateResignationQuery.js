import {updateResignationResponse, updateResignationWithdraw} from "./updateResignationApi";
import { toaster } from '../../../utilits/toast'
import { useMutation , useQueryClient} from 'react-query'

export const useUpdateResignationResponse = () => {
    const cache = useQueryClient()
    return useMutation('updateResignationResponse', updateResignationResponse, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Updated"); 
        //  cache.invalidateQueries("getAllAdminDetailsByTicketId")
        //  cache.invalidateQueries("getAllMessagesByTicketId")
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const  useUpdateResignationWithdraw = () => {
    const cache = useQueryClient()
    return useMutation('updateResignationWithdraw', updateResignationWithdraw, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully withdrawn"); 
        //   cache.invalidateQueries("getAllAdminDetailsByTicketId")
        //   cache.invalidateQueries("getAllMessagesByTicketId")
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }