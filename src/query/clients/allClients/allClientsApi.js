import http from "../../../utilits/httpClient";

export const downloadCSVFile = async (id) => {
  try {
      const { data } = await http().get(`clients/get/client-csv-standard-format`);
      return data
      } catch (error){
          throw Error(error.response.data.message)
      }
};
export const getAllClients = async (values) => {
  const page = values && values.newCurrentPage ? values.newCurrentPage : "";
  const size = values && values.newCurrentPage ? values.itemsPerPage : "";
  const searchCriteria = values && values.searchValue ? values.searchValue : "";
  const department_uuid = values && values.searchDepartmentCriteria ? values.searchDepartmentCriteria : "";
    try {
    const { data } = await http().get(`clients/get?page=${page}&size=${size}&searchCriteria=${searchCriteria}&searchDepartmentCriteria=${department_uuid}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const getClientById = async (id) => {
    try {
    const { data } = await http().get(`clients/get/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const getClientContactsById = async (id) => {
    try {
    const { data } = await http().get(`clients/client-contact/get/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const getClientContactProjectByClientId = async (id) => {
    try {
    const { data } = await http().get(`clients/client-contact-project-by-client-id/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };
