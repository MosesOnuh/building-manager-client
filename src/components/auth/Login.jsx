import useAPI from "../../hooks/useAPI";
import Loader from "../loading/Loading";
import { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { accessToken, refreshToken } from "../../utils/constants";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [data, setData] = useState(null)

  const { loading, error, setErrToNull, post } = useAPI();

  const navigate = useNavigate()
  const navigateToProjectsPage = () => {navigate('/projects')}

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if ((data)) {
      navigateToProjectsPage();
    }
  }, [data]);

  const onSubmit = async (e) => {
    // setFormError(null);
    setErrToNull();
    e.preventDefault();
    console.log(formData);

    try{
      const response = await post("/User/login", formData);
      sessionStorage.setItem(accessToken, response?.data?.accessToken);
      sessionStorage.setItem(refreshToken, response?.data?.refreshToken);
      setData(response)
    } catch (error){
      sessionStorage.removeItem(accessToken);
      sessionStorage.removeItem(refreshToken);
        setData(null)

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
            {/* <div></div> */}
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
          {/* <p>ERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRROR</p> */}
          <p>{error?.message || "Connection error"}</p>
        </div>
      )}
    </>
  );
};

export default Login;
