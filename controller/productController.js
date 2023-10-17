import Product from '../models/Products.js';

// Crear un nuevo producto
const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.json(savedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al crear el producto" });
    }
}

// Listar todos los productos
const listProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('categoryIds');
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al listar los productos" });
    }
}

// Listar productos por categoría
const listProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await Product.find({ categoryIds: categoryId }).populate('categoryIds');
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al listar los productos por categoría" });
    }
}

// Ver un producto específico por ID
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('categoryIds');
        if (!product) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al obtener el producto" });
    }
}

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

        product = await Product.findByIdAndUpdate(req.params.id, product, { new: true });
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al actualizar el producto" });
    }
}


// Eliminar un producto
const deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: "Producto no encontrado" });
        }

        await Product.findByIdAndRemove(req.params.id);
        res.json({ msg: "Producto eliminado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al eliminar el producto" });
    }
}

export { createProduct, listProducts, listProductsByCategory, getProduct, updateProduct, deleteProduct };