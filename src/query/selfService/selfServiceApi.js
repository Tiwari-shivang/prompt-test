import http from "../../utilits/httpClient";


export const getSelfService = async (value) => {
    try {
    const { data } = await http().get(`employee/get/self-service-employee/${value}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };