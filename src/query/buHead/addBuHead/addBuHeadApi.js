import http from '../../../utilits/httpClient'

export const addBuHeads = async (values) => {
    try {
        const { data } = await http().post(`/organisation/businessUnit/create`, values)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}
