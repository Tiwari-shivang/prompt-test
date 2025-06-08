import http from "../../../utilits/httpClient";

export const addDepartments = async (values) => {
    try {
        const {data} = await http().post(`organisation/department/create`, [{...values}]);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};
