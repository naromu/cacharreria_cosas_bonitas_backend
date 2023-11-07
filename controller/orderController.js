import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import ProductOrder from "../models/ProductOrder.js";
import mongoose from "mongoose";

// Crear una orden a partir de un carrito
const createOrderFromCart = async (req, res) => {
  const {
    userID,
    products,
    totalAmount,
    status,
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

    const newOrder = new Order({
      userID: userID,
      totalAmount: totalAmount,
      products: [],
      status: status,
      address: address,
      postalCode: postalCode,
      phone: phone,
      email: email,
      creditCardNumber: creditCardNumber,
    });
    await newOrder.save();

    // Ahora, crear cada ProductOrder y asociar el ID de la nueva orden
    const productOrders = await Promise.all(
      products.map(async (product) => {
        const productOrder = new ProductOrder({
          productId: product._id,
          quantity: product.quantity,
          orderID: newOrder._id, // Asignamos el ID de la nueva orden aquí
        });
        await productOrder.save();
        return productOrder._id; // Devuelve solo el ID para asociarlo con la orden
      })
    );

    // Ahora, actualizamos la orden con los ID de los ProductOrder creados
    newOrder.products = productOrders;
    await newOrder.save();

    // Si hay un carrito, vaciarlo
    if (cart) {
      await CartItem.deleteMany({ cartID: cart._id });
      cart.items = [];
      await cart.save();
    }

    res.json(newOrder);
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res
      .status(500)
      .json({ msg: "Hubo un error al crear la orden", error: error.message });
  }
};

// Listar todas las órdenes de un usuario
const listOrders = async (req, res) => {
  const userID = req.query.userID;
  const email = req.query.email;

  let query = {};

  if (userID) {
    // Si se ha proporcionado un userID, buscar por userID
    query.userID = userID;
  } else if (email) {
    // Si no hay userID pero sí un email, buscar por email
    query.email = email;
  }

  try {
    const orders = await Order.find(query).populate({
      path: "products",
      model: "ProductOrder",
      populate: {
        path: "productId",
        model: "Product",
      },
    });
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
