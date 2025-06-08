import { useQuery } from "react-query";
import { getClientDetailWithProject } from "./clientDetailProjectApi";
import { toaster } from "../../../utilits/toast";

export const useGetClientDetailWithProject = (id) => {
    return useQuery(
        ["getClientDetailWithProject", id],
        () => getClientDetailWithProject(id),
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
}