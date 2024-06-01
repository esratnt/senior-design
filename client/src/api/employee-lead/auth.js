import axios from "axios";
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export async function logout() {
  return await axios.get("http://localhost:7070/empl/logout");
}

export async function getEmpLead() {
  return await axios.get("http://localhost:7070/empl/get-user");
}

export async function protectedInfo() {
  return await axios.get("http://localhost:7070/empl/protected");
}
export async function getEmployeeInfo() {
  return await axios.get("http://localhost:7070/empl//get-employee");
}
