import {privateApi} from "../utils/api";
import useAuth from "./useAuth";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";

const useAxios = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    
    useEffect(() =>{
        privateApi.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        privateApi.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response.status === 401 && !prevRequest?.sent){
                    prevRequest.sent = true;
                    const refToken = sessionStorage.getItem('refreshToken');
                    console.log("token passed:  " + refToken);
                    const newAccessToken = await refresh({"refreshToken": refToken});
                    // console.log("--------new token request " + newAccessToken)
                    // const newToken = sessionStorage.getItem('accessToken');
                    // prevRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return privateApi(prevRequest);
                }
                return Promise.reject(error);
            }
        );

    },[auth, refresh])


    return privateApi;
}

export default useAxios;