import { toaster } from '../../../utilits/toast'
import { useNavigate } from "react-router-dom"
import { addResignation } from './addResignationApi'
import { useMutation, useQueryClient } from 'react-query'

export const useAddResignation = () => {
    const cache = useQueryClient()
    return useMutation('addResignation', addResignation , {
        onSuccess: (res, variables, context) =>{
            toaster("success", "Successfully Created");
            cache.invalidateQueries("getResignation")
        },
        onError: (error)=>{
            toaster("error", error.message);
        }
    })
  }