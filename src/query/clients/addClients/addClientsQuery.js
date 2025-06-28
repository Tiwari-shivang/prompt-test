import {useMutation} from "react-query";
import {useNavigate} from "react-router-dom";
import {toaster} from "../../../utilits/toast";
import {addClients, uploadClientCSV} from "./addClientsApi";

export const useAddClients = () => {
    const navigate = useNavigate();
    return useMutation("addClients", addClients, {
        onSuccess: (res, variables, context) => {
            toaster("success", "Successfully Added");
            navigate("/clients/allClient");
        },
        onError: (error) => {
            toaster("error", error.message);
        },
    });
};
export const useUploadClientCSV = () => {
    // const navigate = useNavigate();
    return useMutation("uploadClientCSV", uploadClientCSV, {
        onSuccess: (res, variables, context) => {
            // toaster("success", "Successfully Added");
            // navigate("/clients/allClient");
        },
        onError: (error) => {
            // toaster("error", error.message);
        },
    });
};
