import express from 'express';
import { signUp, signIn, getUserInfoFromToken } from '../controllers/autenticacao.controller.js';
import { schemaValidation } from '../middlewares/schemaValidation.js';
import { signInSchema, signUpSchema } from '../schemas/autenticacao.schema.js';


const authRouter = express.Router();

authRouter.post('/cadastro', schemaValidation(signUpSchema), signUp);
authRouter.post('/', schemaValidation(signInSchema), signIn);
authRouter.get('/usuario', getUserInfoFromToken);

export default authRouter;
