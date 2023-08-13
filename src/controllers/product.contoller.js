import { db } from "../database/database.js";

export async function getProducts(req, res) {
  try {
    const query = 'SELECT * FROM products';
    const result = await db.query(query);
    return res.send(result.rows);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

export async function getProduct(req, res) {
  const { id } = req.params;
  if (!id) return res.status(400).send("O id do produto é obrigatório!");

  try {
    const query = 'SELECT * FROM products WHERE id = $1';
    const values = [id];
    const result = await db.query(query, values);

    if (result.rows.length === 0) return res.status(404).send('Produto não encontrado.');

    res.send(result.rows[0]);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function postProduct(req, res) {
    res.locals.session = session;
    const id_seller = session.user_id; 

    const { name, description, photo, category, status, price, phone_seller } = req.body;
    const query = 'INSERT INTO products (id_seller, name, description, photo, category, status, price, phone_seller) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
  
    try {
      const values = [id_seller, name, description, photo, category, status, price, phone_seller];
      await db.query(query, values);
      res.send('Produto adicionado ao banco de dados.');
    } catch (error) {
      return res.status(500).send(error.message);
    }
}
  