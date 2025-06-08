import { toaster } from '../../../utilits/toast'
import { addBankDetails } from './addBankDetailsApi'
import { useMutation , useQueryClient} from 'react-query'


export const useAddBankDetails = () => {
    const cache = useQueryClient()
    return useMutation('addBankDetails', addBankDetails , {
        onSuccess: (res, variables, context) =>{
            toaster("success", "Successfully Created");
            cache.invalidateQueries("getBankDetails")
        },
        onError: (error)=>{
            toaster("error", error.message);
        }
    })
  }