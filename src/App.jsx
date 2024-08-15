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
// import ActivityChart from "./components/charts/activityChart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFoundPage from "./components/notFoundPage/NotFoundPage";
import ProjectInvites from "./components/projectInvite/Index";
import ProjectInfo from "./components/projectInfo";
import PaymentRequest from "./components/paymentRequest/PaymentRequest";

import AppCharts from "./components/charts/AppCharts";
import Chat from "./components/chat/Chat";

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
            <Route path="/invites" element={<ProjectInvites />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route
              path="projects/project/:projectId"
              element={<ProjectsWrapper />}
            >
              <Route index element={<ProjectActivity />} />
              {/* <Route path="activities/chart" element={<ActivityChart />} /> */}
              <Route path="activities/chart" element={<AppCharts />} />
              <Route path="info" element={<ProjectInfo />} />
              <Route path="chatMessage" element={<Chat />} />
              <Route path="paymentRequest" element={<PaymentRequest />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;