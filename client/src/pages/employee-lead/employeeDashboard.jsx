import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout";
import { unauthenticateUser } from "../../redux/slices/authSlice";
import {
  logout,
  getEmpLead,
  protectedInfo,
} from "../../api/employee-lead/auth";

const EmployeeLeadDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState(null);

  const logoutEmp = async () => {
    try {
      await logout();
      dispatch(unauthenticateUser());
      localStorage.removeItem("isAuth");
      localStorage.removeItem("role");
      navigate("/login");
    } catch (error) {
      console.log(
        "Error during logout:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const fetchProtectedInfo = async () => {
    try {
      const { data } = await protectedInfo();
      setProtectedData(data.info);
    } catch (error) {
      console.log(
        "Error fetching protected info:",
        error.response ? error.response.data : error.message
      );
      logoutEmp();
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await getEmpLead();
      console.log("Fetched user data:", data);
      const userData = data.user;
      setUser(userData);
    } catch (err) {
      console.log(
        "Error fetching user data:",
        err.response ? err.response.data : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProtectedInfo();
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const formatHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hours ${remainingMinutes} minutes`;
  };

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div>
      <Layout>
        <h1>
          Welcome {user.name} {user.surname}
        </h1>
        <h2>This month you worked {formatHours(user.hours)}</h2>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/hours")}
        >
          Add Hours
        </button>
      </Layout>
    </div>
  );
};

export default EmployeeLeadDashboard;
