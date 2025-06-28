import http from "../../../utilits/httpClient";


export const createTicket = async (values) => {
    try {
    const { data } = await http().post(`help-desk/it-admin/create-ticket`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const createMessage = async (values) => {
    try {
    const { data } = await http().post(`help-desk/it-admin/create-message`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const createItNote = async (values) => {
    try {
    const { data } = await http().post(`/help-desk/it-admin/create-note`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const reportBug = async (values) => {
    try {
    const { data } = await http().post(`/help-desk/bug/create/bug-details`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };