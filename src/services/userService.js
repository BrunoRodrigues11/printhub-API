const db = require('../config/db.js');
const bcrypt = require('bcrypt'); // Importando o bcrypt

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
        const { name, email } = data;
        const query = `
            UPDATE users SET name = $1, email = $2 
            WHERE id = $3 
            RETURNING id, name, email, role, site_id;
        `;
        const values = [name, email, id];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async delete(id) {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING id, name, email;';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = new UserService();