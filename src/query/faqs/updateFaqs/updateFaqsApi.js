import http from "../../../utilits/httpClient";

  export const updateFaqs = async (values) => {
    const id = values.id;
    try {
    const { data } = await http().put(`/help-desk/faq/update`, values);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };
