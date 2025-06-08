import http from "../../../utilits/httpClient";

export const addBankDetails = async (values) => {
    try {
      const { data } = await http().post(`/employee/create/bank-details`, values);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };