import { useQuery } from "react-query";
import { getClientName } from "./getClientNameApi";
import { toaster } from "../../../utilits/toast";

export const useGetClientName = (exProjectId) => {
  return useQuery(
    ["getClientName", exProjectId],
    () => getClientName(exProjectId),
    {
      enabled: Boolean(exProjectId),
      onError: (error) => {
        toaster("error", error.message);
      },
    }
  );
};