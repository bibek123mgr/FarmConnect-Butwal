import axios from "axios";
import { baseUrl } from "../config/config";

export const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true
});