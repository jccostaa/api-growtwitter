import express from "express";
import { TweetController } from "../controllers/tweets.controller";
import { validateToken } from "../middlewares/auth.middleware";


const router = express.Router();

const tweetController = new TweetController()


router.get('/usuarios/:idUsuario/tweets', validateToken, tweetController.index)

router.get('/usuarios/:idUsuario/alltweets', tweetController.indexAll)

router.post('/usuarios/:idUsuario/tweets', validateToken, tweetController.store)

router.put('/usuarios/:idUsuario/tweets/:id', validateToken, tweetController.update)

router.delete('/usuarios/:idUsuario/tweets/:id', validateToken, tweetController.delete)

export default router