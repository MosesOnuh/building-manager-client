import "./Homepage.css";
import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
// import image from "../../assets/construction.png";

const Homepage = () => {
  const elementRef = useRef(null);
  const [elemWidth, setElemWidth] = useState(null);
  

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/projects";

  useEffect(()=>{
    if (elementRef.current){
      const elementWidth = elementRef.current.offsetWidth;
      setElemWidth(elementWidth);
    }
  }, [elementRef])

   const navigateToProjectsPage = () => {
     navigate(from, { replace: true });
   };

   useEffect(() => {
     if (auth?.accessToken) {
       navigateToProjectsPage();
     }
   }, [auth]);


  return (
    <div className="center-body  flex  justify-center">
      {/* current old */}
      {/* <div className=" flex-col sm:flex-row h-4/5 w-4/5 flex">
        <div className="w-full md:block md:w-2/4 h-full home-image"></div>
        <div className="w-full md:w-2/4 h-full md:flex items-center justify-center">
          <div className=" flex flex-col justify-evenly  h-3/5">
            <p className="text-center md:text-2xl"> Welcome to</p>
            <p className="text-3xl md:text-5xl text-center">Civil Manager</p>
            <p className="text-center w-4/5 mx-auto">
              The number one tool for managing Housing Construction Works
            </p>
          </div>
        </div>
      </div> */}
      <div
        ref={elementRef}
        className=" flex-col sm:flex-row w-4/5 flex mt-10 h-4/5"
        style={{ height: elemWidth ? 0.43 * elemWidth : "80%" }}
      >
        <div className="w-full md:block md:w-2/4 h-full home-image"></div>
        <div className="w-full md:w-2/4 h-full sm:flex items-center justify-center">
          <div className=" flex flex-col justify-evenly ml-2 h-3/5">
            <p className="text-center md:text-2xl"> Welcome to</p>
            <p className="text-3xl md:text-5xl text-center font-inter font-bold">
              {/* <p className="text-3xl md:text-5xl text-center font-inter"> */}
              Building Manager
            </p>
            <p className="text-center w-4/5 mx-auto">
              The number one tool for managing Housing Construction Works
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
