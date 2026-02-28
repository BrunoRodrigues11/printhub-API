const userService = require('../services/userService.js');

class UserController {
    async createUser(req, res) {
        try {
            const userData = req.body;
            const newUser = await userService.create(userData); 
            return res.status(201).json({
                message: 'Usuário cadastrado com sucesso',
                data: newUser
            });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await userService.findAll();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar usuários.' });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar usuário por ID.' });
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedUser = await userService.update(id, updateData);
            if (!updatedUser) {
                return res.status(404).json({ error: 'Usuário não encontrado para atualização.' });
            }
            return res.status(200).json(updatedUser);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const deletedUser = await userService.delete(id);
            if (!deletedUser) {
                return res.status(404).json({ error: 'Usuário não encontrado para exclusão.' });
            }
            return res.status(200).json({ message: 'Usuário excluído com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao excluir usuário.' });
        }
    }
}

module.exports = new UserController();