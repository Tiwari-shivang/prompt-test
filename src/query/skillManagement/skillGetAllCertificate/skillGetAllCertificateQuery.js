import { useQuery } from "react-query";
import { toaster } from "../../../utilits/toast";


export const useGetSkilAllCertificate = (id) => {
    return useQuery(
        ["getSkilAllCertificate", id],
        () => (id),
        {
            onError: (error) => {
                toaster("error", error.message);
            },
        }
    );
}