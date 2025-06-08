import { toaster } from '../../../utilits/toast'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getAuthRecoveryCodes, getAuthQrCode} from './getTwoFactorAuthApi'

export const useGetAuthRecoveryCodes = () => {
  return useQuery(['getAuthRecoveryCodes'], () => getAuthRecoveryCodes(), {
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useGetAuthQrCode = (id) => {
  return useQuery(["getAuthQrCode", id], () => getAuthQrCode(id), { enabled: id ? true : false }, {
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

  
  


  
  
 