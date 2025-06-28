import http from "../../utilits/httpClient";

export const getAllquickAccess = async (id) => {
    try {
        const {data} = await http().get(
            `employee/quickAccess/getall?searchDesignationCriteria=${id}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const addquickAccess = async (values) => {
    try {
        const {data} = await http().post(`employee/quickAccess/create`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const deleteQuickAccess = async (uuid) => {
    try {
        const {data} = await http().delete(`employee/quickAccess/delete/${uuid}`);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};
