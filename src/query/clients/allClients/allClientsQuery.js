import { useQuery } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { downloadCSVFile, getAllClients, getClientById, getClientContactProjectByClientId, getClientContactsById } from './allClientsApi'

export const useDownloadCSVFile = () => {
    return useQuery("downloadCsvFile", downloadCSVFile, {
        onError: (error) =>{
          toaster("error", error.message);
        }
      });
  }
export const useGetAllClients = (values) => {
	return useQuery(["getAllClients", values], () => getAllClients(values), {
		onError: (error) => {
			toaster("error", error.message);
		}
	});
}


export const useGetClientById = (id) => {
	return useQuery(["getClientById", id], () => getClientById(id), { enabled: id ? true : false }, {
		onError: (error) => {
			toaster("error", error.message);
		}
	});
}

export const useGetClientContactsById = (id) => {
	return useQuery(["getClientContactsById", id], () => getClientContactsById(id), { enabled: id ? true : false }, {
		onError: (error) => {
			toaster("error", error.message);
		}
	});
}

export const useGetClientContactProjectByClientId = (id) => {
	return useQuery(["getClientContactProjectByClientId", id], () => getClientContactProjectByClientId(id), { enabled: id ? true : false }, {
		onError: (error) => {
			toaster("error", error.message);
		}
	});
}


