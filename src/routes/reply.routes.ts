import express from "express"
import { ReplyController } from "../controllers/reply.controller";
import { validateToken } from "../middlewares/auth.middleware";

const router = express.Router()
const replyController = new ReplyController()

router.get('/usuarios/:idUsuario/replies', validateToken, replyController.index)

router.post('/usuarios/:idUsuario/tweets/:idTweet/replies', validateToken, replyController.store)

router.put('/usuarios/:idUsuario/tweets/:idTweet/replies/:id', validateToken, replyController.update)

router.delete('/usuarios/:idUsuario/tweets/:idTweet/replies/:id', validateToken, replyController.delete)

export default router