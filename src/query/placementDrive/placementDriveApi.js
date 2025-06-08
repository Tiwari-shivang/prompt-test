import http from "../../utilits/httpClient";

export const getAllPlacementDrive = async () => {
  try {
    const { data } = await http().get(`employee/placementDrive/get-all`);
    return data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const addPlacementDrive = async (values) => {
  try {
    const { data } = await http().post(
      `employee/placementDrive/create`,
      values
    );
    return data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};
