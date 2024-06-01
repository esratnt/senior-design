import axios from "axios";
axios.defaults.withCredentials = true;

export async function uploadVideo(videoData, config) {
  return await axios.post(
    "http://localhost:7070/api/employee/video/upload",
    videoData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    }
  );
}

export async function fetchVideosByCategory(category, subcategory = "") {
  const url = subcategory
    ? `http://localhost:7070/api/employee/video/${category}/${subcategory}`
    : `http://localhost:7070/api/employee/video/${category}`;
  return await axios.get(url);
}

export async function fetchCategories() {
  return await axios.get("http://localhost:7070/api/employee/categories");
}
