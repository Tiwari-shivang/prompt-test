import http from "../../../utilits/httpClient";


  export const addResume = async (values) => {
    try {
      const { data } = await http().post(`employee/add-resume`, values);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };