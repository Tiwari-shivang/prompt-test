import http from "../../../utilits/httpClient";

export const updateBuHeadById = async (values) => {
  const id = values.id;
  const buHeadUuid = values.buHeadId ? values.buHeadId : ""
  try {
  const { data } = await http().put(`organisation/businessUnit/updatebuHead/${id}?buHeadId=${buHeadUuid}`);
  return data
  } catch (error){
      throw Error(error.response.data.message)
  }
};

export const updateBuHead = async (values) => {
  try {
  const { data } = await http().put(`organisation/businessUnit/update`, values);
  return data
  } catch (error){
      throw Error(error.response.data.message)
  }
};

