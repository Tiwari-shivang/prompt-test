import http from "../../../utilits/httpClient";

export const addClients = async (values) => {
    try {
        const {data} = await http().post(`clients/create`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};
export const uploadClientCSV = async (values) => {
    const formValue = values && values.file;
    let formData = new FormData();
    formData.append("file", formValue);
    try {
        const {data} = await http({
            "Content-Type": "multipart/form-data",
        }).post(`/clients/upload_client_csv`, formData);
        return data;
    } catch (error) {
        return (error.response.data.message);
    }
};

// export const uploadgggHolidays = async (values) => {
//     const formValue = values;
//     let formData = new FormData();
//     formData.append("file", formValue);
//     try {
//         const {data} = await http({
//             "Content-Type": "multipart/form-data",
//         }).post(`organisation/holidays/create`, formData);
//         return data;
//     } catch (error) {
//         throw Error(error.response.data.message);
//     }
// };
