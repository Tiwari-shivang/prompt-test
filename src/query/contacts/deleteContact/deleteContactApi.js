import http from "../../../utilits/httpClient";


export const deleteContact = async (id) => {
    try {
    const { data } = await http().delete(`clients/contact/delete/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };