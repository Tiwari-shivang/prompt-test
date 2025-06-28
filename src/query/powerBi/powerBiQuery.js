import { useQuery } from "react-query";
import { toaster } from "../../utilits/toast";
import { powerBiReport } from "./powerBiApi";



export const usePowerBiReport = () => {
    return useQuery("powerBiReport", powerBiReport, {
        onError: (error) => {
            toaster("error", error.message);
        }
    });
}