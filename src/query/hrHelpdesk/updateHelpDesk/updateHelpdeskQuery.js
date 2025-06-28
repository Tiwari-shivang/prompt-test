import { updateHrTicketStatus , updateHrTicketAssignedTo , updateHrTicketPriority , updateHrNotes} from "./updateHelpdeskApi";
import { toaster } from '../../../utilits/toast'
import { useMutation , useQueryClient} from 'react-query'

export const useUpdateHrTicketStatus = () => {
    const cache = useQueryClient()
    return useMutation('updateHrTicketStatus', updateHrTicketStatus, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Updated");
          cache.invalidateQueries("getAllHrTicketDetailsById")
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const  useUpdateHrTicketAssignedTo = () => {
   const cache = useQueryClient()
    return useMutation('updateHrTicketAssignedTo', updateHrTicketAssignedTo, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Updated"); 
          cache.invalidateQueries("getAllHrTicketDetailsById")
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const  useUpdateHrTicketPriority = () => {
    // const cache = useQueryClient()
     return useMutation('updateHrTicketPriority', updateHrTicketPriority, {
       onSuccess: (res, variables, context) =>{
           toaster("success", "Successfully Updated"); 
       },
       onError: (error) =>{
           toaster("error", error.message);
       }
       })
   }
   

   export const  useUpdateHrNotes = () => {
    // const cache = useQueryClient()
     return useMutation('updateHrNotes', updateHrNotes, {
       onSuccess: (res, variables, context) =>{
           toaster("success", "Successfully Updated"); 
       },
       onError: (error) =>{
           toaster("error", error.message);
       }
       })
   }