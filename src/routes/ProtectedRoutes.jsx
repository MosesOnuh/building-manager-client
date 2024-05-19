import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
// import { accessToken } from "../utils/constants";
import { useEffect, useRef, useState } from "react";
import {
  ChakraProvider,
  useDisclosure,
  Button,
  Input,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";
import { toast } from "react-toastify";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
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
    // setLoading(true)
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
      {/* {loading && <Loader />} */}
      {/* {auth?.accessToken ? (
        <>
          <SideBar />
          <Outlet />
        </>
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )} */}

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const { error, setErrToNull, post } = useAPI();
  const { auth, setAuth } = useAuth();

  const navigate = useNavigate();

  const navigateToProjectsPage = () => {
    navigate("/projects");
  };
  const navigateToLoginPage = () => {
    navigate("/login");
  };

  const toastId = useRef(null);
  const logOut = async () => {
    try {
      toastId.current = toast.loading("Logging out...");
      const response = await post(`/User/logout`);
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
    <ChakraProvider>
      {/* <Box w="40%" mx="auto"> */}
      <Box pl="4">
        {/* <Button ref={btnRef} colorScheme="teal" onClick={onOpen}> */}
        <Button ref={btnRef} onClick={onOpen}>
          {/* <FaHamburger /> */}
          <FaBars />
        </Button>
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            {/* <DrawerHeader>Create your account</DrawerHeader> */}

            <DrawerBody>
              {/* <button onClick={navigateToProjectsPage}>Projects</button>
                <button>log Out</button> */}
              <p onClick={navigateToProjectsPage}>Projects</p>
              <p onClick={logOut}>Log Out</p>
              {/* <p>Some contents...</p> */}
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              {/* <Button colorScheme="blue">Save</Button> */}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Box>
    </ChakraProvider>
  );
}

// function SideBar() {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const btnRef = useRef();

//   return (
//     <ChakraProvider>
//       <Text
//         color="#2F8D46"
//         fontSize="2rem"
//         textAlign="center"
//         fontWeight="400"
//         my="1rem"
//       >
//         GeeksforGeeks - React JS Chakra UI concepts
//       </Text>
//       <Box w="40%" mx="auto">
//         <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
//           Open
//         </Button>
//         <Drawer
//           isOpen={isOpen}
//           placement="right"
//           onClose={onClose}
//           finalFocusRef={btnRef}
//         >
//           <DrawerOverlay />
//           <DrawerContent>
//             <DrawerCloseButton />
//             <DrawerHeader>Create your account</DrawerHeader>

//             <DrawerBody>
//               <Input placeholder="Type here..." />
//             </DrawerBody>

//             <DrawerFooter>
//               <Button variant="outline" mr={3} onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button colorScheme="blue">Save</Button>
//             </DrawerFooter>
//           </DrawerContent>
//         </Drawer>
//       </Box>
//     </ChakraProvider>
//   );
// }
