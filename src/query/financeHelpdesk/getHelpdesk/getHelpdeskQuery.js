import { toaster } from '../../../utilits/toast'
import { useQuery } from 'react-query'
import { 
  getFinanceTicket,
  getAllFinanceTicketByEmpId , 
  getAllFinanceMessagesByTicketId,
  getAllFinanceTicketDetailsById,
  getNoteFinanceByEmpId } from './getHelpdeskApi'


export const useGetFinanceTicket = () => {
  return useQuery('getFinanceTicket', getFinanceTicket, {
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}
  export const useGetAllFinanceTicketByEmpId = (id) => {
    return useQuery(["getAllFinanceTicketByEmpId", id], () =>  getAllFinanceTicketByEmpId(id), {
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const useGetAllFinanceMessagesByTicketId = (id) => {
    return useQuery(["getAllFinanceMessagesByTicketId", id], () =>  getAllFinanceMessagesByTicketId(id), {
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const useGetNoteFinanceByEmpId = (values) => {
    return useQuery(["getNoteFinanceByEmpId", values], () =>  getNoteFinanceByEmpId(values), {
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }

  export const useGetAllFinanceTicketDetailsById = (id) => {
    return useQuery(["getAllFinanceTicketDetailsById", id], () =>  getAllFinanceTicketDetailsById(id), {
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }