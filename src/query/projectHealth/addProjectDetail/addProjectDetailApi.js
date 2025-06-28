import http from "../../../utilits/httpClient";


export const createProjectDetail = async (values) => {
    try {
        const {data} = await http().post(`projects/create-project-detail`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};