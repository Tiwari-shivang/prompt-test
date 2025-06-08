import http from "../../../utilits/httpClient"

export const getAllBusinessUnitById = async (id) => {
    // const ids = 'abc123'
    const ids = id ? id : ""
    try {
        const { data } = await http().get(`/organisation/businessUnit/get-all/${ids}`)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}

export const getAllBusinessUnitUnderDepartment = async (id) => {
    try {
        const { data } = await http().get(`/organisation/businessUnit/get-all-departments-under-business-unit-by-id/${id}`)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}
