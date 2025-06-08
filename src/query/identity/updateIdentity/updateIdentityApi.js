import http from "../../../utilits/httpClient";

export const updateIdentity = async (values) => {
    try {
    const { data } = await http().put(`/employee/identityInformation/update`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };