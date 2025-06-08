import http from "../../../utilits/httpClient";


export const getFinanceTicket = async () => {
    try {
    const { data } = await http().get(`help-desk/finance/get-tickets-for-finance-dashboard`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const getAllFinanceTicketByEmpId = async (id) => {
    try {
    const { data } = await http().get(`help-desk/finance/get-all-tickets-by-employee-id/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const getAllFinanceMessagesByTicketId = async (id) => {
    try {
    const { data } = await http().get(`help-desk/finance/get-all-messages-emp-by-ticket-id/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const getNoteFinanceByEmpId = async (values) => {
    try {
    const { data } = await http().get(`/help-desk/finance/get-note?empId=${values.empId}&ticketUuid=${values.ticketUuid}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };
  

  export const getAllFinanceTicketDetailsById = async (id) => {
    try {
    const { data } = await http().get(`help-desk/finance/get-all-admin-details-by-ticket-id/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };