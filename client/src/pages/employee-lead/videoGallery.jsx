import React, { useState, useEffect } from "react";
import Layout from "../../components/layout";
import { fetchVideosByCategory } from "../../api/employee-lead/video";

const VideoGallery = () => {
  const [category, setCategory] = useState("");
  const [videos, setVideos] = useState([]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const fetchVideos = async () => {
    if (category) {
      try {
        const { data } = await fetchVideosByCategory(category);
        setVideos(data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [category]);

  return (
    <Layout>
      <div className="container mt-3">
        <h1>Video Gallery</h1>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Select Category
          </label>
          <input
            type="text"
            className="form-control"
            id="category"
            value={category}
            onChange={handleCategoryChange}
            placeholder="Enter category"
          />
        </div>
        <div className="video-gallery">
          {videos.map((videoUrl, index) => (
            <div key={index} className="video-item">
              <video width="320" height="240" controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default VideoGallery;
