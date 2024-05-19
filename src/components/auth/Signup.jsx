import useAPI from "../../hooks/useAPI";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import "./Login.css";
import { accessToken, refreshToken } from "../../utils/constants";
import { TextInput } from "../utility/InputFields";
import SubmitButton1 from "../utility/SubmitButton1";
import { toast } from "react-toastify";

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
      toast.error("Invalid passord or confirm password.");
      return false;
    }

    if (password !== confirmPassword) {
      setFormError("password provided does not match");
      toast.error("Password provided does not match");
      return false;
    }
    return true;
  };

  const toastId = useRef(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    setErrToNull();
    setFormError(null);
    console.log(formData)
    var check = await validatePassword();
    if (!check) return;
    try {
      toastId.current = toast.loading("Loading...");
      const data = await post("/User/signup", formData);
      toast.update(toastId.current, {
        render: "Sign Up Successful",
        type: "success",
        isLoading: false,
      });
      setTimeout(() => {
        toast.dismiss();
      }, 3000);
      navigateToLoginPage();
    } catch (err) {
      sessionStorage.removeItem(accessToken);
      sessionStorage.removeItem(refreshToken);
      toast.update(toastId.current, {
        render: error?.message || "Error signing in",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          toast.dismiss();
        }
      }, 3000);
    }

    // if (data) {
    //   navigateToLoginPage();
    // }

    // sessionStorage.setItem("tokenA", data?.data?.accessToken);
    // sessionStorage.setItem("tokenR", data?.data?.refreshToken);

    // console.log("Success");

    // console.log(data);
  };

  const { firstName, lastName, email, phoneNumber, password, confirmPassword } =
    formData;

  return (
    <>
      <div className="">
        {/* <section className="form-wrapper"> */}
        {/* <section className="form-wrapper bg-white py-10 pb-20 px-10 rounded-xl mx-auto md:w-2/5  md:shadow-xl"> */}
        <section className="form-wrapper sm:w-4/5 py-10 px-5 pb-20 sm:px-10 rounded-xl mx-auto md:w-3/5 lg:w-2/5 ">
          <h1 className="font-inter text-2xl mb-5 text-center font-semibold">
            Create Account
          </h1>
          <form onSubmit={onSubmit}>
            <TextInput
              InputTitle={"First Name"}
              InputName={"firstName"}
              OnChange={onChange}
              InputValue={firstName}
            />
            <TextInput
              InputTitle={"Last Name"}
              InputName={"lastName"}
              OnChange={onChange}
              InputValue={lastName}
            />
            <TextInput
              InputTitle={"Email Address"}
              InputName={"email"}
              OnChange={onChange}
              InputValue={email}
            />
            <TextInput
              InputTitle={"Phone Number"}
              InputName={"phoneNumber"}
              OnChange={onChange}
              InputValue={phoneNumber}
            />
            <TextInput
              InputTitle={"Password"}
              InputName={"password"}
              OnChange={onChange}
              InputValue={password}
              type={"password"}
            />
            <TextInput
              InputTitle={"Confirm Password"}
              InputName={"confirmPassword"}
              OnChange={onChange}
              InputValue={confirmPassword}
              type={"password"}
            />
            <div className="flex justify-end mt-5">
              <SubmitButton1 loading={loading} />
            </div>

            {/* <input
              className="form-input"
              type="text"
              placeholder="First Name"
              name="firstName"
              value={firstName}
              onChange={onChange}
            /> */}
            {/* <input
              className="form-input"
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={lastName}
              onChange={onChange}
            /> */}
            {/* <input
              className="form-input"
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={onChange}
            /> */}
            {/* <input
              className="form-input"
              type="text"
              placeholder="Phone Number"
              name="phoneNumber"
              value={phoneNumber}
              onChange={onChange}
            /> */}
            {/* <input
              className="form-input"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
            /> */}
            {/* <input
              className="form-input"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
            /> */}
            {/* <input className="form-btn" type="submit" value="Signup" /> */}
          </form>
        </section>
      </div>
      {/* {loading && <Loader />}
      {formError && (
        <div className="error-alert">
          <p>{formError}</p>
        </div>
      )}
      {error && (
        <div className="error-alert">
          <p>{error?.message}</p>
        </div>
      )} */}
    </>
  );
};

export default Signup;
