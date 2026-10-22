-- Ative foreign_keys em CADA conexão, antes de iniciar transações.
PRAGMA foreign_keys = ON;

BEGIN IMMEDIATE;

CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY,
    nome_completo TEXT NOT NULL CHECK (length(trim(nome_completo)) > 0),
    email TEXT NOT NULL COLLATE NOCASE UNIQUE
        CHECK (email = trim(email) AND length(email) > 0),
    senha_hash TEXT NOT NULL CHECK (length(trim(senha_hash)) > 0),
    criado_em TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE categorias (
    id INTEGER PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('renda', 'gasto')),
    nome TEXT NOT NULL COLLATE NOCASE CHECK (length(trim(nome)) > 0),
    criado_em TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    UNIQUE (usuario_id, tipo, nome),
    -- Chave candidata usada para validar dono e tipo do lançamento.
    UNIQUE (id, usuario_id, tipo),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

CREATE TABLE lancamentos (
    id INTEGER PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('renda', 'gasto')),
    valor_centavos INTEGER NOT NULL
        CHECK (typeof(valor_centavos) = 'integer' AND valor_centavos > 0),
    descricao TEXT NOT NULL CHECK (length(trim(descricao)) > 0),
    data TEXT NOT NULL CHECK (
        length(data) = 10
        AND data GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'
        AND coalesce(date(data, '+0 days') = data, 0)
    ),
    forma_pagamento TEXT,
    observacao TEXT,
    criado_em TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    CHECK (
        (tipo = 'renda' AND forma_pagamento IS NULL)
        OR (tipo = 'gasto' AND forma_pagamento IS NOT NULL
            AND forma_pagamento IN ('pix', 'debito', 'credito', 'dinheiro'))
    ),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
    FOREIGN KEY (categoria_id, usuario_id, tipo)
        REFERENCES categorias(id, usuario_id, tipo) ON DELETE RESTRICT
);

CREATE INDEX idx_lancamentos_usuario_data
    ON lancamentos(usuario_id, data DESC, id DESC);
CREATE INDEX idx_lancamentos_categoria_usuario_tipo
    ON lancamentos(categoria_id, usuario_id, tipo);

PRAGMA user_version = 1;
COMMIT;
