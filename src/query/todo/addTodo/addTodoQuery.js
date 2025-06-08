import { useMutation, useQueryClient } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { addTodo } from './addTodoApi'


export const useAddTodo = () => {
	const cache = useQueryClient()
	return useMutation('addTodo', addTodo, {
		onSuccess: (res, variables, context) => {
			toaster("success", "Successfully Added");
			cache.invalidateQueries("getTodo")
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}