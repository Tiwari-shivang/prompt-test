import http from "../../../utilits/httpClient";


export const deleteClient = async (id) => {
    try {
    const { data } = await http().delete(`clients/delete/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };