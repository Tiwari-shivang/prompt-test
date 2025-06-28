import { useQuery } from 'react-query'
import { toaster } from '../../utilits/toast'
import { getOnLeave } from './onLeaveApi';

export const useGetOnLeave = () => {
	return useQuery("getOnLeave", getOnLeave, {
		onError: (error) => {
			toaster("error", error.message);
		}
	});
}


