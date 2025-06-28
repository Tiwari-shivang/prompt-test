import http from "../../utilits/httpClient";


export const getOnLeave = async () => {
	try {
		const { data } = await http().get(`/employee/get/employee-by-leave`);
		return data
	} catch (error) {
		throw Error(error.response.data.message)
	}
};