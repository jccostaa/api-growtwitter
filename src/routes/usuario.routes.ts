import express from "express";
import { UsuarioController } from "../controllers/usuario.controller";


const router = express.Router();

const usuarioController = new UsuarioController()

router.get('/usuarios', usuarioController.index)

router.post('/usuarios', usuarioController.store)

router.get('/usuarios/:id', usuarioController.show)

router.put('/usuarios/:id', usuarioController.update)

router.delete('/usuarios/:id', usuarioController.delete)


export default router