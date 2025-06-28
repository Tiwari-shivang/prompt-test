import http from '../../../utilits/httpClient'

export const getAllDepartments = async () => {
    try {
        const { data } = await http().get(`organisation/department/get-all`)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}
