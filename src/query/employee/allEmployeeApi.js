import http from "../../utilits/httpClient";

export const getAllBySkillUuid = async (skillUuid) => {
    try {
        const {data} = await http().get(`/employee/skills/get/employee-by-skill-uuid/${skillUuid}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllSkillWithCustomSkill = async () => {
    try {
        const {data} = await http().get(`/employee/skills/get/all-skill-with-custom-skill`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getAllCertificatesByEmpUuid = async (empUuid) => {
    try {
        const {data} = await http().get(`/employee/skills/get/all-certificate-by-emp/${empUuid}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const createSkillCertificate = async (values) => {
    try {
        const {data} = await http().post(`/employee/skills/create/skill-certificate`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const getEmpRatingByEmpUuid = async (empUuid) => {
    const id = empUuid ?? "";
    try {
        const {data} = await http().get(`/employee/get/get-employee-rating-by-empUuid?empId=${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};
