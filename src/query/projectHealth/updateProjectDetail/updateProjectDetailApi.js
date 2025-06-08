import http from "../../../utilits/httpClient";


export const updateProjectDetail = async (values) => {
    try {
    const { data } = await http().put(`projects/update-project-detail`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };