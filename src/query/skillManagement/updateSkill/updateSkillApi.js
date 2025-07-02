import http from "../../../utilits/httpClient";

export const updateSkill = async (skillData) => {
    try {
        if (!skillData) {
            throw new Error("Skill ID is required for update operation");
        }

        const { data } = await http().put(
            `employee/skills/update/employee-skill-mapping`, 
            skillData
        );
        return data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || 
            error.message || 
            "Failed to update skill mapping"
        );
    }
};