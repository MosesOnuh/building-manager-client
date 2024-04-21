import { useState } from "react" ;
import api from "../utils/api";
// import axios from "axios";
import { useNavigate } from "react-router-dom";


const useAPI = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);

    const setErrToNull = () => setError(null)

    const navigate = useNavigate();
    const navigateToLoginPage = () => {
      navigate("/login");
    };

    const get = async (url) => {
        try {
            setLoading(true);
            const response = await api.get(url);
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            setError(error?.response?.data);
            if (error?.response?.status === 401){
                setError(null);
                navigateToLoginPage();
            }
            throw error;
        }
    }

    const downloadFile = async (url, fileName)=> {
      try {
        setLoading(true);
        
        const response = await api.get(url, {
          responseType: "blob", // Set responseType to 'blob' to receive binary data
        });
        setLoading(false);

        // Create blob URL for the file content
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

        // Create a temporary link element to trigger the download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", fileName); // Set the file name for the download
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        // Return the downloaded blob data if needed
        return response.data;
      } catch (error) {
        setLoading(false);
        setError(error?.response?.data);
        if (error?.response?.status === 401) {
          setError(null);
          navigateToLoginPage();
        }
        throw error;
      }
    };

    const post = async (url, data) => {
        try {
            setLoading(true);
            const response = await api.post(url, data); 
            setLoading(false)
            return response?.data;
        } catch (error) {
            setLoading(false);
            setError(error?.response?.data);
            if (error?.response?.status === 401) {
              navigateToLoginPage();
            }
            
            // throw error;
        }
    }

    const patch = async (url, data) => {
        try {
            setLoading(true);
            const response = await api.patch(url, data); 
            setLoading(false)
            return response?.data;
        } catch (error) {
            setLoading(false);
            setError(error?.response?.data);
            if (error?.response?.status === 401) {
              navigateToLoginPage();
            }
            
            throw error;
        }
    }


    const postFileReq = async (url, formData) => {
      try {
        setLoading(true);
        const response = await api.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setLoading(false);
        return response?.data;
      } catch (error) {
        setLoading(false);
        setError(error?.response?.data);
        if (error?.response?.status === 401) {
          navigateToLoginPage();
        }
        throw error;
      }
    };

    return {
      loading,
      error,
      setErrToNull,
      get,
      post,
      patch,
      postFileReq,
      downloadFile,
    };
}

export default useAPI;