import axios from "axios"
import { accessToken, refreshToken } from "./constants";

const api = axios.create({
    baseURL: "https://localhost:7129/api",
})

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('tokenA')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // Delete session storage if the response status is 401
        sessionStorage.removeItem(accessToken);
        sessionStorage.removeItem(refreshToken);
      // You may also redirect the user to the login page or display a message
    }
    return Promise.reject(error);
  }
);
              




// api.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response.status === 401 && !originalRequest._retry){
//             originalRequest._retry = true;

//             try {
//                 const refreshToken = sessionStorage.getItem('refreshToken');

//                 //add correct refresh token url
//                 const response = await axios.post("https://localhost:5000/",{refreshToken});

//                 const {token, refreshToken1 } = response.data;

//                 sessionStorage.setItem('tokenA', token);
//                 sessionStorage.setItem('tokenR', refreshToken1);

//                 originalRequest.headers.Authorization = `Bearer ${token}`;

//                 //return axios(originalRequest); //or 
//                 return api(originalRequest);
//             } catch (error) {
//                 console.log("Refresh token error")
//             }
//         }

//         return Promise.reject(error);
//     }
// );

export default api;