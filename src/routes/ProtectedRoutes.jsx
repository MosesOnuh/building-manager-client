import { Outlet, useNavigate } from "react-router-dom";
import { accessToken } from "../utils/constants";
import { useEffect, useRef } from "react";
import {
  ChakraProvider, 
  useDisclosure,
  Button,
  Input,
  Text,
  Box,
} from "@chakra-ui/react";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

export const ProtectedRoute = () => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const btnRef = useRef();

  const token  = sessionStorage.getItem(accessToken)
  const navigate = useNavigate();
  const navigateToLoginPage = () => {
    navigate("/login");
  };
 
  

//   // Check if the user is authenticated
//   if (!token) {
//     // If not authenticated, redirect to the login page
//     return <Navigate to="/login" />;
//   }


  // Check if the user is authenticated

  useEffect(() =>{
    if (!token) {
      navigateToLoginPage();
    }
  }, [token])

  // If authenticated, render the child routes
  return (
    <>
      {token && (
        <>      
          <SideBar />
          <Outlet />
        </>
      )}
    </>
  ); 
};


function SideBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const navigate = useNavigate();

  const navigateToProjectsPage = () => {
    navigate("/projects");
  };

  return (
    <ChakraProvider>
      {/* <Box w="40%" mx="auto"> */}
      <Box pl="4">
        <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
          Side Menu
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
              {/* <Input placeholder="Type here..." /> */}
              <button onClick={navigateToProjectsPage}>Projects</button>
              {/* <button >Invites</button> */}
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