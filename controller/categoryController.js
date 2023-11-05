import Category from "../models/Categories.js";
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
    id = "MCO" + Math.floor(1000 + Math.random() * 9000);
    const category = await Category.findById(id);
    if (!category) {
      unique = true;
    }
  }

  return id;
};

// Crear una nueva categoría
const createCategory = async (req, res) => {
  try {
    const uniqueId = await generateUniqueId();
    const category = new Category({ _id: uniqueId, ...req.body });
    const savedCategory = await category.save();
    res.json(savedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al crear la categoría" });
  }
};

// Listar todas las categorías
const listCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al listar las categorías" });
  }
};

// Ver una categoría específica por ID
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al obtener la categoría" });
  }
};

// Editar una categoría
const updateCategory = async (req, res) => {
  try {
    const { name, picture } = req.body;
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    category.name = name;
    if (req.file) {
      // Si hay una nueva imagen
      if (category.picture) {
        // Si la categoría ya tiene una imagen, elimínala
        const oldImagePath = path.join(
          __dirname,
          "../storage/categories_api/images/",
          path.basename(category.picture)
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      category.picture = `http://localhost:5800/storage/categories_api/images/${req.file.filename}`;
    } else {
      // Si no hay un nuevo archivo, mantiene la URL anterior
      category.picture = picture;
    }

    category = await Category.findByIdAndUpdate(req.params.id, category, {
      new: true,
    });
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al actualizar la categoría" });
  }
};

// Eliminar una categoría
const deleteCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: "Categoría no encontrada" });
    }

    if (category.picture) {
      const imagePath = path.join(
        __dirname,
        "../storage/categories_api/images/",
        path.basename(category.picture)
      );
      fs.unlinkSync(imagePath);
    }

    await Category.findByIdAndRemove(req.params.id);
    res.json({ msg: "Categoría eliminada con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al eliminar la categoría" });
  }
};

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../storage/categories_api/images/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Añadir la subida de imágenes al controlador
const uploadImage = async (req, res) => {
  if (req.file) {
    const imageUrl = `http://localhost:5800/storage/categories_api/images/${req.file.filename}`;
    res.json({ imageUrl });
  } else {
    res.status(400).json({ msg: "Error al subir la imagen" });
  }
};

export {
  createCategory,
  listCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
  upload,
};
