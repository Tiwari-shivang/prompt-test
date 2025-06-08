import http from "../../../utilits/httpClient";


  export const addLeaveApply = async (values) => {
    try {
      const { data } = await http().post(`attendance/leave/apply`, values);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };