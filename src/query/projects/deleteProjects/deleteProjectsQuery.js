import {useMutation, useQueryClient} from "react-query";
import {toaster} from "../../../utilits/toast";
import {deleteProject, hardDeleteTeamMember, softDeleteTeamMember} from "./deleteProjectsApi";

export const useDeleteProject = () => {
    const cache = useQueryClient();
    return useMutation("deleteProject", deleteProject, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Deleted");
            cache.invalidateQueries("getAllProjectWithAssociatedEmployee");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useSoftDeleteTeamMember = (
    refetchProjectInfoOfCurrentEmp,
    refetchMembers
) => {
    const cache = useQueryClient();
    return useMutation("softDeleteTeamMember", softDeleteTeamMember, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Deleted");
            cache.invalidateQueries("getAllProjectMembersInPhase");
            if (refetchProjectInfoOfCurrentEmp) refetchProjectInfoOfCurrentEmp();
            if (refetchMembers) refetchMembers();
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useHardDeleteTeamMember = (
    refetchProjectInfoOfCurrentEmp,
    refetchMembers
) => {
    const cache = useQueryClient();
    return useMutation("hardDeleteTeamMember", hardDeleteTeamMember, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Deleted");
            cache.invalidateQueries("getProjectMemberByProjectId");
            if (refetchProjectInfoOfCurrentEmp) refetchProjectInfoOfCurrentEmp();
            if (refetchMembers) refetchMembers();
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};
