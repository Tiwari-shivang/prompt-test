import { useMutation, useQueryClient } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { createHrMessage, createHrNote, createHrTicket } from './addHelpdeskApi'



export const useCreateHrTicket = () => {
  return useMutation('createHrTicket', createHrTicket, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Added"); 
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useCreateHrMessage = () => {
    const cache = useQueryClient()
    return useMutation('createHrMessage', createHrMessage, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Added");
          cache.invalidateQueries("getAllHrMessagesByTicketId") 
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const useCreateHrNote = () => {
    const cache = useQueryClient()
    return useMutation('createHrNote', createHrNote, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Added");
          cache.invalidateQueries("getNoteByEmpId") 
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }
