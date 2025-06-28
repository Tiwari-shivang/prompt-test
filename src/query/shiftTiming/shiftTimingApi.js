import http from "../../utilits/httpClient";

export const getShiftTiming = async (id) => {
    try {
    const { data } = await http().get(`employee/shift-timing/get`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };


export const getShiftTimingById = async (id) => {
    try {
    const { data } = await http().get(`employee/shift-timing?empUuid=${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };


  export const createShiftTiming = async (values) => {
    try {
    const { data } = await http().post(`employee/shift-timing/create`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const updateShiftTiming = async (values) => {
    try {
    const { data } = await http().put(`employee/shift-timing/update`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const deleteShiftTiming = async (id) => {
    try {
    const { data } = await http().delete(`/employee/shift-timing/delete?id=${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  