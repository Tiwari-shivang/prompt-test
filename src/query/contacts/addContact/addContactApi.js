import http from "../../../utilits/httpClient";


export const addContact = async (values) => {
    try {
    const { data } = await http().post(`clients/contact/create`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };
  export const addAllContacts = async (values) => {
    try {
    const { data } = await http().post(`clients/contact/create-all`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };