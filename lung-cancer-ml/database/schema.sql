
-- 1. Desenvolvedores do Sistema (Admins)
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    foto_perfil VARCHAR(255),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Inquilinos (Hospitais / Contas Pagantes)
CREATE TABLE hospitais (
    id SERIAL PRIMARY KEY,
    nome_fantasia VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL, 
    email_recuperacao VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    foto_perfil VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Operadores Clínicos (Médicos)
CREATE TABLE medicos (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    crm VARCHAR(20) UNIQUE NOT NULL,
    email_recuperacao VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    foto_perfil VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. A Ponte N:M (Vínculos / Contratos)
CREATE TABLE vinculos_hospital_medico (
    id SERIAL PRIMARY KEY,
    hospital_id INT NOT NULL REFERENCES hospitais(id),
    medico_id INT NOT NULL REFERENCES medicos(id),
    status VARCHAR(20) DEFAULT 'Pendente', 
    data_vinculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (hospital_id, medico_id) 
);

-- 5. Pacientes (pertencentes ao hospital, em hospitais diferentes é um novo perfil)
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY, 
    hospital_id INT NOT NULL REFERENCES hospitais(id),
    nome_completo VARCHAR(150) NOT NULL,
    data_nascimento DATE NOT NULL, 
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. As predições que serão adicionadas no perfil do paciente
CREATE TABLE predicao (
    id SERIAL PRIMARY KEY,
    paciente_id INT NOT NULL REFERENCES pacientes(id),
    medico_id INT NOT NULL REFERENCES medicos(id),
    hospital_id INT NOT NULL REFERENCES hospitais(id), 
    
    dados_clinicos JSONB NOT NULL, 
    probabilidade_risco DECIMAL(5,2) NOT NULL,
    diagnostico_final VARCHAR(50) NOT NULL,
    observacao VARCHAR(300),
    
    data_predicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recuperacao_senha (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    codigo VARCHAR(5) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_expiracao TIMESTAMP NOT NULL,
    utilizado BOOLEAN DEFAULT FALSE
);

ALTER TABLE medicos RENAME COLUMN email_recuperacao TO email;

ALTER TABLE hospitais RENAME COLUMN email_recuperacao TO email;