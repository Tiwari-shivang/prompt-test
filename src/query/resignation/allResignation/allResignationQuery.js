import { toaster } from '../../../utilits/toast'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getResignation , getAllResignationForHr } from "./allResignationApi";

export const useGetResignation = (id) =>{
    return useQuery(["getResignation", id], () =>  getResignation(id), {
      onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }


  export const useGetAllResignationForHr = () => {
    return useQuery('getAllResignationForHr', getAllResignationForHr, {
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }