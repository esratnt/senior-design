import axios from "axios";
axios.defaults.withCredentials = true;

export async function onRegistrationEmployee(employeeRegistrationData) {
  return await axios.post(
    "http://localhost:7070/api/employee/register",
    employeeRegistrationData
  );
}

export async function getEmployeeInfo() {
  return await axios.get("http://localhost:7070/api/get-employee");
}

export async function getEmployeeById(employeeId) {
  return await axios.get(`http://localhost:7070/api/employee-id/${employeeId}`);
}
