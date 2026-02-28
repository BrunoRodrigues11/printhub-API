const db = require('../config/db.js');

class UserService {
    async create(data) {
        const { name, email, password } = data;
        const query = `
            INSERT INTO users (name, email, password) 
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const values = [name, email, password];
        const result = await db.query(query, values);
        return result.rows[0];
    }
    
    async findAll() {
        const result = await db.query('SELECT * FROM users');
        return result.rows;
    }

    async findById(id) {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    async update(id, data) {
        const { name, email } = data;
        const query = `
            UPDATE users SET name = $1, email = $2 
            WHERE id = $3 RETURNING *;
        `;
        const values = [name, email, id];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async delete(id) {
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = new UserService();