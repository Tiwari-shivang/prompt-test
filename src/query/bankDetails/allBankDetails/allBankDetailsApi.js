import http from "../../../utilits/httpClient";

export const getBankDetails = async (uuid) => {
    try {
      const { data } = await http().get(`/employee/get/bank-details-by-empid/${uuid}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };