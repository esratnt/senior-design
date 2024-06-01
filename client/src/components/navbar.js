import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { unauthenticateUser } from "../redux/slices/authSlice";
import { onLogout } from "../api/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuth, role } = useSelector((state) => state.auth);

  const logout = async () => {
    try {
      const response = await onLogout();
      if (response.data.success) {
        dispatch(unauthenticateUser());
        localStorage.removeItem("isAuth");
        localStorage.removeItem("role");
      } else {
        console.log("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.log(
        "Error during logout:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          Team Tracker
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuth ? (
              <>
                {role === "admin-hr" && (
                  <>
                    <li className="nav-item">
                      <NavLink to="/dashboard" className="nav-link">
                        Dashboard
                      </NavLink>
                    </li>

                    <li className="nav-item">
                      <NavLink to="/employee" className="nav-link">
                        Employee
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/shop" className="nav-link">
                        Product
                      </NavLink>
                    </li>
                  </>
                )}
                {role === "employee_lead" && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        to="/employee-lead-dashboard"
                        className="nav-link"
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/video-upload" className="nav-link">
                        Videos
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/department-employee" className="nav-link">
                        Employee
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/mentor" className="nav-link">
                        Match
                      </NavLink>
                    </li>
                  </>
                )}
                {role === "employee" && (
                  <>
                    <li className="nav-item">
                      <NavLink to="/employee-dashboard" className="nav-link">
                        Dashboard
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/video-gallery" className="nav-link">
                        Videos
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/mentee" className="nav-link">
                        Matches
                      </NavLink>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <button onClick={logout} className="btn btn-primary nav-link">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
