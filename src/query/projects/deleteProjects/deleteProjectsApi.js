import http from "../../../utilits/httpClient";


export const deleteProject = async (id) => {
    try {
    const { data } = await http().delete(`projects/delete/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const softDeleteTeamMember = async (id) => {
    try {
    const { data } = await http().delete(`projects/delete/team-member/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };


  export const hardDeleteTeamMember = async (id) => {
    try {
    const { data } = await http().delete(`projects/permanent-delete/team-member/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };
