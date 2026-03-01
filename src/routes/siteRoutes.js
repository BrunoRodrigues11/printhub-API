const express = require('express');
const router = express.Router();
const SiteController = require('../controllers/siteController.js');

// Importando nossos middlewares de segurança
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/role');

// 1. Exige autenticação (token JWT) para TODAS as rotas de Sites
router.use(authMiddleware);

// Rotas de Visualização (Livres para Admin, Analista e User logados)
router.get('/', SiteController.getAllSites);
router.get('/:id', SiteController.getSiteById);

// Rotas de Modificação (Restritas APENAS para Admin)
router.post('/', checkRole(['Admin']), SiteController.createSite);
router.put('/:id', checkRole(['Admin']), SiteController.updateSite);
router.delete('/:id', checkRole(['Admin']), SiteController.deleteSite);

module.exports = router;