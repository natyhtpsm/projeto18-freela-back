CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    cpf VARCHAR(14),
    telefone VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    senha VARCHAR(255)
);
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    id_do_vendedor INT REFERENCES usuarios(id),
    nome VARCHAR(255),
    descricao TEXT,
    foto VARCHAR(255),
    categoria VARCHAR(50),
    status VARCHAR(20),
    dados_de_contato VARCHAR(255)
);

CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES usuarios(id),
    token VARCHAR(255) NOT NULL,
    expiration TIMESTAMP NOT NULL,
    token_type VARCHAR(50)
);

