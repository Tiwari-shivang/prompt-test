import { useQuery } from "react-query";
import { getProjectDetailByProjectId } from "./getProjectHealthDetailsById";
import { toaster } from "../../../utilits/toast";
export const useGetProjectDetailByProjectId = (projectId) => {
  return useQuery(
    ["getProjectDetailByProjectId", projectId],
    () => getProjectDetailByProjectId(projectId),
    {
      enabled: Boolean(projectId),
      onError: (error) => {
        toaster("error", error.message);
      },
    }
  );
};