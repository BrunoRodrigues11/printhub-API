const SiteService = require('../services/siteService.js');

class SiteController {
    async createSite(req, res) {
        try {
            const siteData = req.body;
            const newSite = await SiteService.create(siteData);
            
            return res.status(201).json({
                message: 'Site cadastrado com sucesso',
                data: newSite
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getAllSites(req, res) {
        try {
            const sites = await SiteService.findAll();
            
            return res.status(200).json(sites);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar sites.' });
        }
    }

    async getSiteById(req, res) {
        try {
            const { id } = req.params;
            const site = await SiteService.findById(id);
            
            if (!site) {
                return res.status(404).json({ error: 'Site não encontrado.' });
            }
            
            return res.status(200).json(site);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar site por ID.' });
        }
    }

    async updateSite(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedSite = await SiteService.update(id, updateData);
            
            if (!updatedSite) {
                return res.status(404).json({ error: 'Site não encontrado para atualização.' });
            }

            return res.status(200).json(updatedSite);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar site.' });
        }
    }

    async deleteSite(req, res) {
        try {
            const { id } = req.params;
            const deleted = await SiteService.delete(id);
            
            if (!deleted) {
                return res.status(404).json({ error: 'Site não encontrado para exclusão.' });
            }
            
            return res.status(200).json({ message: 'Site deletado com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar site.' });
        }
    }
}

module.exports = new SiteController();