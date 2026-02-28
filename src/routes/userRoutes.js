const exporess = require('express');
const router = exporess.Router();
const UserController = require('../controllers/userController.js');

// Definindo os endpoints CRUD básicos
router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;