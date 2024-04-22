import useAuth from "./useAuth";
import axios from "axios";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async (data) => {
    try {
      const response = await axios.post(
        "https://localhost:7129/api/User/generateTokens",
        data
      );
      // console.log("-----reponse value in refresh ++++++++");
      console.log(response?.data?.data);
      setAuth({
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
      });
      sessionStorage.setItem("accessToken", response.data.data.accessToken);
      sessionStorage.setItem("refreshToken", response.data.data.refreshToken);
      const value = response.data.data.accessToken;

      // console.log("-----reponse value in refresh page  :  " + value);
      return value;

    } catch (error) {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      setAuth({});
    }

  };
  return refresh;
};

export default useRefreshToken;
