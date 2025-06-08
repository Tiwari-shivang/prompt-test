import http from "../../../utilits/httpClient";


export const userForgotPassword = async (values) => {
    try {
    const { data } = await http().post(`users/forgot-password`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const userResetPassword = async (values) => {
    try {
    const { data } = await http().post(`users/reset-password`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };