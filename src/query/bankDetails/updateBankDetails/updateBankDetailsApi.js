import http from "../../../utilits/httpClient";

export const updateBankDetails = async (values) => {
    try {
    const { data } = await http().put(`/employee/update/bank-details`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };