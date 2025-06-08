import http from "../../../utilits/httpClient";

  export const deleteFaqs = async (id) => {
    try {
    const { data } = await http().delete(`/help-desk/faq/delete/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };