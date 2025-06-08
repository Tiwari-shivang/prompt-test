import http from "../../../utilits/httpClient";

export const updateHrTicketStatus = async (values) => {
    try {
        const { data } = await http().put(`help-desk/hr/update-ticket-status`, values);
        return data;
    } catch (error){
        throw Error(error.response.data.message)
    }
};

export const updateHrTicketAssignedTo = async (values) => {
    try {
        const { data } = await http().put(`help-desk/hr/update-assignee`, values);
        return data;
    } catch (error){
        throw Error(error.response.data.message)
    }
};

export const updateHrTicketPriority = async (values) => {
    try {
        const { data } = await http().put(`help-desk/hr/update-priority`, values);
        return data;
    } catch (error){
        throw Error(error.response.data.message)
    }
};

export const updateHrNotes = async (values) => {
    try {
        const { data } = await http().put(`/help-desk/hr/update-note`, values);
        return data;
    } catch (error){
        throw Error(error.response.data.message)
    }
};