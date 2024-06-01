import axios from "axios";
axios.defaults.withCredentials = true;

export async function onProductRegistation(productData) {
  return await axios.post(
    "http://localhost:7070/api/product-register",
    productData
  );
}
