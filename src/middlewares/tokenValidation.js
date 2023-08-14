import { findUserByToken } from "../repository/tokenValidation.js";

export async function tokenValidation(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send('Token inválido.');
  }

  try {
    const user = await findUserByToken(token);

    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }

    res.locals = user;
    console.log('A4: ', res.locals);
    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
