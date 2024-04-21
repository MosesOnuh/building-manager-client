// {
//   "firstName": "string",
//   "lastName": "string",
//   "email": "string",
//   "phoneNumber": "string",
//   "password": "string",
//   "confirmPassword": "string"
// }

import useAPI from "../../hooks/useAPI";
import Loader from "../loading/Loading";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { accessToken, refreshToken } from "../../utils/constants";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const navigateToLoginPage = () => {
    navigate("/login");
  };

  const [formError, setFormError] = useState(null);
  const { loading, error, setErrToNull, post } = useAPI();

  useEffect(() => {
    if (error || formError)
      var timeInterval = setInterval(() => {
        setFormError(null);
        setErrToNull();
      }, 2000);

    return () => clearInterval(timeInterval);
  }, [error, formError]);



  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = async () => {
    if (!password || !confirmPassword) {
      setFormError("invalid passord or confirm password.");
      return false;
    }

    if (password !== confirmPassword) {
      setFormError("password provided does not match");
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrToNull();
    setFormError(null);
    var check = await validatePassword();
    if (!check) return;
    console.log(formData);
    // try{
       const data = await post("/User/signup", formData);
    // } catch(error){}
    
    if (error){
      sessionStorage.removeItem(accessToken)
      sessionStorage.removeItem(refreshToken)
    }

    if (data){navigateToLoginPage();}

    
    // sessionStorage.setItem("tokenA", data?.data?.accessToken);
    // sessionStorage.setItem("tokenR", data?.data?.refreshToken);

    // console.log("Success");
    
    console.log(data);
  };

  const { firstName, lastName, email, phoneNumber, password, confirmPassword } =
    formData;

  return (
    <>
      {!loading && (
        <section className="form-wrapper">
          <h1 className="font-semibold text-sm underline">Create Account</h1>
          <form className="formbody" onSubmit={onSubmit}>
            {/* <div></div> */}
            <input
              className="form-input"
              type="text"
              placeholder="First Name"
              name="firstName"
              value={firstName}
              onChange={onChange}
            />
            <input
              className="form-input"
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={lastName}
              onChange={onChange}
            />
            <input
              className="form-input"
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={onChange}
            />
            <input
              className="form-input"
              type="text"
              placeholder="Phone Number"
              name="phoneNumber"
              value={phoneNumber}
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
            <input
              className="form-input"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
            />
            <input className="form-btn" type="submit" value="Signup" />
          </form>
        </section>
      )}
      {loading && <Loader />}
      {formError && (
        <div className="error-alert">
          <p>{formError}</p>
        </div>
      )}
      {error && (
        <div className="error-alert">
          <p>{error?.message}</p>
        </div>
      )}
    </>
  );
};

export default Signup;
