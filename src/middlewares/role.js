// Esse middleware é uma função que retorna outra função 
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        // Verifica se o authMiddleware passou o cargo do usuário
        if (!req.userRole) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        // Verifica se o cargo do usuário está na lista de cargos permitidos para esta rota
        if (!allowedRoles.includes(req.userRole)) {
            // Retornamos 403 (Forbidden). Significa: "Eu sei quem você é, mas você não tem permissão para isso."
            return res.status(403).json({ error: 'Acesso negado. Nível de permissão insuficiente.' });
        }

        // Se o usuário tem o cargo correto, a requisição segue em frente
        return next();
    };
};

module.exports = checkRole;