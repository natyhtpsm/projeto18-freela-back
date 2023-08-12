import express from 'express';
import { signUp, signIn } from '../controllers/autenticacao.controller';

const authRouter = express.Router();

authRouter.post('/cadastro', signUp);
authRouter.post('/', signIn);

export default authRouter;
