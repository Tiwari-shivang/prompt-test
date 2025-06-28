import { useQuery } from 'react-query'
import { toaster } from '../../../utilits/toast'
import {
	getAllHrMessagesByTicketId,
	getAllHrTicket,
	getAllHrTicketByEmpId,
	getAllHrTicketDetailsById,
	getNoteByEmpId
} from './getHelpdeskApi'


export const useGetAllHrTicket = () => {
  return useQuery('getAllHrTicket', getAllHrTicket, {
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

  export const useGetAllHrTicketDetailsById = (id) => {
    return useQuery(["getAllHrTicketDetailsById", id], () =>  getAllHrTicketDetailsById(id), {
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const useGetAllHrMessagesByTicketId = (id) => {
    return useQuery(["getAllHrMessagesByTicketId", id], () =>  getAllHrMessagesByTicketId(id), {
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const useGetNoteByEmpId = (values) => {
    return useQuery(["getNoteByEmpId", values], () =>  getNoteByEmpId(values), {
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const useGetAllHrTicketByEmpId = (id) => {
    return useQuery(["getAllHrTicketByEmpId", id], () =>  getAllHrTicketByEmpId(id), {
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }