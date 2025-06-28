import {useMutation, useQuery, useQueryClient} from "react-query";
import {toaster} from "../../utilits/toast";
import {addquickAccess, deleteQuickAccess, getAllquickAccess} from "./quickAccessApi";

export const useGetAllquickAccess = (id) => {
    return useQuery(
        ["getAllquickAccess", id],
        () => getAllquickAccess(id),
        // {enabled: id ? true : false},
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
};

export const useAddquickAccess = () => {
    const cache = useQueryClient();
    return useMutation("addquickAccess", addquickAccess, {
        onSuccess: () => {
            toaster("success", "Successfully Added");
            cache.invalidateQueries("getAllquickAccess");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};

export const useDeleteQuickAccess = () => {
    const cache = useQueryClient();
    return useMutation("deleteQuickAccess", deleteQuickAccess, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Delete");
            cache.invalidateQueries("getAllquickAccess");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};
