import http from '../../utilits/httpClient'

export const getNotifications = async (userName) => { 
	try {
		const { data } = await http().get(`/notification/get-by-username/${userName}`);
		return data
	} catch (error) {
		throw Error(error.response.data.message)
	}
};