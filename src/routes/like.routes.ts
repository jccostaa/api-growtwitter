import express from "express";
import { LikeController } from "../controllers/like.controller";
import { validateToken } from "../middlewares/auth.middleware";


const router = express.Router();

const likeController = new LikeController()

router.get('/usuarios/:idUsuario/likes', validateToken, likeController.index)

router.post('/usuarios/:idUsuario/tweets/:idTweet/likes', validateToken, likeController.store)

router.delete('/usuarios/:idUsuario/likes/:id', validateToken, likeController.delete)

export default router