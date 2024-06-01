import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getEmployeeInfo } from "../api/employee";
import { fetchProtectedInfo, onLogout } from "../api/auth";
import { unauthenticateUser } from "../redux/slices/authSlice";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Employee.css';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [protectedData, setProtectedData] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

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
    console.log("Employee ID:", employeeId); // employeeId değerini kontrol et
    navigate(`/employee-details/${employeeId}`);
  };

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div className="employee-page">
      <Layout>
        <div className="container">
          <div className="add-employee-container">
            <button type="button" className="btn btn-primary add-employee-btn" onClick={addEmployee}>
              Add Employee
            </button>
          </div>
          <div className="row employee-cards">
            {employees.map((employee, index) => (
              <div
                className="col-md-4"
                key={index}
                onClick={() => employeeDetails(employee.emp_id)}
              >
                <div className="card employee-card">
                  <div className="card-body">
                    <h5 className="card-title">
                      {employee.name} {employee.surname}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">
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
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Employee;
