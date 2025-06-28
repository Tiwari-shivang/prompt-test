import http from '../../utilits/httpClient'

export const getAllHolidays = async (values) => {
    const id = values && values.id ? values.id : "";
    const sort = values && values.sort ? values.sort : ''
    try {
        const { data } = await http().get(`organisation/holidays/get-all-holidays?id=${id}&sortCriteria=${sort}`)
		return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}

export const uploadHolidays = async (values) => {
    const formValue = values && values.file
    let formData = new FormData()
    formData.append('file', formValue)
    try {
        const { data } = await http({
            'Content-Type': 'multipart/form-data',
        }).post(`organisation/holidays/create`, formData)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}
