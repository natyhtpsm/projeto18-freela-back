import express from 'express';
import { postProduct, getProduct, getProducts } from '../controllers/product.contoller.js';
import { schemaValidation } from '../middlewares/schemaValidation.js';
import { postProductSchema } from '../schemas/product.schema.js';
import { tokenValidation } from '../middlewares/tokenValidation.js';
import { getUserInfoFromToken } from '../controllers/autenticacao.controller.js';

const productRouter = express.Router();

productRouter.post('/produto', tokenValidation, schemaValidation(postProductSchema), postProduct);
productRouter.get('/produto/:id', getProduct);
productRouter.get('/home', getProducts);
productRouter.get('/user-info', getUserInfoFromToken, (req, res) => {
    const userInfo = res.locals.user;
    return res.send(userInfo);
  });

export default productRouter;
