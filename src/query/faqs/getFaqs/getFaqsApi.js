import http from "../../../utilits/httpClient";
  
  export const getFaqByTitle = async (id) => {
    try {
      const { data } = await http().get(`/help-desk/faq/get-all-by-title/{title}${id}`);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };

  export const getAllFaqTitle = async () => {
    try {
    const { data } = await http().get(`/help-desk/faq/get-all-titles`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const getAllFaqs = async () => {
    try {
    const { data } = await http().get(`/help-desk/faq/get-faq-list`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const getAllUnansweredFaqs = async () => {
    try {
    const { data } = await http().get(`help-desk/faq/get-queries`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

