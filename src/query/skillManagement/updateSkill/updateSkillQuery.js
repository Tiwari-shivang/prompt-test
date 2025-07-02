import { useMutation, useQueryClient } from "react-query";
import { updateSkill } from "./updateSkillApi";
import { toaster } from "../../../utilits/toast";

export const useUpdateSkill = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: updateSkill,
        onSuccess: (data, variables, context) => {
            toaster("success", "Skill updated successfully");
            
            // Invalidate related queries to refresh data
            queryClient.invalidateQueries(["getSkill"]); 
            queryClient.invalidateQueries(["getAllSkills"]);
        },
        onError: (error, variables, context) => {
            console.error("Update skill error:", error);
            toaster("error", error.message || "Failed to update skill");
        },
    });
};