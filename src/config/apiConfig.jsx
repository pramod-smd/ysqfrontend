import axios from 'axios';
import axiosInterceptor from './axiosInterceptor';
import {environment} from './environment';

const wampServer = environment.URL + '/api/';
const token = localStorage.getItem('auth_token');
const axiosApi = axios.create({
    baseURL: wampServer,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
});
// axiosInterceptor.setupInterceptors(axiosApi, true, false);
axiosInterceptor.setupInterceptors = (axiosApi, enableAuth, enableErrorHandling) => {
    axiosApi.interceptors.request.use(
        (config) => {
            console.log("Request config:", config);
            if (enableAuth) {
                // const token = localStorage.getItem(Tokens.ADMIN);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        },
        (error) => {
            console.error("Request error:", error);
            return Promise.reject(error);
        }
    );

    axiosApi.interceptors.response.use(
        (response) => {
            console.log("Response received:", response);
            return response;
        },
        (error) => {
            console.error("Response error:", error);
            return Promise.reject(error);
        }
    );
};


export default axiosApi;
