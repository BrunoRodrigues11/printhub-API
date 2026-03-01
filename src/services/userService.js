const db = require('../config/db.js');
const bcrypt = require('bcrypt'); // Importando o bcrypt
const jwt = require('jsonwebtoken');

class UserService {
    async create(data) {
        // Refactor: Inclusão do role e site_id com valores padrão
        const { name, email, password, role = 'User', site_id = null } = data; 

        // 1. Add: Verificação se o e-mail já existe
        const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            throw new Error('Este e-mail já está em uso.');
        }

        // 2. Add: Criptografa a senha (o número 10 é o "salt rounds", padrão seguro e rápido)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Refactor: Insere no banco, mas NÃO retorna a senha no RETURNING
        const query = `
            INSERT INTO users (name, email, password, role, site_id) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, name, email, role, site_id, created_at;
        `;
        const values = [name, email, hashedPassword, role, site_id];
        
        const result = await db.query(query, values);
        return result.rows[0];
    }
    
    async findAll() {
        // Refactor: Evitando SELECT * para não expor as senhas de todo mundo
        const query = `
            SELECT id, name, email, role, site_id, last_login, created_at 
            FROM users 
            ORDER BY created_at DESC;
        `;
        const result = await db.query(query);
        return result.rows;
    }

    async findById(id) {
        const query = `
            SELECT id, name, email, role, site_id, last_login, created_at 
            FROM users WHERE id = $1;
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async update(id, data) {
        const { name, email, role, site_id } = data;
        const query = `
            UPDATE users SET name = $1, email = $2, role = $3, site_id = $4
            WHERE id = $5 
            RETURNING id, name, email, role, site_id;
        `;
        const values = [name, email, role, site_id, id];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async delete(id) {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING id, name, email;';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    async login(email, password) {
        // 1. Busca o usuário pelo e-mail (aqui precisamos trazer a coluna password do banco)
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        const user = result.rows[0];

        // 2. Se o usuário não existir, retornamos erro
        if (!user) {
            throw new Error('E-mail ou senha incorretos.');
        }

        // 3. Compara a senha enviada (texto) com a do banco (hash)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('E-mail ou senha incorretos.');
        }

        // 4. Gera o Token JWT contendo dados não sensíveis do usuário (o payload)
        // Usamos a chave secreta que está no seu .env
        const token = jwt.sign(
            { 
                id: user.id, 
                role: user.role, 
                site_id: user.site_id 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' } // Tempo de expiração do token
        );

        // 5. Retorna o token e os dados públicos do usuário
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    }
}

module.exports = new UserService();