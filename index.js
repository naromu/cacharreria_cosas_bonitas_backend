import express from "express";
import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cors from "cors";
import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT;

conectarDB();

//EndPoint imagenes categorias
app.use(
  "/storage/categories_api/images",
  express.static(path.join(__dirname, "storage/categories_api/images"))
);

//Endpoint imagenes porductos
app.use(
  "/storage/products_api/images",
  express.static(path.join(__dirname, "storage/products_api/images"))
);

//Endpoint usuarios
app.use("/api/usuarios", usuarioRoutes);

//Endpoint categorias
app.use("/api/categories", categoryRoutes);

//Endpoint productos
app.use("/api/products", productRoutes);

//Endpoint carrito
app.use("/api/cart", cartRoutes);

//Endpoint ordenes
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
