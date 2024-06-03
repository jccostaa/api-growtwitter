import express from "express";
import cors from 'cors';

import authRoutes from "./routes/auth.routes";
import usuarioRoutes from "./routes/usuario.routes";
import tweetRoutes from "./routes/tweet.routes";
import likeRoutes from "./routes/like.routes";
import replyRoutes from "./routes/reply.routes";
import seguidorRoutes from "./routes/seguidor.routes";



export function createApp(){
    const app = express();

    app.use(express.json());
    app.use(cors());
    
    app.use(authRoutes)
    app.use(usuarioRoutes)
    app.use(tweetRoutes)
    app.use(likeRoutes)
    app.use(replyRoutes)
    app.use(seguidorRoutes)

    return app
}