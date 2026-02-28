const db = require('../config/db.js'); 

class PrinterService {
    async create(data) {
        const {
            name, type, model, manufacturer, serial_number, 
            asset_id, site_id, location, ip_address, 
            queue_name, toner_code, status
        } = data;

        // Regra de Negócio: Verificar se o serial_number já está cadastrado
        const existingPrinter = await db.query(
            'SELECT id FROM printers WHERE serial_number = $1 OR asset_id = $2', 
            [serial_number, asset_id]
        );

        if (existingPrinter.rows.length > 0) {
            throw new Error('Número de série ou ID de patrimônio (asset_id) já cadastrados.');
        }

        // Regra de Negócio: Se o tipo não for 'Papel', não deve ter toner_code
        const finalTonerCode = type === 'Térmica' ? null : toner_code;

        // Inserção no banco
        const query = `
            INSERT INTO printers (
                name, type, model, manufacturer, serial_number, 
                asset_id, site_id, location, ip_address, 
                queue_name, toner_code, status
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
            ) RETURNING *;
        `;
        const values = [
            name, type, model, manufacturer, serial_number, 
            asset_id, site_id, location, ip_address, 
            queue_name, finalTonerCode, status || 'Offline'
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    async findAll(filters) {
        let query = 'SELECT * FROM printers WHERE 1=1';
        let values = [];
        let count = 1;

        // Aplicação de filtros dinâmicos
        if (filters.status) {
            query += ` AND status = $${count}`;
            values.push(filters.status);
            count++;
        }
        
        if (filters.site_id) {
            query += ` AND site_id = $${count}`;
            values.push(filters.site_id);
            count++;
        }

        const result = await db.query(query, values);
        return result.rows;
    }

    async findById(id) {
        const result = await db.query('SELECT * FROM printers WHERE id = $1', [id]);
        return result.rows[0];
    }

    async update(id, data) {
        const {
            name, type, model, manufacturer, serial_number, 
            asset_id, site_id, location, ip_address, 
            queue_name, toner_code, status
        } = data;
        
        // Regra de Negócio: Verificar se o serial_number já está cadastrado para outro ID
        const existingPrinter = await db.query(
            'SELECT id FROM printers WHERE (serial_number = $1 OR asset_id = $2) AND id != $3', 
            [serial_number, asset_id, id]
        );
        if (existingPrinter.rows.length > 0) {
            throw new Error('Número de série ou ID de patrimônio (asset_id) já cadastrados para outra impressora.');
        }
        
        // Atualização no banco
        const query = `
            UPDATE printers SET 
                name = $1, type = $2, model = $3, manufacturer = $4, serial_number = $5,
                asset_id = $6, site_id = $7, location = $8, ip_address = $9,
                queue_name = $10, toner_code = $11, status = $12
            WHERE id = $13 RETURNING *;
        `;
        const values = [
            name, type, model, manufacturer, serial_number,
            asset_id, site_id, location, ip_address,
            queue_name, toner_code || null, status || 'Offline', id
        ];

        const result = await db.query(query, values);
        return result.rows[0];
    }

    async delete(id) {
        const result = await db.query('DELETE FROM printers WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    }
}

module.exports = new PrinterService();