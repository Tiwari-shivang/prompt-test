import http from "../../../utilits/httpClient";


export const getAllHrTicket = async () => {
    try {
    const { data } = await http().get(`help-desk/hr/get-all`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const getAllHrTicketDetailsById = async (id) => {
    try {
    const { data } = await http().get(`/help-desk/hr/get-all-ticket-details-by-ticket-id/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const getNoteByEmpId = async (values) => {
    try {
    const { data } = await http().get(`/help-desk/hr/get-note?empId=${values.empId}&ticketId=${values.ticketId}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const getAllHrMessagesByTicketId = async (id) => {
    try {
    const { data } = await http().get(`help-desk/hr/get-all-messages-by-ticket-id/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const getAllHrTicketByEmpId = async (id) => {
    try {
    const { data } = await http().get(`help-desk/hr/get-all-by-empid/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  