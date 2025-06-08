import http from "../../utilits/httpClient";

export const addRegularization = async (values) => {
  try {
  const { data } = await http().post(`/attendance/create/regularization`, values);
  return data
  } catch (error){
      throw Error(error.response.data.message)
  }
};

export const getRegularizationByPmId = async (value) => {
  try {
  const { data } = await http().get(`attendance/get/regularization-requests-for-pm/${value.emp_uuid}?is_pm=${value.isRequest}`);
  return data
  } catch (error){
      throw Error(error.response.data.message)
  }
};
export const getRegularizationByEmpId = async (value) => {
  try {
  const { data } = await http().get(`attendance/get//attendance/get/regularization-details-of-emp/${value.emp_uuid}?regDate=${value.isRequest}`);
  return data
  } catch (error){
      throw Error(error.response.data.message)
  }
};

export const updateRegularizationRequest = async (values) => {
  try {
  const { data } = await http().put(`/attendance/update/regularization-response-of-employee`, values);
  return data
  } catch (error){
      throw Error(error.response.data.message)
  }
};
