import http from "../../../utilits/httpClient";

export const getResignation = async (id) => {
    try {
      const { data } = await http().get(`employee/resignation/get/${id}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };

export const getAllResignationForHr = async () => {
  try {
  const { data } = await http().get(`/employee/resignation/get-all`);
  return data
  } catch (error){
      throw Error(error.response.data.message)
  }
};