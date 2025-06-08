import http from "../../utilits/httpClient";


export const getBirthday = async () => {
    try {
    const { data } = await http().get(`employee/get/todays-birthday`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };