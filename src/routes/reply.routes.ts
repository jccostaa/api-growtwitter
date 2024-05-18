import express from "express"
import { ReplyController } from "../controllers/reply.controller";
import { validateToken } from "../middlewares/auth.middleware";

const router = express.Router()
const replyController = new ReplyController()

router.get('/usuarios/:idUsuario/reply', validateToken, replyController.index)

router.post('/usuarios/:idUsuario/tweets/:idTweet/replies', validateToken, replyController.store)

export default router