import http from "../../../utilits/httpClient";

export const deleteTodo = async (id) => {
    try {
    const { data } = await http().delete(`/employee/todo/delete/${id}`);
    return data
    } catch (error){
        throw Error(error.response.data.message)
    }
  };