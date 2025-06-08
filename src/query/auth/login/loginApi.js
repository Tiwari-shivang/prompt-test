import http from "../../../utilits/httpClient";


export const userLogin = async (values) => {
    try {
    const { data } = await http().post(`users/login`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const verifyEmailOtp = async (values) => {
    try {
    const { data } = await http().post(`/users/verify-email`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const userLoginBySSO = async () => {
    try {
    const { data } = await http().get(`users/login/sso`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };