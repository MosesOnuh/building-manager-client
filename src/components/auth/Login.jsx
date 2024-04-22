import useAPI from "../../hooks/useAPI";
import Loader from "../loading/Loading";
import { useEffect, useState } from "react";
import "./Login.css";
import { useLocation, useNavigate } from "react-router-dom";
import { accessToken, refreshToken } from "../../utils/constants";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const {auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/projects";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [data, setData] = useState(null);

  const { loading, error, setErrToNull, post } = useAPI();

  // const navigateToProjectsPage = () => {navigate('/projects')}
  const navigateToProjectsPage = () => {
    navigate(from, { replace: true });
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (auth.accessToken) {
      navigateToProjectsPage();
    }
  }, [auth]);

  const onSubmit = async (e) => {
    // setFormError(null);
    setErrToNull();
    e.preventDefault();
    console.log(formData);

    try {
      const response = await post("/User/login", formData);
      sessionStorage.setItem(accessToken, response?.data?.accessToken);
      sessionStorage.setItem(refreshToken, response?.data?.refreshToken);
      setAuth(
        {
          accessToken: response?.data?.accessToken,
          refreshToken: response?.data?.refreshToken,
        });

      navigateToProjectsPage();
      // setData(response);
    } catch (error) {
      // sessionStorage.removeItem(accessToken);
      // sessionStorage.removeItem(refreshToken);
      setData(null);
    }

    console.log("Success");
    console.log(data);
  };

  const { email, password } = formData;

  return (
    <>
      {!loading && (
        <section className="form-wrapper">
          <h1 className="font-semibold text-sm underline">Sign In</h1>
          <form className=" formbody" onSubmit={onSubmit}>
            <input
              className="form-input"
              type="text"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={onChange}
            />
            <input
              className="form-input"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
            />
            <input type="submit" value="Login" />
          </form>
        </section>
      )}
      {loading && <Loader />}
      {error && (
        <div className="error-alert">
          <p>{error?.message || "Connection error"}</p>
        </div>
      )}
    </>
  );
};

export default Login;
