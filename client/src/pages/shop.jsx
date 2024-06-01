import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import { onProductRegistation } from "../api/shop";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Shop.css';

const Shop = () => {
  const [values, setValues] = useState({
    name: "",
    desc: "",
    price: "",
    quantity: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSubmitAlert, setShowSubmitAlert] = useState(false);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await onProductRegistation(values);
      console.log(data); // Log the response data from the API

      setError("");
      setSuccess(data.message);
      setValues({
        name: "",
        desc: "",
        price: "",
        quantity: "",
      });

      setShowSubmitAlert(true); // Show the submit alert
      setTimeout(() => {
        setShowSubmitAlert(false); // Hide the submit alert after 3 seconds
      }, 3000);
    } catch (error) {
      console.log(error); // Log any errors
      setError(error.response.data.errors[0].msg);
      setSuccess("");
    }
  };

  return (
    <div className="shop-page">
      <Layout>
        <div className="container container-product mt-5">
          <form onSubmit={(e) => onSubmit(e)} className="product-form">
            <h1 className="text-center mb-4">Register Product</h1>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Product Name
              </label>
              <input
                onChange={(e) => onChange(e)}
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={values.name}
                placeholder="Enter product name here"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="desc" className="form-label">
                Product Description
              </label>
              <textarea
                onChange={(e) => onChange(e)}
                className="form-control"
                id="desc"
                name="desc"
                value={values.desc}
                placeholder="Enter description here"
                rows="3"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Product Price
              </label>
              <input
                onChange={(e) => onChange(e)}
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={values.price}
                placeholder="Enter product price here"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="quantity" className="form-label">
                Product Quantity
              </label>
              <input
                onChange={(e) => onChange(e)}
                type="number"
                value={values.quantity}
                className="form-control"
                id="quantity"
                name="quantity"
                placeholder="Enter product quantity here"
                required
              />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {showSubmitAlert && (
              <div className="alert alert-success">Submitted successfully!</div>
            )}

            <div className="text-center">
              <button type="submit" className="btn btn-outline-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </div>
  );
};

export default Shop;
