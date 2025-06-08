import { useQuery } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { getAllBusinessUnitById, getAllBusinessUnitUnderDepartment } from './allBuHeadApi'


export const useGetAllBusinessUnitById = (id) => {
	return useQuery(["getAllBusinessUnitById", id], () => getAllBusinessUnitById(id), {
		onError: (error) => {
			toaster("error", error.message);
		}
	});
}

export const useGetAllBusinessUnitUnderDepartment = (id) => {
	return useQuery(["getAllBusinessUnitUnderDepartment", id], () => getAllBusinessUnitUnderDepartment(id), { enabled: id ? true : false }, {
		onError: (error) => {
			toaster("error", error.message);
		}
	});
}
