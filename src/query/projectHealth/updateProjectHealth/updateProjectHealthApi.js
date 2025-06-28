import http from "../../../utilits/httpClient";


export const updateProjectHealth = async (values) => {
    try {
    const { data } = await http().put(`projects/update-project-health`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };