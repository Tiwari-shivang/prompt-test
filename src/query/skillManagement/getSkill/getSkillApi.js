import http from "../../../utilits/httpClient";

export const getSkill = async (id) => {
    try {
        const { data } = await http().get(`employee/skills/get/get-employee-rating-by-empUuid?empUuid=${id}`);
        return data
    } catch (error){
        throw Error(error.response.data.message)
    }
};

export const getAllSkills = async () => {
    try {
        const { data } = await http().get(`employee/skills/get-all`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};