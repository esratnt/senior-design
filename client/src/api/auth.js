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

export async function onRegistration(registrationData) {
  return await axios.post(
    "http://localhost:7070/api/register",
    registrationData
  );
}

export async function onLogin(loginData) {
  return await axios.post("http://localhost:7070/api/login", loginData);
}

export async function getUser() {
  return await axios.get("http://localhost:7070/api/get-user");
}

export async function onLogout() {
  return await axios.get("http://localhost:7070/api/logout");
}

export async function fetchProtectedInfo() {
  return await axios.get("http://localhost:7070/api/protected");
}

export async function postHours(totalHours) {
  return await axios.post("http://localhost:7070/api/hour", totalHours);
}

export async function postMonthlyHour() {
  return await axios.post("http://localhost:7070/api/monthly-hour");
}
