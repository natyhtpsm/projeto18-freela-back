import express from 'express';
import { postProduct, getProduct, getProducts } from '../controllers/product.contoller.js';
import { schemaValidation } from '../middlewares/schemaValidation.js';
import { postProductSchema } from '../schemas/product.schema.js';

const productRouter = express.Router();

productRouter.post('/produto', schemaValidation(postProductSchema), postProduct);
productRouter.get('/produto/:id', getProduct);
productRouter.get('/home', getProducts);

export default productRouter;
