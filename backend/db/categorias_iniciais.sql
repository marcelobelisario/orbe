INSERT INTO categorias (usuario_id, tipo, nome) VALUES
    (:usuario_id, 'renda', 'Salário'),
    (:usuario_id, 'renda', 'Freelance'),
    (:usuario_id, 'renda', 'Investimento'),
    (:usuario_id, 'renda', 'Benefício'),
    (:usuario_id, 'renda', 'Outros'),
    (:usuario_id, 'gasto', 'Alimentação'),
    (:usuario_id, 'gasto', 'Moradia'),
    (:usuario_id, 'gasto', 'Transporte'),
    (:usuario_id, 'gasto', 'Saúde'),
    (:usuario_id, 'gasto', 'Educação'),
    (:usuario_id, 'gasto', 'Lazer'),
    (:usuario_id, 'gasto', 'Outros')
ON CONFLICT (usuario_id, tipo, nome) DO NOTHING;
