import http from "../../../utilits/httpClient";


export const createProjectHealth = async (values) => {
    try {
        const {data} = await http().post(`projects/create-project-health`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};