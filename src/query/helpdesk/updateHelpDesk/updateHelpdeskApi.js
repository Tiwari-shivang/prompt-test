import http from "../../../utilits/httpClient";

export const updateTicketStatus = async (values) => {
    try {
        const { data } = await http().put(`help-desk/it-admin/update-ticket-status`, values);
        return data;
    } catch (error){
        throw Error(error.response.data.message)
    }
};

export const updateAssignedTo = async (values) => {
    try {
        const { data } = await http().put(`help-desk/it-admin/update-ticket-assign-to`, values);
        return data;
    } catch (error){
        throw Error(error.response.data.message)
    }
};

export const updateItNote = async (values) => {
    try {
        const { data } = await http().put(`help-desk/it-admin/update-note`, values);
        return data;
    } catch (error){
        throw Error(error.response.data.message)
    }
};