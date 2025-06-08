import { useQuery } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { getAllDepartments } from './allDepartmentsApi'


export const useGetAllDepartments = () => {
	return useQuery("getAllDepartments", getAllDepartments, {
		onError: (error) => {
			toaster("error", error.message);
		}
	});
}
