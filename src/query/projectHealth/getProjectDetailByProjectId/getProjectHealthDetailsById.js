import http from "../../../utilits/httpClient";
 
export const getProjectDetailByProjectId = async (projectId) => {
  const response = await http().get(`/projects/project-detail-health-by-project-id/${projectId}`);
  return response.data;
};