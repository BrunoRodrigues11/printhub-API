const db = require('../config/db.js');

class SiteService {
    async create(data) {
        const { name, description } = data; // Ajuste: location por description

        // Regra de Negócio: Evitar duplicidade de nomes de unidades
        const existingSite = await db.query('SELECT id FROM sites WHERE name = $1', [name]);
        if (existingSite.rows.length > 0) {
            throw new Error('Já existe uma localidade cadastrada com este nome.');
        }

        const query = `
            INSERT INTO sites (name, description) 
            VALUES ($1, $2) RETURNING *;
        `;
        const values = [name, description];
        const result = await db.query(query, values);
        return result.rows[0];
    }
    
    async findAll() {
        const result = await db.query('SELECT * FROM sites ORDER BY name ASC');
        return result.rows;
    }

    async findById(id) {
        const result = await db.query('SELECT * FROM sites WHERE id = $1', [id]);
        return result.rows[0];
    }

    async update(id, data) {
        const { name, description } = data; // Ajuste: location por description
        
        const query = `
            UPDATE sites SET name = $1, description = $2 
            WHERE id = $3 RETURNING *;
        `;
        const values = [name, description, id];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async delete(id) {
        const result = await db.query('DELETE FROM sites WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = new SiteService();