import { toaster } from '../../utilits/toast'
import { useQuery, useMutation } from 'react-query'
import { getTimeZone } from './timeZoneApi'


export const useGetTimeZone = (value) => {
  return useQuery(['getTimeZone', value], () => getTimeZone(value), {enabled: value ? true : false},{
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}