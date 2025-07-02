import { useMutation, useQueryClient } from "react-query";
import { deleteSkill } from "./deleteSkillApi";
import { toaster } from "../../../utilits/toast";

export const useDeleteSkill = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ employeeUuid, skillUuid }) => deleteSkill(employeeUuid, skillUuid),
        onSuccess: (data, variables, context) => {
            toaster("success", "Skill deleted successfully");
            
            // Invalidate related queries to refresh data
            queryClient.invalidateQueries(["getSkill"]);
            queryClient.invalidateQueries(["getAllSkills"]);
        },
        onError: (error, variables, context) => {
            console.error("Delete skill error:", error);
            toaster("error", error.message || "Failed to delete skill");
        },
    });
};