import express from "express";
import { SeguidorController } from "../controllers/seguidor.controller";

import { validateToken } from "../middlewares/auth.middleware";



const router = express.Router();

const seguidorController = new SeguidorController()

router.get('/usuarios/:idUsuario/seguidores',validateToken, seguidorController.index)

router.post('/usuarios/:idUsuario/seguidores',validateToken, seguidorController.store)

router.delete('/usuarios/:idUsuario/seguidores/:idSeguidor', validateToken, seguidorController.delete);


export default router