import { db } from "../database/database.js";

export async function tokenValidation(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).send('Token inválido.');

  try {
    const query = 'SELECT * FROM sessions WHERE token = $1';
    const values = [token];
    const result = await db.query(query, values);

    if (result.rows.length === 0) return res.status(401).send('Token inválido.');

    res.locals.session = result.rows[0];

    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
