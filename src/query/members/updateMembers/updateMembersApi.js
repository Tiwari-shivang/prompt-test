import http from '../../../utilits/httpClient'

export const updateMembers = async (values) => {
    try {
        const { data } = await http().put(`employee/update`, values)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}

export const updateDeleteDirector = async (values) => {
    const id = values.id
    const directID = values.directorId ? values.directorId : ''
    try {
        const { data } = await http().put(`organisation/department/update/director/${id}?directorId=${directID}`)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}

export const timeSheetApproval = async (values) => {
    const timesheetUuid = values?.timesheetUuid
    const status = values.status ? values.status : ''
    const comment = values.comment ? values.comment : ''
    const approverUuid = values.approverUuid ? values.approverUuid : ''
    try {
        const { data } = await http().put(`/attendance/timesheet/update/${timesheetUuid}/${status}/${approverUuid}?comment=${comment}`)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}

export const updateDepartment = async (values) => {
    try {
        const { data } = await http().put(`/organisation/department/update`, values)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}

export const updateHexaviewBuzz = async (values) => {
    try {
        const { data } = await http().put(`/employee/hexaview-buzz/update`, values)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}

export const updateRejectedTimesheet = async (values) => {
    try {
        const { data } = await http().put(`/attendance/timesheet/update/rejected-timesheet/${values.timesheetUuid}`, values.task_request)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}

export const unreactOnHexaviewBuzz = async ({ hexaviewBuzzUuid, empUuid }) => {
    try {
        const { data } = await http().put(`/employee/hexaview-buzz/unreact-on-hexaview-buzz?hexaviewBuzzUuid=${hexaviewBuzzUuid}&empUuid=${empUuid}`)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}

export const unreactOnHexaviewBuzzComment = async ({ commentUuid, empUuid }) => {
    try {
        const { data } = await http().put(`/employee/hexaview-buzz/unreact-on-comment?commentUuid=${commentUuid}&empUuid=${empUuid}`)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}

export const updateMenteeRating = async (values) => {
    try {
        const { data } = await http().put(`/employee/update/trainee-rating`, values)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}

export const updateMenteeMentor = async (values) => {
    try {
        const { data } = await http().put(`employee/update/mentor-details`, values)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}

export const updateTraneeApproval = async (empId) => {
    try {
        const { data } = await http().put(`employee/update/traineesStatus/${empId}`)
        return data
    } catch (error) {
        throw Error(error.response.data.message)
    }
}
