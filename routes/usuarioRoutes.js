import express from "express";

const router = express.Router();

import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
} from "../controller/usuarioController.js";

router.post("/", registrar);

router.post("/login", autenticar);

router.get("/confirmar/:token", confirmar);

router.post("/olvide-password", olvidePassword);

router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

export default router;
