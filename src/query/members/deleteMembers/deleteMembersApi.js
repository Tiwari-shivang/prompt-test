import http from "../../../utilits/httpClient";


export const deleteMembers = async (id) => {
    try {
    const { data } = await http().delete(`employee/delete/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const deleteMenteeMentor = async (id) => {
    try {
    const { data } = await http().delete(`employee/delete/mentor-details/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };


  export const deleteTopPerformer = async (id) => {
    try {
    const { data } = await http().delete(`/employee/topPerformers/delete/${id.id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const deleteHexaviewBuzz = async (uuid) => {
    try {
      const { data } = await http().delete(`/employee/hexaview-buzz/delete/${uuid}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };
  export const deleteHexaviewBuzzComment = async ({commentUuid, empUuid}) => {
    try {
      const { data } = await http().delete(`/employee/hexaview-buzz/delete-comment?commentUuid=${commentUuid}&empUuid=${empUuid}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };