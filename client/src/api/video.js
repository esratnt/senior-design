// api/video.js
import axios from "axios";
axios.defaults.withCredentials = true;

export async function uploadVideo(videoData, config) {
  return await axios.post("http://localhost:7070/api/video/upload", videoData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    ...config,
  });
}

export async function fetchVideosByCategory(category) {
  return await axios.get(`http://localhost:7070/api/video/${category}`);
}

export async function fetchCategories() {
  return await axios.get("http://localhost:7070/api/categories");
}
