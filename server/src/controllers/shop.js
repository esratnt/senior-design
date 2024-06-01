// controllers/shop.js
const db = require("../db");
const { hash } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { SECRET } = require("../constants");

exports.postProduct = async (req, res) => {
  const { name, desc, price, quantity } = req.body;

  try {
    const user = req.user;

    if (user) {
      await db.query(
        "INSERT INTO hr_shop(product_name, product_desc, product_price, product_quantity) VALUES ($1, $2, $3, $4)",
        [name, desc, price, quantity]
      );
      return res.status(200).json({
        info: "product info",
      });
    } else {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
