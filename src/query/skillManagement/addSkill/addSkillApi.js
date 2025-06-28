import http from "../../../utilits/httpClient";

export const createSkill = async (values) => {
    try {
    const { data } = await http().post(`employee/skills/create/employee-skill-mapping`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };
