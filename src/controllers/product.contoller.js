import { db } from "../database/database.js";
import * as productRepository from "../repository/product.repository.js";

export async function getProducts(req, res) {
  try {
    const products = await productRepository.getProducts();
    return res.send(products);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

export async function getProduct(req, res) {
  const { id } = req.params;
  if (!id) return res.status(400).send("O id do produto é obrigatório!");

  try {
    const productData = await productRepository.getProductData(id);
    if (!productData) return res.status(404).send('Produto não encontrado.');

    res.send(productData);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function getMyProducts(req, res) {
  const userId = res.locals.user_id; 
  if (!userId) {
    return res.status(400).send('ID do usuário não encontrado em res.locals.');
  }

  try {
    const products = await productRepository.getProductsBySeller(userId);
    res.send(products);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function updateProductStatus(req, res) {
  const { productId } = req.params; 
  const { newStatus } = req.body;

  try {
    const updatedRows = await productRepository.updateProductStatus(productId, newStatus, res.locals.user_id);

    if (updatedRows === 0) {
      return res.status(404).send('Produto não encontrado ou não pertence ao usuário.');
    }

    res.send('Status do produto atualizado com sucesso.');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
  
export async function postProduct(req, res) {
  const id_seller = res.locals.user_id;

  const { name, description, photo, category, status, price } = req.body;

  try {
    await productRepository.createProduct(id_seller, name, description, photo, category, status, price);
    res.send('Produto adicionado ao banco de dados.');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}






