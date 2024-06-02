import axios from "axios"

export const privateApi = axios.create({
    baseURL: "https://localhost:7129/api",
})

export const api = axios.create({
    baseURL: "https://localhost:7129/api",
})

// export default api;