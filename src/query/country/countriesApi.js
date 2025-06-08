import http from "../../utilits/httpClient";


export const getCountries = async (id) => {
    try {
    const { data } = await http().get(`common-utility/get-countries`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const getStates = async (value) => {
    try {
    const { data } = await http().get(`common-utility/get-states-by-country/${value}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };