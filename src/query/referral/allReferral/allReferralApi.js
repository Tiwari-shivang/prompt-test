import http from "../../../utilits/httpClient";

export const getAllReferralByEmpId = async (id) => {
    try {
      const { data } = await http().get(`employee/get-all-referral-by-id/${id}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };

  
  export const getAllReferralForHr = async () => {
    try {
    const { data } = await http().get(`employee/get-all-referral`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };