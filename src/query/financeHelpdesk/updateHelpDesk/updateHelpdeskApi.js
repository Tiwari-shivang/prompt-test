import http from "../../../utilits/httpClient";

export const updateFinanceTicketStatus = async (values) => {
    try {
        const { data } = await http().put(`help-desk/finance/update-ticket-status`, values);
        return data;
    } catch (error){
        throw Error(error.response.data.message)
    }
};

export const updateFinanceAssignedTo = async (values) => {
    try {
        const { data } = await http().put(`help-desk/finance/update-ticket-assign-to`, values);
        return data;
    } catch (error){
        throw Error(error.response.data.message)
    }
};

export const updateFinancePriority = async (values) => {
    try {
        const { data } = await http().put(`help-desk/finance/update-priority`, values);
        return data;
    } catch (error){
        throw Error(error.response.data.message)
    }
};

export const updateFinanceNotes = async (values) => {
    try {
        const { data } = await http().put(`/help-desk/finance/update-note`, values);
        return data;
    } catch (error){
        throw Error(error.response.data.message)
    }
};
