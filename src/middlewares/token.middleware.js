import { db } from "../database/database.js";

export async function tokenValidation(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  console.log('A1: ', token);
  if (!token) return res.status(401).send('Token inválido.');

  try {
    const query = `
      SELECT users.*, sessions.token, sessions.expiration, sessions.token_type
      FROM users
      JOIN sessions ON users.id = sessions.user_id
      WHERE sessions.token = $1
    `;
    const values = [token];
    console.log('A2: ', token);

    const result = await db.query(query, values);
    console.log('A3: ', result);

    if (result.rows.length === 0) return res.status(401).send('Token inválido.');

    res.locals.session = result.rows[0];

    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
