import { toaster } from '../../utilits/toast'
import { useQuery, useMutation } from 'react-query'
import { getAllHolidays , uploadHolidays } from './holidaysApi'


export const useGetAllHolidays = (values) =>{
    return useQuery(["getAllHolidays", values], () => getAllHolidays(values), {
        onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }

  export const useUploadHolidays = () => {
    //const cache = useQueryClient()
    return useMutation('uploadHolidays', uploadHolidays , {
        onSuccess: (res, variables, context) =>{
            toaster("success", "Successfully Added");
            // cache.invalidateQueries("getAllResumeById")
        },
        onError: (error)=>{
            toaster("error", error.message);
        }
    })
  }