import axios from "axios";

axios.interceptors.request.use(
    async (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (response && response.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axios;