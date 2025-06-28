import { useMutation, useQueryClient } from 'react-query'
import { createTicket , createMessage , reportBug , createItNote} from './addHelpdeskApi'
import { toaster } from '../../../utilits/toast'



export const useCreateTicket = () => {
  return useMutation('createTicket', createTicket, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Added"); 
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useCreateMessage = () => {
    const cache = useQueryClient()
    return useMutation('createMessage', createMessage, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Added");
          cache.invalidateQueries("getAllMessagesByTicketId") 
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const useCreateItNote = () => {
    const cache = useQueryClient()
    return useMutation('createItNote', createItNote, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Added");
          cache.invalidateQueries("getAllMessagesByTicketId") 
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const useReportBug = () => {
    return useMutation('reportBug', reportBug, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Added"); 
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }
  