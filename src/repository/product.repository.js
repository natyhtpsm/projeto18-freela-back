import { db } from "../database/database.js";

export async function getProducts() {
  const query = 'SELECT * FROM products';
  const result = await db.query(query);
  return result.rows;
}

export async function getProductData(id) {
    const query = `
      SELECT p.*, u.name as seller_name, u.phone as seller_phone, u.email as seller_email
      FROM products p
      JOIN users u ON p.id_seller = u.id
      WHERE p.id = $1
    `;
    const values = [id];
    const result = await db.query(query, values);
  
    if (result.rows.length === 0) return null;
  
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
  
    return { product: productData, seller: sellerData };
}

export async function getProductsBySeller(userId) {
  const query = 'SELECT * FROM products WHERE id_seller = $1';
  const values = [userId];
  const result = await db.query(query, values);
  return result.rows;
}

export async function updateProductStatus(productId, newStatus, userId) {
    const query = 'UPDATE products SET status = $1 WHERE id = $2 AND id_seller = $3';
    const values = [newStatus, productId, userId];
    const result = await db.query(query, values);
    return result.rowCount;
}

export async function createProduct(id_seller, name, description, photo, category, status, price) {
    const query = 'INSERT INTO products (id_seller, name, description, photo, category, status, price) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const values = [id_seller, name, description, photo, category, status, price];
    await db.query(query, values);
}