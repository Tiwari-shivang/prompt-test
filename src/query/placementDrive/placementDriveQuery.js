import { useMutation, useQuery ,useQueryClient } from "react-query";
import { toaster } from "../../utilits/toast";
import { addPlacementDrive, getAllPlacementDrive } from "./placementDriveApi";

export const useGetAllPlacementDrive = () => {
  return useQuery(
    ["getAllPlacementDrive"],
    () => getAllPlacementDrive(),
    {
      onError: (error) => {
        toaster("error", error.message);
      },
    }
  );
};

export const useAddPlacementDrive = () => {
  const cache = useQueryClient()
  return useMutation("addPlacementDrive", addPlacementDrive, {
    onSuccess: () => {
      toaster("success", "Successfully Added");
      cache.invalidateQueries("getAllPlacementDrive")
    },
    onError: (error) => {
      toaster("error", error.message);
    },
  });
};
