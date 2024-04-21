// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App



import './App.css';
import { BrowserRouter as Router,Routes, Route} from "react-router-dom";
import DefaultNav from './components/Navigation/DefaultNav';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Homepage from './components/homepage/Homepage';
import ProjectsPage from './components/project/ProjectPage';
import ProjectsWrapper from './components/project';
import { ProtectedRoute } from './routes/ProtectedRoutes';
import ProjectActivity from "./components/activity/ProjectActivity";
import ActivityChart from './components/charts/activityChart';
// import Routes from './routes/routes';

function App() {
  return (
    <Router>
      <DefaultNav/>
      <Routes>
        <Route path= '/' element = {<Homepage />} />
        <Route path= '/login' element = {<Login />} />
        <Route path= '/signup' element = {<Signup />} />
        <Route element = {<ProtectedRoute />}> 
          <Route path = '/projects' element ={ <ProjectsWrapper />} >
            <Route index element ={ <ProjectsPage />} />
            <Route path ="activities/:projectId" element ={ <ProjectActivity />} />
            <Route path ="activities/chart/:projectId" element ={ <ActivityChart />} /> 
          </Route>       
        </Route>  
      </Routes>
    </Router> 
    );
}

export default App;


// function App() {
//   return (
//     <Router>
//       <nav style={{ margin: 10 }}>
//           <Link to="/" style={{ padding: 5 }}>
//           Home
//           </Link>
//           <Link to="/posts" style={{ padding: 5 }}>
//           Posts
//           </Link>
//           <Link to="/about" style={{ padding: 5 }}>
//           About
//           </Link>
//       </nav>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/posts" element={<Posts />}>
//           <Route index element={<PostLists />} />
//           <Route path=":slug" element={<Post />} />
//         </Route>
//         <Route path="/about" element={<About />} />
//         <Route path="*" element={<NoMatch />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
