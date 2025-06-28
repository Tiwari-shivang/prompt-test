import { useQuery } from "react-query";
import { getSkill } from "./getSkillApi";
import { toaster } from "../../../utilits/toast";
import { getAllSkills } from "./getSkillApi";

export const useGetSkill = (id) => {
    return useQuery(
        ["getSkill", id],
        () => getSkill(id),
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
}

export const useGetAllSkills = () => {
    return useQuery(
        ["getAllSkills"],
        () => getAllSkills(),
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};