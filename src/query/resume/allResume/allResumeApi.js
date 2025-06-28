import http from "../../../utilits/httpClient";

export const getAllResumeById = async (id) => {
    try {
      const { data } = await http().get(`employee/get-all-resume/${id}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };
