import { useQuery } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { getAllLocations, getGeoLocation } from './allLocationApi'


export const useGetAllLocations = () => {
	return useQuery("getAllLocations", getAllLocations, {
		onError: (error) => {
			toaster("error", error.message);
		}
	});
}


export const useGetGeoLocation = () => {
	return useQuery("getGeoLocation", getGeoLocation, {
		onError: (error) => {
			toaster("error", error.message);
		}
	});
}
