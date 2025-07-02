import http from "../../../utilits/httpClient";

export const getClientName = async (exProjectId) => {
  const response = await http().get(`/projects/get-client-name-external-project-id/${exProjectId}`);
  return response.data;
};