import http from '../../utilits/httpClient'

export const getAllAccessWithPermission = async () => {
    try {
        const { data } = await http().get(`/users/get/all-access-rights`)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}

export const updateAccessPermission = async (values) => {
    try {
        const { data } = await http().put(`/users/update/all-access-rights`, values);
        return data;
    } catch (error){
        throw Error(error.response.data.message)
    }
}