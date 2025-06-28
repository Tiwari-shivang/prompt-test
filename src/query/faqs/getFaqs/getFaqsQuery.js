import { useQuery } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { getAllFaqTitle, getAllFaqs, getAllUnansweredFaqs, getFaqByTitle } from './getFaqsApi'

export const useGetFaqByTitle = (id) =>{
  return useQuery(["getFaqByTitle", id], () => getFaqByTitle(id), {
      onError: (error) =>{
        toaster("error", error.message);
      }
    });
}

export const useGetAllFaqTitle = () => {
  return useQuery('getAllFaqTitle', getAllFaqTitle, {
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useGetAllFaqs = () => {
  return useQuery('getAllFaqs', getAllFaqs, {
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useGetAllUnansweredFaqs = () => {
  return useQuery('getAllUnansweredFaqs', getAllUnansweredFaqs, {
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

  
  


  
  
 