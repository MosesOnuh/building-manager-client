import useAPI from "../../hooks/useAPI";
import { useEffect, useRef, useState } from "react";
// import "./Login.css";
import { useLocation, useNavigate } from "react-router-dom";
import { accessToken, refreshToken } from "../../utils/constants";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const Login = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/projects";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { loading, error, setErrToNull, login } = useAPI();

  // const navigateToProjectsPage = () => {navigate('/projects')}
  const navigateToProjectsPage = () => {
    navigate(from, { replace: true });
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (auth?.accessToken) {
      navigateToProjectsPage();
    }
  }, [auth]);

  const toastId = useRef(null);
  const onSubmit = async (e) => {
    setErrToNull();
    e.preventDefault();

    try {
      toastId.current = toast.loading("Loading...");
      const response = await login("/User/login", formData);
      toast.update(toastId.current, {
        render: "Login Successful",
        type: "success",
        isLoading: false,
      });
      setTimeout(() => {
        // toast.dismiss(toastId.current);
        toast.dismiss();
      }, 3000);

      sessionStorage.setItem(accessToken, response?.data?.accessToken);
      sessionStorage.setItem(refreshToken, response?.data?.refreshToken);
      setAuth({
        accessToken: response?.data?.accessToken,
        refreshToken: response?.data?.refreshToken,
      });
      navigateToProjectsPage();
    } catch (err) {
      // setAuth({});
      toast.update(toastId.current, {
        render: error?.message || "Error signing in",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => {
        {
          // toast.dismiss(toastId.current);
          toast.dismiss();
        }
      }, 3000);
    }

    console.log("Success");
  };

  const { email, password } = formData;

  return (
    <>
      {
        <div className="modal-wrapper ">
          <section className="bg-white py-10 pb-20 px-10 rounded-xl mx-auto md:w-2/5 max-w-96 md:shadow-xl ">
            {/* shadow-2xl */}
            <h1 className="font-inter text-2xl mb-10 text-center font-semibold">Sign In</h1>
            <form className="" onSubmit={onSubmit}>
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block ml-3 text-sm font-inter "
                >
                  Email
                </label>
                <input
                  style={{ borderColor: "rgb(0,0,0,0.6)" }}
                  className=" rounded-md py-1 pl-2 mt-1 w-full border-x border-y border-solid border-black"
                  type="text"
                  // placeholder="Email Address"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block ml-3 text-sm font-inter"
                >
                  Password
                </label>
                <input
                  style={{ borderColor: "rgb(0,0,0,0.6)" }}
                  className="  rounded-md py-1 pl-2 mt-1 w-full border-x border-y border-solid border-black"
                  type="password"
                  // placeholder="Password"
                  name="password"
                  value={password}
                  required
                  onChange={onChange}
                />
              </div>

              <input
                type="submit"
                value="Login"
                // className="rounded-md py-1 pl-2 mt-3 w-full bg-blue-200 border-2 border-solid border-black "
                className={`rounded-3xl py-2 pl-2 mt-3 w-full ${
                  loading
                    ? "bg-indigo-500 hover:bg-indigo-500"
                    : "bg-indigo-700 hover:bg-indigo-900"
                }  hover:text-white text-white`}
                // disabled={loading}
              />
            </form>
          </section>
        </div>
      }
    </>
  );
};

export default Login;
