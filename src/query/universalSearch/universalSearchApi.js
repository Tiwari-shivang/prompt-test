import http from "../../utilits/httpClient";

  export const getUniversalSearch = async (values) => {
    const searchStr = values && values.search
    try {
    const { data } = await http().get(`employee/get/search?searchStr=${searchStr}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

