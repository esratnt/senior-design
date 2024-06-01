import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getEmployeeInfo,logout,protectedInfo } from "../../api/employee-lead/auth";
import { unauthenticateUser } from "../../redux/slices/authSlice";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [protectedData, setProtectedData] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const onLogout = async () => {
    try {
      await logout();

      dispatch(unauthenticateUser());
      localStorage.removeItem("isAuth");
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchProtectedInfo = async () => {
    try {
      const { data } = await protectedInfo();

      setProtectedData(data.info);

      setLoading(false);
    } catch (error) {
        onLogout();
    }
  };

  useEffect(() => {
    fetchProtectedInfo();
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const { data } = await getEmployeeInfo();
        console.log(data);
        const employeeData = data.employees;
        setEmployees(employeeData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllUsers();
  }, []);

  const addEmployee = () => navigate("/employee-register");
  const employeeDetails = (employeeId) => {
    console.log("Employee ID:", employeeId); 
    navigate(`/employee-details/${employeeId}`);
  };

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div>
      <Layout>
        {employees.map((employee, index) => (
          <div
            className="card"
            key={index}
            onClick={() => employeeDetails(employee.emp_id)}
          >
            <div className="card-body">
              <h5 className="card-title">
                {employee.name} {employee.surname}
              </h5>
              <h6 className="card-subtitle mb-2 text-body-secondary">
                {employee.department}
              </h6>
              <p className="card-text">{employee.userrole}</p>
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() => employeeDetails(employee.emp_id)}
              >
                See Details
              </button>
            </div>
          </div>
        ))}
      </Layout>
    </div>
  );
};

export default EmployeeList;
