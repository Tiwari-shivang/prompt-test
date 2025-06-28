import { useQuery } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { getIdentityById } from './allIdentityApi'


export const useGetIdentityById = (id) =>{
    return useQuery(["getIdentityById", id], () =>  getIdentityById(id), {
      onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }