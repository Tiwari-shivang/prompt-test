import http from "../../../utilits/httpClient";

  export const getAuthRecoveryCodes = async () => {
    try {
    const { data } = await http().get(`users/mfa/get-scratches`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const getAuthQrCode = async (id) => {
    try {
    const { data } = await http().get(`users/mfa/generate-qr-code?user_uuid=${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };


  
