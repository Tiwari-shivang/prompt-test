import http from "../../../utilits/httpClient";

export const deleteSkill = async (id) => {
    try {
    const { data } = await http().delete(`employee/skills/delete-employee-skill-mapping-by-uuids/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };