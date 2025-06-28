import { toaster } from '../../utilits/toast'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getUniversalSearch } from './universalSearchApi'


export const useGetuniversalSearch = (data) => {
	return useQuery(["getUniversalSearch", data && data.search], () => getUniversalSearch(data), { enabled: data.search ? true : false }, {
		onError: (error) => {
			toaster("error", error.message);
		}
	});
}
