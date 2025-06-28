import { toaster } from '../../utilits/toast'
import { useQuery, useMutation } from 'react-query'
import { getWeatherDetail } from './weatherApi'


export const useGetWeatherDetail = (value) => {
  return useQuery(['getWeatherDetail', value], () => getWeatherDetail(value), {enabled: value ? true : false},{
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}