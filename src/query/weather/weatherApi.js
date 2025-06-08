import http from "../../utilits/httpClient";


export const getWeatherDetail = async (value) => {
    try {
    const { data } = await http().get(`common-utility/get-weather-details/${value}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };