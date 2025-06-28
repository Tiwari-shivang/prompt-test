import axios from "axios";
import config from "./config";

const http = (headers,anonymous) => {
const data = JSON.parse(localStorage.getItem('response'));
const access_token = data?.token
const defaultHeaders = {
  Authorization : `Bearer ${access_token}`
}
  return axios.create({
    baseURL: config.BASE_API_URL,
    timeout: config.TIMEOUT,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  })
};

export default http;

