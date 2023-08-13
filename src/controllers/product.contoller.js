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
    const id_seller = res.locals.user_id;
    console.log('A4: ', id_seller);

    const { name, description, photo, category, status, price } = req.body;
    const query = 'INSERT INTO products (id_seller, name, description, photo, category, status, price) VALUES ($1, $2, $3, $4, $5, $6, $7)';

    try {
        const values = [id_seller, name, description, photo, category, status, price];
        await db.query(query, values);
        res.send('Produto adicionado ao banco de dados.');
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function getUserInfo(req, res) {
    try {
      const userId = res.locals.user_id; 
      if (!userId) return res.status(400).send('ID do usuário não encontrado em res.locals.');
  
      const query = 'SELECT name, phone, email FROM users WHERE id = $1';
      const values = [userId];
      const result = await db.query(query, values);
  
      if (result.rows.length === 0) return res.status(404).send('Usuário não encontrado.');
  
      res.send(result.rows[0]);
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
  






