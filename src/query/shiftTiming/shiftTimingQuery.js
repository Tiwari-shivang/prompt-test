import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toaster } from '../../utilits/toast';
import { createShiftTiming, deleteShiftTiming, getShiftTiming, getShiftTimingById, updateShiftTiming } from './shiftTimingApi';


export const useGetShiftTiming = () =>{
    return useQuery("getShiftTiming", getShiftTiming, {
        onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }


  export const useGetShiftTimingById = (id) =>{
    return useQuery(["getShiftTimingById",id], () => getShiftTimingById(id), { enabled : id ? true : false } , {
        onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }


  export const useCreateShiftTiming = () => {
    const cache = useQueryClient()
    return useMutation('createShiftTiming', createShiftTiming , {
        onSuccess: (res, variables, context) =>{
            toaster("success", "Successfully Added");
            cache.invalidateQueries("getShiftTiming")
        },
        onError: (error)=>{
            toaster("error", error.message);
        }
    })
  }

  export const useUpdateShiftTiming = () => {
    const cache = useQueryClient()
  return useMutation('updateShiftTiming', updateShiftTiming, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Updated"); 
        cache.invalidateQueries("getShiftTiming")
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}

export const useDeleteShiftTiming = () => {
  const cache = useQueryClient()
  return useMutation('deleteShiftTiming', deleteShiftTiming, {
    onSuccess: (res, variables, context) =>{
        toaster("success", "Successfully Deleted"); 
        cache.invalidateQueries("getShiftTiming")
    },
    onError: (error) =>{
        toaster("error", error.message);
    }
    })
}