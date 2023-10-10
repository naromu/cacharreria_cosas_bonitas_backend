import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';

// Crear una orden a partir de un carrito
const createOrderFromCart = async (req, res) => {
    const { email } = req.body;

    try {
        const cart = await Cart.findOne({ email }).populate('items');
        if (!cart) {
            return res.status(404).json({ msg: "Carrito no encontrado" });
        }

        const newOrder = new Order({
            userID: cart.userID,
            totalAmount: cart.items.reduce((sum, item) => sum + item.quantity * item.productID.price, 0), 
            products: cart.items.map(item => item._id)
        });

        await newOrder.save();

        // Opcional: vaciar el carrito después de crear la orden
        await CartItem.deleteMany({ cartID: cart._id });
        cart.items = [];
        await cart.save();

        res.json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al crear la orden" });
    }
}

// Listar todas las órdenes de un usuario
const listOrders = async (req, res) => {
    const { email } = req.body;

    try {
        const orders = await Order.find({ email }).populate('products');
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al listar las órdenes" });
    }
}

// Ver los detalles de una orden específica
const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('products');
        if (!order) {
            return res.status(404).json({ msg: "Orden no encontrada" });
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al obtener la orden" });
    }
}

// Cancelar una orden
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: "Orden no encontrada" });
        }

        await order.remove();
        res.json({ msg: "Orden cancelada con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error al cancelar la orden" });
    }
}

export { createOrderFromCart, listOrders, getOrder, cancelOrder };
