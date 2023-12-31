import express from "express";

const router = express.Router();

import {
  registrar,
  autenticar,
  actualizarPerfil,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
} from "../controller/usuarioController.js";

import checkAuth from "../middleware/checkAuth.js";

router.post("/", registrar);

router.post("/login", autenticar);

router.put("/perfil", checkAuth, actualizarPerfil);

router.get("/confirmar/:token", confirmar);

router.post("/olvide-password", olvidePassword);

router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

router.get("/perfil", checkAuth, perfil);

export default router;
