import http from "../../../utilits/httpClient";

export const addReferral = async (values) => {
    try {
      const { data } = await http().post(`/employee/create-referral`, values);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };

  export const updateReferral = async (values) => {
    try {
    const { data } = await http().put(`/employee/update/referral-status`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };