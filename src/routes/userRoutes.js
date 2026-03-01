const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');

// Importando os middlewares
const authMiddleware = require('../middlewares/auth.js');
const checkRole = require('../middlewares/role.js');

// Rotas públicas (sem autenticação)
router.post('/login', UserController.loginUser);
router.post('/', UserController.createUser);

// Aplicando o middleware para todas as rotas abaixo desta linha
router.use(authMiddleware);

// Só Admin podem listar todo mundo
router.get('/', checkRole(['Admin']), UserController.getAllUsers);

// Qualquer um autenticado pode buscar um usuário por ID (poderíamos restringir para buscar só o próprio ID depois)
router.get('/:id', UserController.getUserById);

// Só o Admin pode atualizar dados de outros usuários
router.put('/:id', checkRole(['Admin']), UserController.updateUser);

// Só o Admin pode deletar usuários
router.delete('/:id', checkRole(['Admin']), UserController.deleteUser);

module.exports = router;