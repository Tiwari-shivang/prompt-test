import http from "../../../utilits/httpClient";

export const addMembers = async (values) => {
    try {
        const {data} = await http().post(`/employee/create`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const downloadMemberCSVFile = async (id) => {
    try {
        const { data } = await http().get(`employee/get/employee-csv-standard-format`);
        return data
        } catch (error){
            throw Error(error.response.data.message)
        }
    };




export const addMembersFromCSV = async (values) => {
    const formValue = values && values.file;
    let formData = new FormData();
    formData.append("file", formValue);
    try {
        const {data} = await http({
            "Content-Type": "multipart/form-data",
        }).post(`/employee/create/employee-from-csv`, formData);
        return data;
    } catch (error) {
       // console.log("error.response.data.message ",error.response.data.message);
        return (error.response.data.message);
    }
};

export const addMembersInProjectPhase = async (values) => {
    try {
        const {data} = await http().post(`/projects/create-team-member`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const addTopPerformers = async (values) => {
    try {
        const {data} = await http().post(`employee/topPerformers/create-all`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const addMenteeMentor = async (values) => {
    try {
        const {data} = await http().post(`employee/create/mentor`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const addHexaviewBuzz = async (values) => {
    try {
        const {data} = await http().post(`/employee/hexaview-buzz/create`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const addHexaviewBuzzComment = async (values) => {
    try {
        const {data} = await http().post("/employee/hexaview-buzz/comment", values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};
export const addHexaviewBuzzReplyOnComment = async (values) => {
    try {
        const {data} = await http().post(`/employee/hexaview-buzz/reply-on-comment`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const addHexaviewBuzzReact = async (values) => {
    try {
        const {data} = await http().post(
            `/employee/hexaview-buzz/react?buzzUuid=${values.buzzUuid}&empUuid=${values.empUuid}&reactionType=${values.reactionType}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const addHexaviewBuzzCommentReact = async (values) => {
    try {
        const {data} = await http().post(
            `/employee/hexaview-buzz/react-on-comment?commentUuid=${values?.commentUuid}&reactionType=${values?.reactionType}&empUuid=${values?.empUuid}`
        );
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const addAskForTraineeRating = async (values) => {
    try {
        const {data} = await http().post(`/employee/create/trainee-rating`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};
