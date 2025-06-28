import { useQuery } from 'react-query'
import { toaster } from '../../utilits/toast'
import { getBirthday } from './birthdayApi'
   
export const useGetBirthday = () =>{
    return useQuery("getBirthday", getBirthday, {
        onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }
  