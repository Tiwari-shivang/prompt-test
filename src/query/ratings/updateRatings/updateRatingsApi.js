import http from "../../../utilits/httpClient";

  export const updateEmpRatingByPm = async (values) => {
    const id = values.id;
    try {
    const { data } = await http().put(`employee/update/employee-rating-by-pm`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const updateSkillRatingByPm = async (values) => {
    const id = values.id;
    try {
    const { data } = await http().put(`employee/update/skill-rating-by-pm`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };