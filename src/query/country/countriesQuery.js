import { toaster } from '../../utilits/toast'
import { useQuery } from 'react-query'
import { getCountries , getStates } from './countriesApi'


export const useGetCountries = () => {
  return useQuery('getCountries', getCountries, {
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useGetStates = (value) => {
  return useQuery(['getStates', value], () => getStates(value), {enabled: value ? true : false},{
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}