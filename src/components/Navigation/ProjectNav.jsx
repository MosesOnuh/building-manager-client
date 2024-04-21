import { Link } from "react-router-dom";

const ProjectNav = () => {
  return (
    <div class="navbar">
      <div class="navlogo-container">
        {/* <img src="./asset/images/logo/netflix.png" class="logo" alt="Netflix logo"> */}
        <Link to="/">
          <p>Building Manager</p>
        </Link>
      </div>
      <ul class="nav-items">
        <Link to="/login">
          <li>
            {/* <a href="./about.html"> Sign In </a> */}
            Sign In
          </li>
        </Link>
        <Link to="/signup">
          <li>
            {/* <a href="./contact.html"> Sign Up </a> */}
            Sign Up
          </li>
        </Link>
      </ul>
      <div clas="empty-nav"></div>
    </div>
  );
};

export default ProjectNav;
