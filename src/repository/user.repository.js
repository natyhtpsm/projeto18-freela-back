import { db } from "../database/database.js";

export async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  const result = await db.query(query, values);
  return result.rows[0];
}

export async function createUser(email, hashedPassword, name, phone) {
  const query = 'INSERT INTO users (email, password, name, phone) VALUES ($1, $2, $3, $4)';
  const values = [email, hashedPassword, name, phone];
  await db.query(query, values);
}

export async function createSession(token, userId, expiration) {
    const insertSessionQuery = 'INSERT INTO sessions (token, user_id, expiration) VALUES ($1, $2, $3)';
    const insertSessionValues = [token, userId, expiration];
    await db.query(insertSessionQuery, insertSessionValues);
}

export async function logoutUser(userId, token) {
    const deleteQuery = 'DELETE FROM sessions WHERE user_id = $1 AND token = $2';
    const deleteValues = [userId, token];
    await db.query(deleteQuery, deleteValues);
  }