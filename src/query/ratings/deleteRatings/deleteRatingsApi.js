import http from "../../../utilits/httpClient";

  export const deleteEmpSkillRating = async (id) => {
    try {
    const { data } = await http().delete(`employee/delete/employee-skill/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };