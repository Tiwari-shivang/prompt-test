import http from "../../../utilits/httpClient";
  
  export const getEmployeeRatingByPm = async (values) => {
    const pmId = values && values.pmId ? values.pmId : "";
    const month = values && values.month ? values.month : "";
    const year = values && values.year ? values.year : "";
    try {
      const { data } = await http().get(`employee/get/employee-rating-by-pm-id?pmId=${pmId}&month=${month}&year=${year}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };

  export const getEmployeeWithSkillRatingByRmId = async (id) => {
    try {
      const { data } = await http().get(`employee/get-employee-with-skill-rating-by-rm-id/${id}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };
  export const getEmployeeRatingByEmpUuid = async (uuid) => {
    try {
      const { data } = await http().get(`/employee/get/get-employee-rating-by-empUuid?empId=${uuid}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };
