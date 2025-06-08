import { toaster } from '../../utilits/toast'
import { useMutation, useQueryClient } from 'react-query'
import {addMember, updateMember} from './editAddMemberApi'


export const useEditAddMember = (id) => {
    
  const cache = useQueryClient()

    return useMutation(
        id ? 'updateMember' : 'addMember', 
        id ? updateMember : addMember, {
        onSuccess: () =>{
          cache.invalidateQueries("getMemberData")
        },
        onError: (error) =>{
          toaster("error", error.message);
        }
      })
}