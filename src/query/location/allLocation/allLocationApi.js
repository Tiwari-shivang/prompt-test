import http from '../../../utilits/httpClient'

export const getAllLocations = async () => {
    try {
        const { data } = await http().get(`organisation/locations/get-all`)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}

export const getGeoLocation = async () => {
    try {
        const { data } = await http().get(`common-utility/get-geo-location`)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}
