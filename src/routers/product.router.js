import express from 'express';
import { postProduct, getProduct, getProducts, getMyProducts } from '../controllers/product.contoller.js';
import { schemaValidation } from '../middlewares/schemaValidation.js';
import { postProductSchema } from '../schemas/product.schema.js';
import { tokenValidation } from '../middlewares/tokenValidation.js';

const productRouter = express.Router();

productRouter.post('/produto', tokenValidation, schemaValidation(postProductSchema), postProduct);
productRouter.get('/produto/:id', getProduct);
productRouter.get('/home', getProducts);
productRouter.get('/meus-produtos', tokenValidation, getMyProducts);
export default productRouter;
