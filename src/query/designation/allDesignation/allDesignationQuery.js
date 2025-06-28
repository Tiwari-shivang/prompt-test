import { useQuery } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { getAllDesignation } from './allDesignationApi'


export const useGetAllDesignation = () => {
  return useQuery('getAllDesignation', getAllDesignation, {
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}