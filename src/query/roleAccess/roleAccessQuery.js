import { toaster } from '../../utilits/toast'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAllAccessWithPermission , updateAccessPermission } from './roleAccessApi'


export const useGetAllAccessWithPermission = () =>{
  return useQuery('getAllAccessWithPermission', getAllAccessWithPermission, {
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
  }

  export const useUpdateAccessPermission = () => {
    const cache = useQueryClient()
    return useMutation('updateAccessPermission', updateAccessPermission, {
      onSuccess: (res, variables, context) =>{
        cache.invalidateQueries("getAllAccessWithPermission")
          toaster("success", "Successfully Updated"); 
        //   cache.invalidateQueries("getAllMessagesByTicketId")
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }