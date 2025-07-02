import axios from 'axios';
import { BASE_URL } from './ApiPaths';
import { toast } from 'react-hot-toast';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout : 10000,
    headers : {
        "Content-Type" : "application/json",
        Accept : "application/json",
    }
})

axiosInstance.interceptors.request.use( 
    (config) => {
        const accessToken = sessionStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    }, 
    (error) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (
                (error.response.status === 401 || error.response.status === 403) &&
                (
                    error.response.data?.message === "User not found" ||
                    error.response.data?.message === "User removed from organization"
                )
            ) {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
                toast.error("You are removed from the organization.");
                setTimeout(() => {
                  window.location.href = '/login';
                }, 1200);
                return;
            } else if (error.response.status === 401) {
                window.location.href = '/login';
            } else if(error.response.status === 500){
                console.error("Server error. Please try again later.");
            }
        } else if (error.code === "ECONNABORTED"){
            console.error("Request timeout. Please try again.")
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;