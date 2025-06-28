import http from "../../../utilits/httpClient";

  export const addEmployeeRating = async (values) => {
    try {
    const { data } = await http().post(`employee/create/employee-rating`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };


  export const createSkillsRatingByPm = async (values) => {
    try {
    const { data } = await http().post(`employee/create-skill-rating-by-pm`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };


  export const createskillratinglistbypm = async (values) => {
    try {
    const { data } = await http().post(`employee/create-skill-rating-list-by-pm`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };
  export const createEmpRating = async (values) => {
    try {
    const { data } = await http().post(`/employee/create/employee-rating`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const updateEmpRating = async (values) => {
    try {
    const { data } = await http().put(`/employee/update/employee-rating-by-pm`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };