const express = require('express');
const router = express.Router();
const SiteController = require('../controllers/siteController.js');

// Definindo os endpoints CRUD básicos
router.post('/', SiteController.createSite);
router.get('/', SiteController.getAllSites);
router.get('/:id', SiteController.getSiteById);
router.put('/:id', SiteController.updateSite);
router.delete('/:id', SiteController.deleteSite);

module.exports = router;