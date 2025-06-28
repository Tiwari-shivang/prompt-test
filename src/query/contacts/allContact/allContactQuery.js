import { useQuery } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { getAllContacts, getContactsById } from './allContactApi'


export const useGetAllContacts = () => {
	return useQuery("getAllContacts", getAllContacts, {
		onError: (error) => {
			toaster("error", error.message);
		}
	});
}


export const useGetContactsById = (id) => {
	return useQuery(["getContactsById", id], () => getContactsById(id), { enabled: id ? true : false }, {
		onError: (error) => {
			toaster("error", error.message);
		}
	});
}