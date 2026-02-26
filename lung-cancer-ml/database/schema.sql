
-- 1. Desenvolvedores do Sistema (Super Admins)
CREATE TABLE super_admins (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    foto_perfil VARCHAR(255), -- <--- Adicionado direto aqui
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Inquilinos (Hospitais / Contas Pagantes)
CREATE TABLE hospitais (
    id SERIAL PRIMARY KEY,
    nome_fantasia VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL, 
    email_recuperacao VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    foto_perfil VARCHAR(255), -- <--- Adicionado direto aqui
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
    foto_perfil VARCHAR(255), -- <--- Adicionado direto aqui
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

-- 5. Pacientes (Blindagem LGPD - Pertencem ao Hospital e sem CPF)
CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY, 
    hospital_id INT NOT NULL REFERENCES hospitais(id),
    nome_completo VARCHAR(150) NOT NULL,
    data_nascimento DATE NOT NULL, 
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. O Coração do Sistema (Predições da Inteligência Artificial)
CREATE TABLE predicao (
    id SERIAL PRIMARY KEY,
    paciente_id INT NOT NULL REFERENCES pacientes(id),
    medico_id INT NOT NULL REFERENCES medicos(id),
    hospital_id INT NOT NULL REFERENCES hospitais(id), 
    
    dados_clinicos JSONB NOT NULL, 
    probabilidade_risco DECIMAL(5,2) NOT NULL,
    diagnostico_final VARCHAR(50) NOT NULL,
    observacao VARCHAR(300), -- <--- Adicionado direto aqui
    
    data_predicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
    
    -- 1º: Apaga a predição (o filho de todos)
DELETE FROM predicao;

-- 2º: Apaga o paciente (filho do hospital)
DELETE FROM pacientes;

-- 3º e 4º: Apaga o médico e o hospital (os pais)
DELETE FROM medicos;
DELETE FROM hospitais;
);