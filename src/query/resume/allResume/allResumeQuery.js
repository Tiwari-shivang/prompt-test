import { toaster } from '../../../utilits/toast'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getAllResumeById } from './allResumeApi'


export const useGetAllResumeById = (id) =>{
    return useQuery(["getAllResumeById", id], () =>  getAllResumeById(id), {
      onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }
  