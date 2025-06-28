import http from "../../../utilits/httpClient";

  export const getTodo = async (uuid) => {
    try {
      const { data } = await http().get(`/employee/todo/get/${uuid}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };