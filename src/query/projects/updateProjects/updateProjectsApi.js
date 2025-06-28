import http from "../../../utilits/httpClient";


export const updateTeamMember = async (values) => {
    try {
    const { data } = await http().put(`projects/update-team-member`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const updateProject = async (values) => {
    try {
    const { data } = await http().put(`projects/update-project`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const updatePhase = async (values) => {
    try {
    const { data } = await http().put(`projects/update-phase`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };