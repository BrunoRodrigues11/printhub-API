const express = require('express');
const router = express.Router();
const PrinterController = require('../controllers/printerController.js');

// Definindo os endpoints CRUD básicos
router.post('/', PrinterController.createPrinter);
router.get('/', PrinterController.getAllPrinters);
router.get('/:id', PrinterController.getPrinterById);
router.put('/:id', PrinterController.updatePrinter);
router.delete('/:id', PrinterController.deletePrinter);

module.exports = router;