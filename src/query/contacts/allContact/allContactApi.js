import http from "../../../utilits/httpClient";


export const getAllContacts = async () => {
    try {
    const { data } = await http().get(`clients/contact/get`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const getContactsById = async (id) => {
    try {
    const { data } = await http().get(`clients/contact/get/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };