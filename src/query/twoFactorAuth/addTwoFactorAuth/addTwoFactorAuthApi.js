import http from "../../../utilits/httpClient";

  export const verifyValidateKey = async (values) => {
    try {
    const { data } = await http().post(`users/mfa/validate/key`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const verifyRecoveryKey = async (values) => {
    try {
    const { data } = await http().post(`users/mfa/validate-scratch-code`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const deactivateMfa = async () => {
    try {
    const { data } = await http().post(`users/mfa/deactivate`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

