import http from "../../utilits/httpClient";
import { capitalizeFirstLetter } from "../../utilits/usefulFunctions";

export const getSkills = async (id) => {
    try {
    const { data } = await http().get(`employee/skills/get-all`);
    return data.map(skill=>({...skill, 'skill_name': capitalizeFirstLetter(skill?.skill_name??'')}))
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const updateSkillByEmpUuid = async (values) => {
    try {
    const { data } = await http().put(`employee/skills/update/employee-skill-by-uuid`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };