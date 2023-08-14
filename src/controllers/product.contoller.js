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
      const query = `
        SELECT p.*, u.name as seller_name, u.phone as seller_phone, u.email as seller_email
        FROM products p
        JOIN users u ON p.id_seller = u.id
        WHERE p.id = $1
      `;
      const values = [id];
      const result = await db.query(query, values);
  
      if (result.rows.length === 0) return res.status(404).send('Produto não encontrado.');
  
      const productData = {
        id: result.rows[0].id,
        id_seller: result.rows[0].id_seller,
        name: result.rows[0].name,
        description: result.rows[0].description,
        photo: result.rows[0].photo,
        category: result.rows[0].category,
        status: result.rows[0].status,
        phone_seller: result.rows[0].phone_seller,
        price: result.rows[0].price
      };
  
      const sellerData = {
        id: result.rows[0].id_seller,
        name: result.rows[0].seller_name,
        phone: result.rows[0].seller_phone,
        email: result.rows[0].seller_email
      };
  
      res.send({ product: productData, seller: sellerData });
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
    const query = 'SELECT * FROM products WHERE id_seller = $1';
    const values = [userId];
    const result = await db.query(query, values);

    res.send(result.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function updateProductStatus(req, res) {
    const { productId } = req.params; 
    const { newStatus } = req.body;

    try {
      const query = 'UPDATE products SET status = $1 WHERE id = $2 AND id_seller = $3';
      const values = [newStatus, productId, res.locals.user_id];
      const result = await db.query(query, values);

      if (result.rowCount === 0) {
        return res.status(404).send('Produto não encontrado ou não pertence ao usuário.');
      }

      res.send('Status do produto atualizado com sucesso.');
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






