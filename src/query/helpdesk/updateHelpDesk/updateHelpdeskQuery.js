import { updateTicketStatus ,updateItNote, updateAssignedTo} from "./updateHelpdeskApi";
import { toaster } from '../../../utilits/toast'
import { useMutation , useQueryClient} from 'react-query'

export const useUpdateTicketStatus = () => {
    const cache = useQueryClient()
    return useMutation('updateTicketStatus', updateTicketStatus, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Updated"); 
          cache.invalidateQueries("getAllAdminDetailsByTicketId")
          cache.invalidateQueries("getAllMessagesByTicketId")
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const  useUpdateAssignedTo = () => {
    const cache = useQueryClient()
    return useMutation('updateAssignedTo', updateAssignedTo, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Updated"); 
          cache.invalidateQueries("getAllAdminDetailsByTicketId")
          cache.invalidateQueries("getAllMessagesByTicketId")
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const  useUpdateItNote = () => {
    const cache = useQueryClient()
    return useMutation('updateItNote', updateItNote, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Updated"); 
          cache.invalidateQueries("getAllAdminDetailsByTicketId")
          cache.invalidateQueries("getAllMessagesByTicketId")
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }