import express from "express";
import cors from 'cors';
import authRoutes from "./routes/auth.routes";
import usuarioRoutes from "./routes/usuario.routes";
import tweetRoutes from "./routes/tweet.routes";
import likeRoutes from "./routes/like.routes";


const app = express();
app.use(express.json());
app.use(cors());

app.use(authRoutes)
app.use(usuarioRoutes)
app.use(tweetRoutes)
app.use(likeRoutes)

app.listen(3333, () => {
    console.log("Server running on port 3333.");
});