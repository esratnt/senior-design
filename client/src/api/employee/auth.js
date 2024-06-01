import axios from "axios";
axios.defaults.withCredentials = true;

export const getEmployees = async () => {
  return await axios.get("http://localhost:7070/api/employee/employees");
};

export async function logout() {
  return await axios.get("http://localhost:7070/api/employee/logout");
}
export async function fetchProtectedInfo() {
  return await axios.get("http://localhost:7070/api/employee/protected");
}
