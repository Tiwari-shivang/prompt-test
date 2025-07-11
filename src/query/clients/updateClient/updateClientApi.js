import http from "../../../utilits/httpClient";


export const updateClient = async (values) => {
    try {
    const { data } = await http().put(`clients/update`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };