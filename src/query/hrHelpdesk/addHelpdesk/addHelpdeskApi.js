import http from "../../../utilits/httpClient";


export const createHrTicket = async (values) => {
    try {
    const { data } = await http().post(`help-desk/hr/create`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const createHrMessage = async (values) => {
    try {
    const { data } = await http().post(`help-desk/hr/create-message`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const createHrNote = async (values) => {
    try {
    const { data } = await http().post(`help-desk/hr/create-message`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };