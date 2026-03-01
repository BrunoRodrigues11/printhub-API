const express = require('express');
const router = express.Router();
const PrinterController = require('../controllers/printerController.js');

// Importando nossos middlewares de segurança
const authMiddleware = require('../middlewares/auth');
const checkRole = require('../middlewares/role');

// 1. Obriga que TODAS as rotas abaixo exijam um token JWT válido
router.use(authMiddleware);

// Rotas de Visualização (Livres para Admin, Analista e User)
router.get('/', PrinterController.getAllPrinters);
router.get('/:id', PrinterController.getPrinterById);

// Rotas de Modificação (Restritas)
// Só Admin e Analista podem cadastrar e atualizar equipamentos
router.post('/', checkRole(['Admin', 'Analista']), PrinterController.createPrinter);
router.put('/:id', checkRole(['Admin', 'Analista']), PrinterController.updatePrinter);

// Só o Admin pode excluir uma impressora permanentemente do banco
router.delete('/:id', checkRole(['Admin']), PrinterController.deletePrinter);

module.exports = router;