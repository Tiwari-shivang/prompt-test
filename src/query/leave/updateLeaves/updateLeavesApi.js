import http from "../../../utilits/httpClient";


export const updateLeaveStatus = async (values) => {
    try {
    const { data } = await http().put(`attendance/leave/update-status/${values.commonLeaveUuid}/${values.newStatus}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };