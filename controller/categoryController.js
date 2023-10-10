import Category from '../models/Categories.js';

// Crear una nueva categoría
const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        const savedCategory = await category.save();
        res.json(savedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al crear la categoría" });
    }
}

// Listar todas las categorías
const listCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al listar las categorías" });
    }
}

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
}

// Editar una categoría
const updateCategory = async (req, res) => {
    try {
        const { name, picture } = req.body;
        let category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ msg: "Categoría no encontrada" });
        }

        category.name = name;
        category.picture = picture;

        category = await Category.findByIdAndUpdate(req.params.id, category, { new: true });
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al actualizar la categoría" });
    }
}

// Eliminar una categoría
const deleteCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ msg: "Categoría no encontrada" });
        }

        await Category.findByIdAndRemove(req.params.id);
        res.json({ msg: "Categoría eliminada con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al eliminar la categoría" });
    }
}

export { createCategory, listCategories, getCategory, updateCategory, deleteCategory };