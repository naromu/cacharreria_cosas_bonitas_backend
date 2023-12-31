import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import enviarCorreo from "../helpers/emailService.js";

const registrar = async (req, res) => {
  //evitar registros duplicados
  const { email, baseUrl } = req.body;
  const existeUsuario = await Usuario.findOne({ email });

  if (existeUsuario) {
    const error = new Error(
      "Ya existe una cuenta con este correo electrónico."
    );
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    const usuarioAlmacenado = await usuario.save();

    // Envía el correo de confirmación
    await enviarCorreo(usuario.email, usuario.token, {
      asunto: "Confirma tu registro",
      mensaje:
        "Gracias por registrarte en Cosas Bonitas. Estamos emocionados de tenerte con nosotros. Por favor, confirma tu registro haciendo clic en el siguiente botón:",
      textoBoton: "Confirmar registro",
      ruta: `${baseUrl}/cacharreria_cosas_bonitas/confirmar/`,
      mensajePie: "Si no solicitaste este registro, ignora este mensaje.",
    });

    res.json(usuarioAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const actualizarPerfil = async (req, res) => {
  const { usuario } = req;
  const { address, postalCode, phone, creditCardNumber } = req.body;

  try {
    usuario.address = address || usuario.address;
    usuario.postalCode = postalCode || usuario.postalCode;
    usuario.phone = phone || usuario.phone;
    usuario.creditCardNumber = creditCardNumber || usuario.creditCardNumber;

    await usuario.save();

    res.json(usuario);
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ msg: "Error al actualizar el perfil" });
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  //comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error(
      "No hemos encontrado una cuenta con este correo electrónico."
    );
    return res.status(404).json({ msg: error.message });
  }

  //comprobar si el usuario está confirmado
  if (!usuario.confirmado) {
    const error = new Error(
      "Por favor, confirma tu cuenta a través del enlace que te enviamos por correo electrónico."
    );

    return res.status(403).json({ msg: error.message });
  }

  //comprobar el password
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.role,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("La contraseña que ingresaste es incorrecta.");
    return res.status(403).json({ msg: error.message });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error(
      "El enlace de confirmación no es válido o ha expirado."
    );
    return res.status(403).json({ msg: error.message });
  }
  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    res.status(200).json({
      msg: "¡Gracias por confirmar tu cuenta! Ahora puedes iniciar sesión.",
    });
  } catch (error) {
    console.error("Error al confirmar el usuario:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

const olvidePassword = async (req, res) => {
  const { email, baseUrl } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error(
      "No hemos encontrado una cuenta con este correo electrónico."
    );
    return res.status(404).json({ msg: error.message });
  }
  try {
    usuario.token = generarId();
    await usuario.save();
    await enviarCorreo(usuario.email, usuario.token, {
      asunto: "Recupera tu contraseña",
      mensaje:
        "Hemos recibido una solicitud para recuperar tu contraseña. Haz clic en el siguiente botón para establecer una nueva contraseña:",
      textoBoton: "Recuperar contraseña",
      ruta: `${baseUrl}/cacharreria_cosas_bonitas/recuperar/`,
      mensajePie:
        "Si no solicitaste la recuperación de contraseña, ignora este mensaje.",
    });
    res.json({
      msg: "Hemos enviado un email con las instrucciones para recuperar el password",
    });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Usuario.findOne({ token });
  if (tokenValido) {
    res.status(200).json({
      msg: "Enlace de confirmación válido. Por favor, establece tu nueva contraseña.",
    });
  } else {
    const error = new Error(
      "El enlace de recuperación no es válido o ha expirado."
    );
    return res.status(404).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });
  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    try {
      await usuario.save();
      res.json({ msg: "Password modificado correctamente" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Error al cambiar la contraseña." });
    }
  } else {
    const error = new Error(
      "El enlace de recuperación no es válido o ha expirado."
    );
    return res.status(404).json({ msg: error.message });
  }
};

const perfil = (req, res) => {
  const { usuario } = req;

  res.json(usuario);
};

export {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
  actualizarPerfil,
};
