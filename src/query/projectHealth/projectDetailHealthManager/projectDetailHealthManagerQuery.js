import { useQuery } from "react-query";
import { getProjectDetailHealthByManager } from "./projectDetailHealthManagerApi";
import { toaster } from "../../../utilits/toast";


export const useGetProjectDetailHealthByManager = (id) => {
    return useQuery(
        ["getProjectDetailHealthByManager", id],
        () => getProjectDetailHealthByManager(id),
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
}