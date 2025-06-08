import http from "../../../utilits/httpClient";

export const getAllLeavesById = async (values) => {
  const id = values && values.id ? values.id : null;
  const type = values && values.type ? values.type : "";
    try {
      const { data } = await http().get(`attendance/leave/get-all-by-emp-uuid/${id}?sortCriteria=${type}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };

  export const getPendingLeaves = async (id) => {
    try {
      const { data } = await http().get(`/attendance/leave/get/pending-leaves-under-project-manager/${id}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };