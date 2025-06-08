import { toaster } from '../../utilits/toast'
import { useQuery, useMutation } from 'react-query'
import { getSelfService } from './selfServiceApi'


export const useGetSelfService = (id) => {
  return useQuery(['getSelfService', id], () => getSelfService(id), {enabled: id ? true : false},{
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}