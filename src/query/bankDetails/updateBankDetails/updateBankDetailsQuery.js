import { updateBankDetails } from "./updateBankDetailsApi";
import { toaster } from "../../../utilits/toast";
import { useQueryClient , useMutation } from "react-query";

export const useUpdateBankDetails = () => {
    const cache = useQueryClient()
    return useMutation('updateBankDetails', updateBankDetails, {
      onSuccess: (res, variables, context) =>{
          toaster("success", "Successfully Updated"); 
          cache.invalidateQueries("getBankDetails")
      },
      onError: (error) =>{
          toaster("error", error.message);
      }
      })
  }