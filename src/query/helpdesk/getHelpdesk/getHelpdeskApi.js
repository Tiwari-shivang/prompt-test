import http from "../../../utilits/httpClient";


export const getItAdminEmployees = async () => {
	try {
		const { data } = await http().get(`help-desk/it-admin/get-it-admin-employees`);
		return data
	} catch (error) {
		throw Error(error.response.data.message)
	}
};

export const getTicketsForItDashboard = async () => {
	try {
		const { data } = await http().get(`help-desk/it-admin/get-tickets-for-it-dashboard`);
		return data
	} catch (error) {
		throw Error(error.response.data.message)
	}
};

export const getAllBugForHr = async () => {
	try {
		const { data } = await http().get(`help-desk/bug/get-all-bug-details`);
		return data
	} catch (error) {
		throw Error(error.response.data.message)
	}
};

export const getNoteItByEmpId = async (values) => {
	try {
		const { data } = await http().get(`/help-desk/finance/get-note/empId=${values.empId}&ticketId=${values.ticketId}`);
		return data
	} catch (error) {
		throw Error(error.response.data.message)
	}
};

export const getAllAdminDetailsByTicketId = async (id) => {
	try {
		const { data } = await http().get(`help-desk/it-admin/get-all-admin-details-by-ticket-id/${id}`);
		return data
	} catch (error) {
		throw Error(error.response.data.message)
	}
};

export const getAllMessagesByTicketId = async (id) => {
	try {
		const { data } = await http().get(`help-desk/it-admin/get-all-messages-emp-by-ticket-id/${id}`);
		return data
	} catch (error) {
		throw Error(error.response.data.message)
	}
};