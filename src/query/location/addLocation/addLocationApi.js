import http from '../../../utilits/httpClient'

export const addLocation = async (values) => {
    try {
        const { data } = await http().post(`organisation/locations/create`, values)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}
