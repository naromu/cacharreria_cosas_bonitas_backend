import Product from "../models/Products.js";
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generar un _id único
const generateUniqueId = async () => {
  let unique = false;
  let id = "";

  while (!unique) {
    id = "MCO" + Math.floor(1000000000 + Math.random() * 9000000000);
    const product = await Product.findById(id);
    if (!product) {
      unique = true;
    }
  }

  return id;
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  try {
    const uniqueId = await generateUniqueId();
    const product = new Product({ _id: uniqueId, ...req.body });
    const savedProduct = await product.save();
    res.json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al crear el producto" });
  }
};

// Listar todos los productos
const listProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryIds");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al listar los productos" });
  }
};

// Listar productos por categoría
const listProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const products = await Product.find({ categoryIds: categoryId }).populate(
      "categoryIds"
    );
    res.json(products);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Hubo un error al listar los productos por categoría" });
  }
};

// Ver un producto específico por ID
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categoryIds"
    );
    if (!product) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al obtener el producto" });
  }
};

// Editar un producto
const updateProduct = async (req, res) => {
  try {
    const { name, thumbnail, brand, price, categoryIds } = req.body;
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    product.name = name;
    product.thumbnail = thumbnail;
    product.brand = brand;
    product.price = price;
    product.categoryIds = categoryIds;

    if (req.file) {
      // Si hay una nueva imagen
      if (product.thumbnail) {
        // Si la categoría ya tiene una imagen, elimínala
        const oldImagePath = path.join(
          __dirname,
          "../storage/products_api/images/",
          path.basename(product.thumbnail)
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      product.thumbnail = `http://localhost:5800/storage/products_api/images/${req.file.filename}`;
    } else {
      // Si no hay un nuevo archivo, mantiene la URL anterior
      product.thumbnail = thumbnail;
    }

    product = await Product.findByIdAndUpdate(req.params.id, product, {
      new: true,
    });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al actualizar el producto" });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    // Eliminar la imagen del servidor si existe
    if (product.thumbnail) {
      // Construir la ruta de la imagen
      const imagePath = path.join(
        __dirname,
        "../storage/products_api/images/",
        path.basename(product.thumbnail)
      );

      // Comprobar si el archivo existe y eliminarlo
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Eliminar el producto de la base de datos
    await Product.findByIdAndRemove(req.params.id);
    res.json({ msg: "Producto eliminado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al eliminar el producto" });
  }
};

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../storage/products_api/images/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const uploadImage = async (req, res) => {
  if (req.file) {
    const imageUrl = `http://localhost:5800/storage/products_api/images/${req.file.filename}`;
    res.json({ imageUrl });
  } else {
    res.status(400).json({ msg: "Error al subir la imagen" });
  }
};

export {
  createProduct,
  listProducts,
  listProductsByCategory,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  upload,
};
