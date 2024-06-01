import React, { useState, useEffect } from "react";
import { uploadVideo, fetchCategories } from "../../api/employee-lead/video";
import Layout from "../../components/layout";

const VideoUpload = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const { data } = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); 
      }
    };
    fetchCategoriesData();
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  const handleNewSubcategoryChange = (e) => {
    setNewSubcategory(e.target.value);
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedCategory || !videoFile) {
      alert("Please select a category and a video file.");
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("category", selectedCategory);
    if (selectedSubcategory) {
      formData.append("subcategory", selectedSubcategory);
    } else if (newSubcategory) {
      formData.append("subcategory", newSubcategory);
    }

    try {
      const { data } = await uploadVideo(formData);
      setLoading(false);
      setSuccessMessage("Video uploaded successfully!");
      // Clear the form
      setSelectedCategory("");
      setSelectedSubcategory("");
      setNewSubcategory("");
      setVideoFile(null);
      document.getElementById('video-upload-form').reset();
    } catch (error) {
      setLoading(false);
      console.error("Error uploading video:", error);
      alert("Error uploading video.");
    }
  };

  return (
    <Layout>
    <div className="container mt-3">
      <h1>Upload Video</h1>
      <form id="video-upload-form">
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select id="category" className="form-select" onChange={handleCategoryChange} value={selectedCategory}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="subcategory" className="form-label">Subcategory</label>
          <input
            type="text"
            id="subcategory"
            className="form-control"
            value={newSubcategory}
            onChange={handleNewSubcategoryChange}
            placeholder="Enter new subcategory (if not selected)"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="videoFile" className="form-label">Video File</label>
          <input
            type="file"
            id="videoFile"
            className="form-control"
            onChange={handleFileChange}
            accept="video/*"
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {successMessage && <p className="mt-3 text-success">{successMessage}</p>}
    </div>
    </Layout>
  );
};

export default VideoUpload;
