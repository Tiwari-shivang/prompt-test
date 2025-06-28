import http from "../../../utilits/httpClient";

export const updateSkill = async (values) => {
    try {
    const { data } = await http().put(`employee/skills/update/employee-skill-mapping`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };