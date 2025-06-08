import http from "../../../utilits/httpClient";

export const addResignation = async (values) => {
    try {
      const { data } = await http().post(`/employee/resignation/create`, values);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };