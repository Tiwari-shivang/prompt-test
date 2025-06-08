import http from "../../../utilits/httpClient";

  export const addTodo = async (values) => {
    try {
      const { data } = await http().post(`/employee/todo/create`, values);
      return data
    } catch (error){
      throw Error(error.response.data.message)
    }
  };