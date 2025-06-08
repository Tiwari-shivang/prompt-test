import http from "../../../utilits/httpClient";


export const updateContact = async (values) => {
    try {
    const { data } = await http().put(`clients/contact/update`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };