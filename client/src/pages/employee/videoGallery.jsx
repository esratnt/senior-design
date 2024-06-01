import React, { useState, useEffect } from "react";
import { fetchCategories, fetchVideosByCategory } from "../../api/employee/video";
import Layout from "../../components/layout"

const VideoGallery = () => {
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const { data } = await fetchCategories();
        setCategories(data);
        console.log("Categories fetched:", data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategoriesData();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("");
    setVideos([]);
  };

  const handleSubcategoryClick = async (category, subcategory) => {
    setSelectedSubcategory(subcategory);
    try {
      const { data } = await fetchVideosByCategory(category, subcategory);
      setVideos(data);
      console.log("Videos fetched for subcategory:", subcategory, data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const renderSubcategories = (category) => {
    const subcategories = categories.filter(cat => cat.startsWith(`${category}/`)).map(cat => cat.split("/")[1]);
    if (subcategories.length === 0) return null;

    return (
      <div>
        <h3>Subcategories</h3>
        <div className="list-group">
          {subcategories.map((subcategory) => (
            <button
              key={subcategory}
              className={`list-group-item list-group-item-action ${selectedSubcategory === subcategory ? 'active' : ''}`}
              onClick={() => handleSubcategoryClick(category, subcategory)}
            >
              {subcategory}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mt-3">
        <h1>Video Gallery</h1>
        <div className="row">
          <div className="col-md-4">
            <h2>Categories</h2>
            <div className="list-group">
              {categories.length === 0 ? (
                <p>No categories available</p>
              ) : (
                categories.filter(cat => !cat.includes("/")).map((category) => (
                  <button
                    key={category}
                    className={`list-group-item list-group-item-action ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>
                ))
              )}
            </div>
            {selectedCategory && renderSubcategories(selectedCategory)}
          </div>
          <div className="col-md-8">
            <h2>Videos</h2>
            {videos.length === 0 ? (
              <p>No videos available</p>
            ) : (
              <div className="list-group">
                {videos.map((video, index) => (
                  <a key={index} href={video.url} className="list-group-item list-group-item-action" target="_blank" rel="noopener noreferrer">
                    {video.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoGallery;
