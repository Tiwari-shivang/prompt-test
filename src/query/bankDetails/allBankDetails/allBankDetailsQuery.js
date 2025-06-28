import { useQuery } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { getBankDetails } from './allBankDetailsApi'

export const useGetBankDetails = (uuid) =>{
    return useQuery(["getBankDetails", uuid], () =>  getBankDetails(uuid), {
      onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }