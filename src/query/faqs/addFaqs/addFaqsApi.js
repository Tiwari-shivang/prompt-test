import http from "../../../utilits/httpClient";

  export const addfaqs = async (values) => {
    try {
    const { data } = await http().post(`help-desk/faq/create`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };

  export const askQuestionFaqs = async (values) => {
    try {
    const { data } = await http().post(`help-desk/faq/create-queries`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };
