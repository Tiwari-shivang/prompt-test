import http from "../../../utilits/httpClient";


export const createFinanceTicket = async (values) => {
    try {
    const { data } = await http().post(`help-desk/finance/create-ticket`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const createFinanceMessage = async (values) => {
    try {
    const { data } = await http().post(`help-desk/finance/create/message`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const createFinanceNote = async (values) => {
    try {
    const { data } = await http().post(`/help-desk/finance/create-note`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };


  