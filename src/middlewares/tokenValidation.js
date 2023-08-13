import { db } from "../database/database.js";

export async function tokenValidation(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send('Token inválido.');
  }

  const tokenArray = [token];
  const outputArray = tokenArray.map(item => item.replace(/'/g, ''));

  try {
    const result = await db.query('SELECT users.*, sessions.* FROM users JOIN sessions ON users.id = sessions.user_id WHERE token = $1', outputArray);
    if (result.rowCount === 0) return res.status(404).send('Usuário não encontrado.');
    res.locals = result.rows[0];
    console.log('A4: ', res.locals);
    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}


