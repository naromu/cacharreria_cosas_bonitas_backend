import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import ProductOrder from "../models/ProductOrder.js";

// Crear una orden a partir de un carrito
const createOrderFromCart = async (req, res) => {
  const {
    userID,
    products,
    totalAmount,
    address,
    postalCode,
    phone,
    email,
    creditCardNumber,
  } = req.body;

  try {
    let cart;
    if (userID) {
      cart = await Cart.findOne({ userID: userID }).populate("items");
      if (!cart) {
        return res.status(404).json({ msg: "Carrito no encontrado" });
      }
    }

    const productOrders = await Promise.all(
      products.map(async (product) => {
        const productOrder = new ProductOrder({
          _id: product._id,
          quantity: product.quantity,
        });
        await productOrder.save();
        return productOrder._id; // Devuelve solo el ID para asociarlo con la orden
      })
    );

    // Crear la orden ya sea con un carrito o con la información proporcionada por un usuario no registrado
    const newOrderData = {
      userID: userID,
      totalAmount: totalAmount,
      products: productOrders,
      address: address,
      postalCode: postalCode,
      phone: phone,
      email: email,
      creditCardNumber: creditCardNumber,
    };

    // Si no hay userID, remover la propiedad para evitar conflicto con el esquema de Mongoose
    if (!userID) {
      delete newOrderData.userID;
    }

    const newOrder = new Order(newOrderData);
    await newOrder.save();

    // Si hay un carrito, proceder a vaciarlo
    if (cart) {
      await CartItem.deleteMany({ cartID: cart._id });
      cart.items = [];
      await cart.save();
    }

    res.json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al crear la orden" });
  }
};

// Listar todas las órdenes de un usuario
const listOrders = async (req, res) => {
  const { userID } = req.body;

  try {
    const orders = await Order.find({ userID }).populate("products");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al listar las órdenes" });
  }
};

// Ver los detalles de una orden específica
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("products");
    if (!order) {
      return res.status(404).json({ msg: "Orden no encontrada" });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al obtener la orden" });
  }
};

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
};

export { createOrderFromCart, listOrders, getOrder, cancelOrder };
