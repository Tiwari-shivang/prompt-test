import { useMutation, useQueryClient } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { addResume } from './addResumeApi'


export const useAddResume = () => {
	const cache = useQueryClient()
	return useMutation('addResume', addResume, {
		onSuccess: (res, variables, context) => {
			toaster("success", "Successfully Added");
			cache.invalidateQueries("getAllResumeById")
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}