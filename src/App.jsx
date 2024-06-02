import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultNav from "./components/Navigation/DefaultNav";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Homepage from "./components/homepage/Homepage";
import ProjectsPage from "./components/project/ProjectPage";
import ProjectsWrapper from "./components/project";
import { ProtectedRoute } from "./routes/ProtectedRoutes";
import ProjectActivity from "./components/activity/ProjectActivity";
import ActivityChart from "./components/charts/activityChart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFoundPage from "./components/notFoundPage/NotFoundPage";

function App() {
  return (
    <>
      <Router>
        <DefaultNav />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            {/* <Route path="/projects" element={<ProjectsWrapper />}> */}
            {/* <Route index element={<ProjectsPage />} /> */}
            <Route path="/projects" element={<ProjectsPage />} />
            {/* <Route element={<ProjectDashboard />}> */}
            <Route path="projects/project/:projectId" element={<ProjectsWrapper />}>
            {/* <Route path="projects/project" element={<ProjectsWrapper />}> */}
              <Route
                index
                // path="activities/:projectId"
                // path="activities"
                element={<ProjectActivity />}
              />
              <Route
                path="activities/chart"
                element={<ActivityChart />}
              />
            </Route>
          </Route>
          {/* </Route> */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;

// function App() {
//   return (
//     <>
//       <Router>
//         <DefaultNav />
//         <Routes>
//           <Route path="/" element={<Homepage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route element={<ProtectedRoute />}>
//             <Route path="/projects" element={<ProjectsWrapper />}>
//               <Route index element={<ProjectsPage />} />
//               <Route
//                 path="activities/:projectId"
//                 element={<ProjectActivity />}
//               />
//               <Route
//                 path="activities/chart/:projectId"
//                 element={<ActivityChart />}
//               />
//             </Route>
//           </Route>
//           <Route path="*" element={<NotFoundPage />} />
//         </Routes>
//       </Router>
//       <ToastContainer />
//     </>
//   );
// }
