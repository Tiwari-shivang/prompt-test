import { toaster } from '../../../utilits/toast'
import { useMutation, useQueryClient } from 'react-query'
import { addLeaveApply } from './addleavesApi'


export const useAddLeaveApply = () => {
	const cache = useQueryClient()
	return useMutation('addLeaveApply', addLeaveApply, {
		onSuccess: (res, variables, context) => {
			toaster("success", "Successfully Applied");
			cache.invalidateQueries("getAllLeavesById")
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}