import http from "../../utilits/httpClient";


export const getWorkAnniversary = async () => {
    try {
    const { data } = await http().get(`employee/get/todays-workAnniversary`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };