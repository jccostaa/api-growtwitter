import express from "express";
import { UsuarioController } from "../controllers/usuario.controller";
import { validateToken } from "../middlewares/auth.middleware";

const router = express.Router();

const usuarioController = new UsuarioController()

router.get('/usuarios', validateToken, usuarioController.index)

router.post('/usuarios', usuarioController.store)

router.get('/usuarios/:id', validateToken, usuarioController.show)

router.put('/usuarios/:id', validateToken, usuarioController.update)

router.delete('/usuarios/:id', validateToken, usuarioController.delete)


export default router