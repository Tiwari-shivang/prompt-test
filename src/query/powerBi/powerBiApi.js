import http from "../../utilits/httpClient";

export const powerBiReport = async () => {
    try {
        const { data } = await http().get(`integration/get-azure-embed-token`);
        return data
    } catch (error){
        throw Error(error.response.data.message)
    }
};