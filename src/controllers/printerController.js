const PrinterService = require('../services/printerService.js');

class PrinterController {
    async createPrinter(req, res) {
        try {
            // O req.body trará type, model, serial_number, site_id, etc.
            const printerData = req.body; 
            const newPrinter = await PrinterService.create(printerData);
            
            return res.status(201).json({
                message: 'Impressora cadastrada com sucesso',
                data: newPrinter
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getAllPrinters(req, res) {
        try {
            // Pode receber filtros da query string (ex: ?status=Online)
            const filters = req.query;
            const printers = await PrinterService.findAll(filters);
            
            return res.status(200).json(printers);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar impressoras.' });
        }
    }
    
    async getPrinterById(req, res) {
        // Implementação para buscar impressora por ID
        try {
            const { id } = req.params;
            const printer = await PrinterService.findById(id);
            
            if (!printer) {
                return res.status(404).json({ error: 'Impressora não encontrada.' });
            }
            
            return res.status(200).json(printer);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar impressora por ID.' });
        }
    }

    async updatePrinter(req, res) {
        // Implementação para atualizar impressora por ID
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedPrinter = await PrinterService.update(id, updateData);
            
            if (!updatedPrinter) {
                return res.status(404).json({ error: 'Impressora não encontrada para atualização.' });
            }

            return res.status(200).json(updatedPrinter);
        } catch (error) {
            // Retorna 400 para mostrar o erro de validação (ex: Serial duplicado) gerado no Service
            return res.status(400).json({ error: error.message });
        }
    }

    async deletePrinter(req, res) {
        // Implementação para deletar impressora por ID
        try {
            const { id } = req.params;
            const deleted = await PrinterService.delete(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Impressora não encontrada para exclusão.' });
            }
            return res.status(200).json({ message: 'Impressora deletada com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar impressora.' });
        }
    }
}

module.exports = new PrinterController();