import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";

// Obtener el carrito de un usuario
const getCart = async (req, res) => {
  const { email } = req.body;
  try {
    const cart = await Cart.findOne({ email }).populate({
      path: "items",
      model: "CartItem",
      populate: {
        path: "_id",
        model: "Product",
      },
    });
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al obtener el carrito" });
  }
};

const addItemToCart = async (req, res) => {
  const { email, userID, productID, quantity } = req.body;

  try {
    // Crear un nuevo carrito si no existe
    let cart = await Cart.findOne({ userID });
    if (!cart) {
      cart = new Cart({ userID, email: email, items: [] });
      await cart.save();
    }

    // Verificar si el ítem ya existe en el carrito
    let item = await CartItem.findOne({ _id: productID, cartID: cart._id });

    if (item) {
      // Si el ítem ya existe, actualizar la cantidad
      item.quantity += quantity;
      await item.save();
    } else {
      // Si el ítem no existe, crear uno nuevo
      item = new CartItem({
        _id: productID,
        quantity,
        cartID: cart._id,
      });
      await item.save();
      cart.items.push(item._id);
      await cart.save();
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Hubo un error al agregar el producto al carrito" });
  }
};

// Actualizar la cantidad de un producto en el carrito
const updateCartItem = async (req, res) => {
  const { quantity } = req.body;

  try {
    const item = await CartItem.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );
    res.json(item);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Hubo un error al actualizar el producto en el carrito" });
  }
};

// Eliminar un producto del carrito
const removeItemFromCart = async (req, res) => {
  const { email } = req.body;

  try {
    const item = await CartItem.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ msg: "Producto no encontrado en el carrito" });
    }

    const cart = await Cart.findOne({ email });
    cart.items.pull(item._id);
    await cart.save();
    await item.remove();

    res.json({ msg: "Producto eliminado del carrito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Hubo un error al eliminar el producto del carrito" });
  }
};

// Vaciar el carrito
const emptyCart = async (req, res) => {
  const { email } = req.body;
  try {
    const cart = await Cart.findOne({ email });
    await CartItem.deleteMany({ cartID: cart._id });
    cart.items = [];
    await cart.save();

    res.json({ msg: "Carrito vaciado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al vaciar el carrito" });
  }
};

export {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  emptyCart,
};
