import http from "../../../utilits/httpClient";


export const getProjectDetailHealthByManager = async (id) => {
    try {
        const { data } = await http().get(`projects/project-detail-health-by-manager/${id}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
}