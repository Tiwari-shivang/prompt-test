import { useQuery } from 'react-query';
import { toaster } from '../../../utilits/toast';
import { getAllReferralByEmpId, getAllReferralForHr } from "./allReferralApi";

export const useGetAllReferralByEmpId = (id) =>{
    return useQuery(["getAllReferralByEmpId", id], () =>  getAllReferralByEmpId(id), {
      onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }

    
  export const useGetAllReferralForHr = () => {
    return useQuery('getAllReferralForHr', getAllReferralForHr, {
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }