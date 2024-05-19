import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "./useAxios";
import { api as defaultApi } from "../utils/api";
import useAuth from "./useAuth";
import { accessToken, refreshToken } from "../utils/constants";

const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setAuth } = useAuth();

  const setErrToNull = () => setError(null);

  const navigate = useNavigate();
  const navigateToLoginPage = () => {
    navigate("/login");
  };

  const api = useAxios();

  const get = async (url) => {
    try {
      setLoading(true);
      const response = await api.get(url);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data);
      throw error;
    }
  };

  const deleteRequest = async (url) => {
    try {
      setLoading(true);
      const response = await api.delete(url);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data);
      throw error;
    }
  };

  const downloadFile = async (url, fileName) => {
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
      throw error;
    }
  };

  const post = async (url, data) => {
    try {
      setLoading(true);
      const response = await api.post(url, data);
      setLoading(false);
      return response?.data;
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data);
      throw error;
    }
  };

  const login = async (url, data) => {
    try {
      setLoading(true);
      const response = await defaultApi.post(url, data);
      setLoading(false);
      return response?.data;
    } catch (error) {
      setError(error?.response?.data);
      sessionStorage.removeItem(accessToken);
      sessionStorage.removeItem(refreshToken);
      setLoading(false);
      setAuth({});
      

      throw error;
    }
  };

  const patch = async (url, data) => {
    try {
      setLoading(true);
      const response = await api.patch(url, data);
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

  const patchFileReq = async (url, formData) => {
    try {
      setLoading(true);
      const response = await api.patch(url, formData, {
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
    login,
    patch,
    postFileReq,
    patchFileReq,
    downloadFile,
    deleteRequest,
  };
};

export default useAPI;
