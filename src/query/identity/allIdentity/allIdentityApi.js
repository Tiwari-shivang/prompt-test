import http from "../../../utilits/httpClient";

export const getIdentityById = async (id) => {
    try {
      const { data } = await http().get(`employee/identityInformation/getIdentityInfo/${id}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };