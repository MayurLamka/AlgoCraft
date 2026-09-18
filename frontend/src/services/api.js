import axios from "axios";

const getApiBaseUrl = () => {

    // If frontend is opened using the laptop's
    // network IP, use the same hostname for backend.
    if (
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
    ) {
        return `${window.location.protocol}//${window.location.hostname}:5000/api`;
    }

    // Normal laptop development
    return "http://localhost:5000/api";
};


const api = axios.create({

    baseURL: getApiBaseUrl(),

    headers: {
        "Content-Type": "application/json"
    }

});


// ==========================================
// ADD JWT TOKEN
// ==========================================

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;
    },

    (error) => {

        return Promise.reject(error);

    }

);


export default api;