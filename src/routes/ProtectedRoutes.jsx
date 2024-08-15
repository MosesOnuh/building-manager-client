import { Outlet, useNavigate, useLocation, Navigate, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
// import {
//   ChakraProvider,
//   useDisclosure,
//   Button,
//   Input,
//   Text,
//   Box,
//   Flex,
// } from "@chakra-ui/react";

// import {
//   Drawer,
//   DrawerBody,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerCloseButton,
// } from "@chakra-ui/react";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { accessToken, refreshToken } from "../utils/constants";
import Loader from "../components/loading/Loading";
import useAPI from "../hooks/useAPI";
import { FaBars } from "react-icons/fa";

export const ProtectedRoute = () => {
  const { auth, setAuth } = useAuth();
  const location = useLocation();
  const [load, setLoading] = useState(true);

  useEffect(() => {
    if (!auth?.accessToken && sessionStorage.getItem(accessToken)) {
      setAuth({
        accessToken: sessionStorage.getItem(accessToken),
        refreshToken: sessionStorage.getItem(refreshToken),
      });
    }
    setLoading(false);
  }, []);

  return (
    <>
      {auth?.accessToken && (
        <>
          <SideBar />
          <Outlet />
        </>
      )}

      {!load && !auth?.accessToken && (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
      {load && <Loader />}
    </>
  );
};

function SideBar() {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const btnRef = useRef();
  const { error, setErrToNull, post } = useAPI();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) =>
    isActive
      ? "bg-black text-white hover:bg-gray-900 px-3 py-2 rounded-lg"
      : "text-white hover:bg-gray-900 px-3 py-2 rounded-lg";

  // const navigateToProjectsPage = () => {
  //   navigate("/projects");
  // };
  // const navigateToProjectInvitesPage = () => {
  //   navigate("/invites");
  // };
  const navigateToLoginPage = () => {
    navigate("/login");
  };

  const toastId = useRef(null);
  const logOut = async () => {
    try {
      toastId.current = toast.loading("Logging out...");
      // const response = await post(`/User/logout`);
      await post(`/User/logout`);
      sessionStorage.removeItem(accessToken);
      sessionStorage.removeItem(refreshToken);
      setAuth({});
      toast.update(toastId.current, {
        render: "Logout Successful",
        type: "success",
        isLoading: false,
      });
      setTimeout(() => toast.dismiss(), 3000);
      setErrToNull();
      navigateToLoginPage;
    } catch (err) {
      toast.update(toastId.current, {
        render: error?.message || "Error Signing out",
        type: "error",
        isLoading: false,
      });
      setTimeout(() => toast.dismiss(), 3000);
    }
  };

  return (
    <nav className="bg-indigo-700 px-2 flex py-3 justify-between sm:px-10">
      <div></div>
      <div className="nav-items gap-x-2 flex md:gap-x-4">
        <NavLink
          className="text-white hover:bg-gray-900 px-3 py-2 rounded-lg"
          to="/projects"
        >
          Projects
        </NavLink>
        <NavLink to="/invites" className={linkStyle}>
          Invites
        </NavLink>
        <button
          onClick={logOut}
          className="text-white hover:bg-gray-900 px-3 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
// function SideBarOld() {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const btnRef = useRef();
//   const { error, setErrToNull, post } = useAPI();
//   const { setAuth } = useAuth();

//   const navigate = useNavigate();

//   const navigateToProjectsPage = () => {
//     navigate("/projects");
//   };
//   const navigateToProjectInvitesPage = () => {
//     navigate("/invites");
//   };
//   const navigateToLoginPage = () => {
//     navigate("/login");
//   };

//   const toastId = useRef(null);
//   const logOut = async () => {
//     try {
//       toastId.current = toast.loading("Logging out...");
//       // const response = await post(`/User/logout`);
//       await post(`/User/logout`);
//       sessionStorage.removeItem(accessToken);
//       sessionStorage.removeItem(refreshToken);
//       setAuth({});
//       toast.update(toastId.current, {
//         render: "Logout Successful",
//         type: "success",
//         isLoading: false,
//       });
//       setTimeout(() => toast.dismiss(), 3000);
//       setErrToNull();
//       navigateToLoginPage;
//     } catch (err) {
//       toast.update(toastId.current, {
//         render: error?.message || "Error Signing out",
//         type: "error",
//         isLoading: false,
//       });
//       setTimeout(() => toast.dismiss(), 3000);
//     }
//   };

//   return (
//     <ChakraProvider>
//       <Box pl="4">
//         <Button ref={btnRef} onClick={onOpen}>
//           <FaBars />
//         </Button>
//         <Drawer
//           isOpen={isOpen}
//           placement="left"
//           onClose={onClose}
//           finalFocusRef={btnRef}
//         >
//           <DrawerOverlay />
//           <DrawerContent>
//             <DrawerCloseButton />
//             <DrawerBody>
//               {/* <button onClick={navigateToProjectsPage}>Projects</button>
//                 <button>log Out</button> */}
//               <p onClick={navigateToProjectsPage}>Projects</p>
//               <p onClick={navigateToProjectInvitesPage}>Invites</p>
//               <p onClick={logOut}>Log Out</p>
//               {/* <p>Some contents...</p> */}
//             </DrawerBody>

//             <DrawerFooter>
//               <Button variant="outline" mr={3} onClick={onClose}>
//                 Cancel
//               </Button>
//             </DrawerFooter>
//           </DrawerContent>
//         </Drawer>
//       </Box>
//     </ChakraProvider>
//   );
// }
