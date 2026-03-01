const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');
const authMiddleware = require('../middlewares/auth.js');

// Rotas públicas (sem autenticação)
router.post('/login', UserController.loginUser);
router.post('/', UserController.createUser);

// Aplicando o middleware para todas as rotas abaixo desta linha
router.use(authMiddleware);

// Rotas protegidas (precisam do token no Header "Authorization: Bearer <token>")
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
module.exports = router;