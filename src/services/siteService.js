const db = require('../config/db.js');

class SiteService {
    async create(data) {
        const { name, location } = data;
        const query = `
            INSERT INTO sites (name, location) 
            VALUES ($1, $2) RETURNING *;
        `;
        const values = [name, location];
        const result = await db.query(query, values);
        return result.rows[0];
    }
    
    async findAll() {
        const result = await db.query('SELECT * FROM sites');
        return result.rows;
    }

    async findById(id) {
        const result = await db.query('SELECT * FROM sites WHERE id = $1', [id]);
        return result.rows[0];
    }

    async update(id, data) {
        const { name, location } = data;
        const query = `
            UPDATE sites SET name = $1, location = $2 
            WHERE id = $3 RETURNING *;
        `;
        const values = [name, location, id];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async delete(id) {
        const result = await db.query('DELETE FROM sites WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = new SiteService();