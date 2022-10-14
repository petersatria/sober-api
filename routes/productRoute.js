const route = require("express").Router();
const { getAllProduct, createProduct, getProductById, deleteProduct, editProduct, findProductCategory, searchProduct } = require("../controller/ProductController");
const {authApiAdmin} = require('../controller/authorizeRoutes')

// authorization belum buat
route.post("/api/product", getAllProduct);
route.get("/api/productCategory", findProductCategory);
route.get("/api/searchProduct", searchProduct);
route.post("/api/create-product", authApiAdmin, createProduct);
route.get("/api/product/:id", getProductById);
route.patch("/api/edit-data/:id", authApiAdmin, editProduct);
route.delete("/api/delete-product/:id", authApiAdmin, deleteProduct);
route.post("/detail", (req, res) => {
  const detail = req.body;
  res.send(detail);
});

module.exports = route;
