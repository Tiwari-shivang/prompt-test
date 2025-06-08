import http from '../../../utilits/httpClient'

export const addDesignation = async (values) => {
    try {
        const { data } = await http().post(`organisation/designations/create`, values)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}
