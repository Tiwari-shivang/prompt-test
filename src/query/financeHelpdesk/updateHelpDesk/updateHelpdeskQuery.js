import { useMutation, useQueryClient } from 'react-query';
import { toaster } from '../../../utilits/toast';
import { updateFinanceAssignedTo, updateFinanceNotes, updateFinancePriority, updateFinanceTicketStatus } from "./updateHelpdeskApi";

export const useUpdateFinanceTicketStatus = () => {
    const cache = useQueryClient()
    return useMutation('updateFinanceTicketStatus', updateFinanceTicketStatus, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Updated"); 
          cache.invalidateQueries("getAllFinanceTicketDetailsById") 
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const  useUpdateFinanceAssignedTo = () => {
    const cache = useQueryClient()
    return useMutation('updateFinanceAssignedTo', updateFinanceAssignedTo, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Updated"); 
          cache.invalidateQueries("getAllFinanceTicketDetailsById") 
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  

  export const  useUpdateFinancePriority = () => {
    // const cache = useQueryClient()
     return useMutation('updateFinancePriority', updateFinancePriority, {
       onSuccess: (res, variables, context) =>{
           toaster("success", "Successfully Updated"); 
       },
       onError: (error) =>{
           toaster("error", error.message);
       }
       })
   }

   export const  useUpdateFinanceNotes = () => {
     const cache = useQueryClient()
     return useMutation('updateFinanceNotes', updateFinanceNotes, {
       onSuccess: (res, variables, context) =>{
           toaster("success", "Successfully Updated"); 
           cache.invalidateQueries("getAllFinanceTicketDetailsById") 
       },
       onError: (error) =>{
           toaster("error", error.message);
       }
       })
   }