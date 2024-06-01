import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchProtectedInfo,
  onLogout,
  postHours,
  postMonthlyHour,
} from "../api/auth";
import Layout from "../components/layout";
import { unauthenticateUser } from "../redux/slices/authSlice";
import { getUser } from "../api/auth";

const Hours = () => {
  const [user, setUser] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState(null);
  const [values, setValues] = useState({
    start: "",
    end: "",
  });

  const [request, setRequest] = useState({
    userId: null,
    hours: null,
  });

  const [totalHours, setTotalHours] = useState(null);
  const [showSubmitAlert, setShowSubmitAlert] = useState(false);
  const [showMonthlyAlert, setShowMonthlyAlert] = useState(false);

  const logout = async () => {
    try {
      await onLogout();
      dispatch(unauthenticateUser());
      localStorage.removeItem("isAuth");
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

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotalHours = () => {
    const { start, end } = values;

    if (!start || !end || new Date(end) < new Date(start)) {
      setTotalHours(null);
      return;
    }

    const [startHour, startMin] = start.split(":").map((val) => parseInt(val));
    const [endHour, endMin] = end.split(":").map((val) => parseInt(val));

    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;

    let difference = endTotalMin - startTotalMin;

    if (difference < 0) {
      difference += 24 * 60;
    }

    setTotalHours(difference);
  };

  const confirmSubmit = () => {
    const confirmed = window.confirm("Are you sure you want to submit?");
    if (confirmed) {
      setHours();
      setShowSubmitAlert(true);
    }
  };

  const confirmSetMonthlyHours = () => {
    const confirmed = window.confirm(
      "Are you sure you want to set monthly hours?"
    );
    if (confirmed) {
      setMonthlyHours();
      setShowMonthlyAlert(true);
    }
  };

  const setHours = async () => {
    try {
      const { data } = await postHours({ hours: totalHours });
    } catch (err) {
      console.log(err);
    }
  };

  const setMonthlyHours = async () => {
    try {
      const { data } = await postMonthlyHour();
    } catch (err) {
      console.log(err);
    }
  };

  const formatTotalHours = (totalMin) => {
    const hours = Math.floor(totalMin / 60);
    const mins = totalMin % 60;
    return `${hours} hours ${mins} minutes`;
  };

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <Layout>
      <div>
        <label>Start Time (hours:minutes):</label>
        <input
          type="text"
          name="start"
          value={values.start}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>End Time (hours:minutes):</label>
        <input
          type="text"
          name="end"
          value={values.end}
          onChange={handleChange}
        />
      </div>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={calculateTotalHours}
      >
        Calculate
      </button>
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={confirmSetMonthlyHours}
      >
        Month
      </button>
      {totalHours !== null && (
        <>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={confirmSubmit}
          >
            Submit
          </button>
        </>
      )}

      {totalHours !== null && (
        <div>
          <p>Total Minute: {formatTotalHours(totalHours)}</p>
        </div>
      )}

      {showSubmitAlert && (
        <div className="alert alert-success" role="alert">
          Submitted successfully!
        </div>
      )}

      {showMonthlyAlert && (
        <div className="alert alert-success" role="alert">
          Monthly hours set successfully!
        </div>
      )}
    </Layout>
  );
};

export default Hours;
