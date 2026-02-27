-- 1. Criação dos Tipos Enumerados (Enums)
CREATE TYPE printer_status AS ENUM ('Online', 'Offline', 'Manutenção');
CREATE TYPE printer_type AS ENUM ('Térmica', 'Papel');
CREATE TYPE user_role AS ENUM ('Admin', 'Analista', 'User');

-- 2. Tabela de Localidades / Unidades (Sites)
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Armazenar hash (ex: bcrypt)
    role user_role NOT NULL DEFAULT 'User',
    site_id UUID REFERENCES sites(id) ON DELETE SET NULL, -- Unidade vinculada
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Impressoras (Equipamentos)
CREATE TABLE printers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type printer_type NOT NULL,
    model VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    asset_id VARCHAR(50) UNIQUE NOT NULL, -- RI / Patrimônio
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    location VARCHAR(255) NOT NULL, -- Ex: "Expedição", "Recepção"
    ip_address VARCHAR(45), -- Suporta IPv4 e IPv6
    queue_name VARCHAR(100),
    toner_code VARCHAR(50), -- Específico para tipo 'Papel'
    status printer_status NOT NULL DEFAULT 'Offline',
    notes TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Índices para Otimização de Busca
CREATE INDEX idx_printers_site ON printers(site_id);
CREATE INDEX idx_printers_status ON printers(status);
CREATE INDEX idx_users_email ON users(email);

-- 6. Trigger para atualizar o campo 'last_updated' automaticamente
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_printer_modtime
    BEFORE UPDATE ON printers
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated_column();

-- Comentários das Tabelas
COMMENT ON TABLE sites IS 'Unidades físicas da empresa (Fábricas, CDs, Escritórios)';
COMMENT ON TABLE users IS 'Usuários do sistema com controle de acesso por papel (Role)';
COMMENT ON TABLE printers IS 'Cadastro técnico e status em tempo real das impressoras';