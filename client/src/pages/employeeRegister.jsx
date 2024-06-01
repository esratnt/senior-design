import { useState } from "react";
import { onRegistrationEmployee } from "../api/employee";
import Layout from "../components/layout";
import { useNavigate } from "react-router-dom";

const EmployeeRegister = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    phone: "",
    userrole: "",
    department: "",
    salary: "",
  });
  const [displayedUserRole, setDisplayedUserRole] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await onRegistrationEmployee(values);

      setError("");
      setSuccess(data.message);
      setValues({
        name: "",
        surname: "",
        email: "",
        password: "",
        phone: "",
        userrole: "",
        department: "",
        salary: "",
      });
      setDisplayedUserRole("");
    } catch (error) {
      setError(error.response.data.errors[0].msg);
      setSuccess("");
    }
  };

  const showEmployee = () => navigate("/employee");

  const handleSelect = (department) => {
    setValues({ ...values, department });
  };

  const handleSelectUserRole = (userrole) => {
    const role = userrole === "Employee" ? "employee" : "employee_lead";
    setValues({ ...values, userrole: role });
    setDisplayedUserRole(userrole);
  };

  return (
    <Layout>
      <button type="button" className="btn btn-primary" onClick={showEmployee}>
        Show Employee
      </button>

      <form onSubmit={(e) => onSubmit(e)} className="container mt-3">
        <h1>Register</h1>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            onChange={(e) => onChange(e)}
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={values.name}
            placeholder="Enter your name here"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="surname" className="form-label">
            Surname
          </label>
          <input
            onChange={(e) => onChange(e)}
            type="text"
            className="form-control"
            id="surname"
            name="surname"
            value={values.surname}
            placeholder="Enter your surname here"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            onChange={(e) => onChange(e)}
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={values.email}
            placeholder="test@gmail.com"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            onChange={(e) => onChange(e)}
            type="password"
            value={values.password}
            className="form-control"
            id="password"
            name="password"
            placeholder="password"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            onChange={(e) => onChange(e)}
            type="number"
            value={values.phone}
            className="form-control"
            id="phone"
            name="phone"
            placeholder="Phone number"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="userrole" className="form-label">User Role</label>
          <div className="dropdown">
            <a className="btn btn-outline-primary dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {displayedUserRole || 'Select User Role'}
            </a>

            <ul className="dropdown-menu">
              <li><a className="dropdown-item" onClick={() => handleSelectUserRole('Employee')}>Employee</a></li>
              <li><a className="dropdown-item" onClick={() => handleSelectUserRole('Employee Lead')}>Employee Lead</a></li>
            </ul>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="department" className="form-label">Department</label>
          <div className="dropdown">
            <a className="btn btn-outline-primary dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {values.department || 'Select Department'}
            </a>

            <ul className="dropdown-menu">
              <li><a className="dropdown-item" onClick={() => handleSelect('Mobile')}>Mobile</a></li>
              <li><a className="dropdown-item" onClick={() => handleSelect('Backend')}>Backend</a></li>
              <li><a className="dropdown-item" onClick={() => handleSelect('Frontend')}>Frontend</a></li>
            </ul>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="salary" className="form-label">
            Salary
          </label>
          <input
            onChange={(e) => onChange(e)}
            type="number"
            value={values.salary}
            className="form-control"
            id="salary"
            name="salary"
            placeholder="Enter the salary"
            required
          />
        </div>

        <div style={{ color: "red", margin: "10px 0" }}>{error}</div>
        <div style={{ color: "green", margin: "10px 0" }}>{success}</div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </Layout>
  );
};

export default EmployeeRegister;
