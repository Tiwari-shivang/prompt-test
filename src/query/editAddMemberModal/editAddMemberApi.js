import http from "../../utilits/httpClient";


export const addMember = async (param) => {
    try {
    const { data } = await http().post(`http://localhost:3000/products`, param);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const updateMember = async (param) => {
    const id = param.id
    try {
    const { data } = await http().put(`http://localhost:3000/products/${id}`, param);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };