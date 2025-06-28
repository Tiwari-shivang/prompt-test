import { toaster } from '../../../utilits/toast'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getAllLeavesById , getPendingLeaves } from './allLeavesApi'


export const useGetAllLeavesById = (values) =>{
    return useQuery(["getAllLeavesById", values], () =>  getAllLeavesById(values), {
      onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }
  
  export const useGetPendingLeaves = (id) =>{
    return useQuery(["getPendingLeaves", id], () =>  getPendingLeaves(id) , {enabled: id ? true : false}, {
      onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }