import http from '../../../utilits/httpClient'

export const getAllByEmployeeDepartmentId = async (values) => {
    const id = values && values.id ? values.id : ''
    const page = values && values.newCurrentPage ? values.newCurrentPage : ''
    const size = values && values.itemsPerPage ? values.itemsPerPage : ''
    const searchCriteria = values && values.searchValue ? values.searchValue : ''
    const locationName = values && values.locationName ? values.locationName : ''
    const designationName = values && values.designationName ? values.designationName : ''
    const firstNameSortCriteria = values && values.firstName ? values.firstName : ''
    const lastNameSortCriteria = values && values.lastName ? values.lastName : ''
    try {
        const { data } = await http().get(
            `employee/get-all-by-employee-department-id/${id}?page=${page}&size=${size}&searchCriteria=${searchCriteria}&firstNameSortCriteria=${firstNameSortCriteria}&lastNameSortCriteria=${lastNameSortCriteria}&locationId=${locationName}&designationId=${designationName}`
        )
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}

export const getDepartmentsWithoutDirector = async () => {
    try {
        const { data } = await http().get(`organisation/department/get/departments-without-director`)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}
