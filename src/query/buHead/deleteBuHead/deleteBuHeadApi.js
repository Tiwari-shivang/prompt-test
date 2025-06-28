import http from '../../../utilits/httpClient'

export const deleteBuHeads = async (id) => {
    try {
        const { data } = await http().delete(`/organisation/businessUnit/delete/${id}`)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}
