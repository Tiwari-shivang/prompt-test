import http from "../../../utilits/httpClient";


  export const deleteResume = async (id) => {
    try {
      const { data } = await http().delete(`employee/delete-resume/${id}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };

  export const deleteCertificate = async (id) => {
    try {
      const { data } = await http().delete(`/employee/skills/delete-certificate-by-uuid/${id}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };