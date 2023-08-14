import express from "express";
import cors from "cors";
import authRouter from "./routers/autenticacao.routers.js";
import productRouter from "./routers/product.router.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(productRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`)
});

