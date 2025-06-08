import http from "../../../utilits/httpClient";


export const getClientDetailWithProject = async (id) => {
    try {
        const {data} = await http().get(`projects/clients-details-with-projects/${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};