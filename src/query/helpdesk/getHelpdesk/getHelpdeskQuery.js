import { useQuery } from 'react-query'
import { toaster } from '../../../utilits/toast'
import {
	getAllAdminDetailsByTicketId,
	getAllBugForHr,
	getAllMessagesByTicketId,
	getItAdminEmployees,
	getNoteItByEmpId,
	getTicketsForItDashboard
} from './getHelpdeskApi'


export const useGetItAdminEmployees = () => {
	return useQuery('getItAdminEmployees', getItAdminEmployees, {
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}

export const useGetTicketsForItDashboard = () => {
	return useQuery('getTicketsForItDashboard', getTicketsForItDashboard, {
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}

export const useGetAllBugForHr = () => {
	return useQuery('getAllBugForHr', getAllBugForHr, {
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}

export const useGetNoteItByEmpId = (values) => {
	return useQuery(["getNoteItByEmpId", values], () => getNoteItByEmpId(values), {
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}

export const useGetAllAdminDetailsByTicketId = (id) => {
	return useQuery(["getAllAdminDetailsByTicketId", id], () => getAllAdminDetailsByTicketId(id), { enabled: id ? true : false }, {
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}

export const useGetAllMessagesByTicketId = (id) => {
	return useQuery(["getAllMessagesByTicketId", id], () => getAllMessagesByTicketId(id), { enabled: id ? true : false }, {
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}