import http from "../../../utilits/httpClient";

export const getSkilAllCertificate = async (id) => {
    try {
        const { data } = await http().get(`employee/skills/get/all-certificate-by-emp/${id}`);
        return data
    } catch (error){
        throw Error(error.response.data.message)
    }
};