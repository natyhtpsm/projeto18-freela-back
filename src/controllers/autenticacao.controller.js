import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { db } from "../database/database.js";
import * as userRepository from "../repository/user.repository.js";

export async function signUp(req, res) {
  let { email, name, password, phone } = req.body;

  try {
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) return res.status(409).send('Email já cadastrado!');

    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepository.createUser(email, hashedPassword, name, phone);
  } catch (error) {
    return res.status(500).send(error.message);
  }

  res.sendStatus(201);
}


export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userRepository.findUserByEmail(email);
    if (!user) return res.status(404).send("E-mail não cadastrado!");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).send("Senha incorreta!");

    const token = uuid();
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);

    await userRepository.createSession(token, user.id, expiration);

    res.send({ token, username: user.name });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function logout(req, res) {
  const userId = res.locals.user_id;
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!userId || !token) {
    return res.status(400).send('ID do usuário ou token inválido.');
  }

  try {
    await userRepository.logoutUser(userId, token);
    res.send('Logout bem-sucedido');
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  const result = await db.query(query, values);
  return result.rows[0];
}

export async function getUserInfoFromToken(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).send('Token inválido.');

  try {
    const query = `
      SELECT users.id, users.name, users.phone, users.email
      FROM users
      JOIN sessions ON users.id = sessions.user_id
      WHERE sessions.token = $1
    `;
    const values = [token];

    const result = await db.query(query, values);

    if (result.rows.length === 0) return res.status(401).send('Token inválido.');

    res.locals.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
}