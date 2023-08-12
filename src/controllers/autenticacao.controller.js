import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { Pool } from "pg";

const pool = new Pool({
  user: 'seu_usuario',
  host: 'localhost',
  database: 'sua_base_de_dados',
  password: 'sua_senha',
  port: 5432, 
});

async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function signUp(req, res) {
  let { email, name, password, telefone } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(409).send('Email já cadastrado!');

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, password, name, telefone) VALUES ($1, $2, $3, $4)';
    const values = [email, hashedPassword, name, telefone];
    await pool.query(query, values);
  } catch (error) {
    return res.status(500).send(error.message);
  }

  res.sendStatus(201);
}

export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).send("E-mail não cadastrado!");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).send("Senha incorreta!");

    const token = uuid();
    const insertSessionQuery = 'INSERT INTO sessions (token, user_id) VALUES ($1, $2)';
    const insertSessionValues = [token, user.id];
    await pool.query(insertSessionQuery, insertSessionValues);

    res.send({ token, username: user.name });
  } catch (err) {
    res.status(500).send(err.message);
  }
}
