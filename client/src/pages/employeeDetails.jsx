import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import { useParams } from "react-router-dom";
import { getEmployeeById } from "../api/employee";

const EmployeeDetails = () => {
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const { emp_id } = useParams();

  useEffect(() => {
    console.log("Employee ID:", emp_id);
    console.log("Full URL:", window.location.href);

    const fetchEmployeeDetails = async () => {
      try {
        if (!emp_id) {
          console.error("Employee ID is missing or invalid.");
          return;
        }

        const { data } = await getEmployeeById(emp_id);
        console.log("Fetched employee details:", data);
        setEmployeeDetails(data.employees);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEmployeeDetails();
  }, [emp_id]);

  return (
    <Layout>
      {employeeDetails && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              {employeeDetails.name} {employeeDetails.surname}
            </h5>
            <h6 className="card-subtitle mb-2 text-body-secondary">
              {employeeDetails.department}
            </h6>
            <p className="card-text">{employeeDetails.userrole}</p>
            <p className="card-text">{employeeDetails.phone}</p>

            <p className="card-text">{employeeDetails.email}</p>
            <p className="card-text">{employeeDetails.salary}</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EmployeeDetails;
