import http from "../../../utilits/httpClient";

export const addIdentityDetails = async (values) => {
    try {
      const { data } = await http().post(`/employee/identityInformation/create`, values);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };