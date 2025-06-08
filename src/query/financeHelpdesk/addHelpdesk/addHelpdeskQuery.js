import { toaster } from '../../../utilits/toast'
import { useMutation, useQueryClient } from 'react-query'
import { createFinanceTicket , createFinanceMessage , createFinanceNote} from './addHelpdeskApi'



export const useCreateFinanceTicket= () => {
  return useMutation('createFinanceTicket', createFinanceTicket, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Added"); 
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useCreateFinanceMessage = () => {
    const cache = useQueryClient()
    return useMutation('createFinanceMessage', createFinanceMessage, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Added");
          cache.invalidateQueries("getAllFinanceMessagesByTicketId") 
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }
  export const useCreateFinanceNotes = () => {
    const cache = useQueryClient()
    return useMutation('createFinanceNote', createFinanceNote, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Added");
          cache.invalidateQueries("getNoteFinanceByEmpId") 
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }
  