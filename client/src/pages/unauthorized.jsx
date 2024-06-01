import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="container mt-3">
      <h1>Unauthorized</h1>
      <p>You do not have access to this page.</p>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default Unauthorized;
