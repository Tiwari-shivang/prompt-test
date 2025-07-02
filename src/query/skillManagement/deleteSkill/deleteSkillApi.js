import http from "../../../utilits/httpClient";
export const deleteSkill = async (employeeUuid, skillUuid) => {
    try {
        if (!employeeUuid || !skillUuid) {
            throw new Error("Both employeeUuid and skillUuid are required");
        }

        const { data } = await http().delete(
            `employee/skills/delete-employee-skill-mapping-by-uuids/${employeeUuid}/${skillUuid}`
        );
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to delete skill mapping");
    }
};