import http from "../../utilits/httpClient";


export const getTimeZone = async (value) => {
    try {
    const { data } = await http().get(`common-utility/get-time-zone/${value}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };