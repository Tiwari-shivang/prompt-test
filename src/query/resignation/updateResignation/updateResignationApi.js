import http from "../../../utilits/httpClient";

export const updateResignationResponse = async (values) => {
    try {
        const { data } = await http().put(`/employee/resignation/response`, values);
        return data;
    } catch (error){
        throw Error(error.response.data.message)
    }
};

export const updateResignationWithdraw = async (values) => {
    try {
        const { data } = await http().put(`/employee/resignation/withdraw`, values);
        return data;
    } catch (error){
        throw Error(error.response.data.message)
    }
};