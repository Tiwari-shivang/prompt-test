import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { updateBuHeadById, updateBuHead } from './updateBuHeadApi'

export const useUpdateBuHeadById = () => {
  const cache = useQueryClient()
  //const navigate = useNavigate()
return useMutation('updateBuHeadById', updateBuHeadById, {
  onSuccess: (res, variables, context) =>{
      toaster("success", "Successfully Updated");  
      cache.invalidateQueries("getAllBusinessUnitById")
  },
  onError: (error) =>{
      toaster("error", error.message);
  }
  })
}

export const useUpdateBuHead = () => {
return useMutation('updateBuHead', updateBuHead, {
  onSuccess: (res, variables, context) =>{
      toaster("success", "Successfully Updated");  
  },
  onError: (error) =>{
      toaster("error", error.message);
  }
  })
}