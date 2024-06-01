import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchProtectedInfo, onLogout, getUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";
import { unauthenticateUser } from "../redux/slices/authSlice";
import "../style/Dashboard.css"
const AdminHRDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState(null);

  const logout = async () => {
    try {
      await onLogout();
      dispatch(unauthenticateUser());
      localStorage.removeItem("isAuth");
      navigate("/login");
    } catch (error) {
      console.log(error.response);
    }
  };

  const protectedInfo = async () => {
    try {
      const { data } = await fetchProtectedInfo();
      setProtectedData(data.info);
      setLoading(false);
    } catch (error) {
      logout();
    }
  };

  const addHours = () => navigate("/hours");

  useEffect(() => {
    protectedInfo();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUser();
        console.log(data);
        const userData = data.user;
        setUser(userData);
      } catch (err) {
        console.log(err);
      }
    };

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
        <button type="button" className="btn btn-primary" onClick={addHours}>
          Add Hours
        </button>
      </Layout>
    </div>
  );
};

const EmployeeDashboard = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUser();
        const userData = data.user;
        setUser(userData);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

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
    <Layout>
      <h1>
        Welcome {user.name} {user.surname}
      </h1>
      <h2>This month you worked {formatHours(user.hours)}</h2>
    </Layout>
  );
};

const EmployeeLeadDashboard = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUser();
        const userData = data.user;
        setUser(userData);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

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
    <Layout>
      <h1>
        Welcome {user.name} {user.surname}
      </h1>
      <h2>This month you worked {formatHours(user.hours)}</h2>
    </Layout>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUser();
        const userData = data.user;
        setUser(userData);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <Layout>
        <h1>Loading...</h1>
      </Layout>
    );
  }

  if (user.role === "admin-hr") {
    return <AdminHRDashboard />;
  } else if (user.role === "employee") {
    return <EmployeeDashboard />;
  } else if (user.role === "employee_lead") {
    return <EmployeeLeadDashboard />;
  } else {
    return (
      <Layout>
        <h1>Unauthorized</h1>
      </Layout>
    );
  }
};

export default Dashboard;
