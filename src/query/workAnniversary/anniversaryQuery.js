import { toaster } from '../../utilits/toast'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getWorkAnniversary } from './anniversaryApi'



export const useGetWorkAnniversary = () =>{
    return useQuery("getWorkAnniversary", getWorkAnniversary, {
        onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }


  