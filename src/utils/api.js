import axios from "axios"

export const privateApi = axios.create({
    // baseURL: "https://localhost:7129/api",
    baseURL: "https://buildingapp.runasp.net/api/",
})

export const api = axios.create({
// baseURL: "https://localhost:7129/api",
    baseURL: "https://buildingapp.runasp.net/api/",
})

export const chatApi = "https://buildingapp.runasp.net/"

// export default api;