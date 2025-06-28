import http from "../../../utilits/httpClient";

export const createTeamMember = async (values) => {
    try {
        const {data} = await http().post(`projects/create-team-member`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const createProject = async (values) => {
    try {
        const {data} = await http().post(`projects/create-project`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};

export const createProjectFromCSV = async (values) => {
    const formValue = values && values.file;
    let formData = new FormData();
    formData.append("file", formValue);
    try {
        const {data} = await http({
            "Content-Type": "multipart/form-data",
        }).post(`/projects/create-project-from-csv`, formData);
        return data;
    } catch (error) {
        console.log("error.response.data.message Project ",error.response.data.message);
        return (error.response.data.message);
    }
};

export const createPhase = async (values) => {
    try {
        const {data} = await http().post(`projects/create-phase`, values);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
};
