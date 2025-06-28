import http from "../../../utilits/httpClient";


export const deleteDesignation = async (id) => {
    try {
    const { data } = await http().delete(`​employee​/designations​/delete​/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };