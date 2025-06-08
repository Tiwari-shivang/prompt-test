import http from '../../../utilits/httpClient'

export const getAllDesignation = async () => {
    try {
        const { data } = await http().get(`organisation/designations/get-all`)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}
