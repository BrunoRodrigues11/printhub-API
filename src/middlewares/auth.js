const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Pega o token do cabeçalho de autorização
    const authHeader = req.headers.authorization;

    // 2. Verifica se o cabeçalho existe
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido. Acesso negado.' });
    }

    // 3. O padrão do token é "Bearer <hash_do_token>". Vamos separar isso.
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Erro no formato do token.' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: 'Token mal formatado.' });
    }

    // 4. Verifica se o token é válido usando a sua chave secreta
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido ou expirado.' });
        }

        // 5. Se deu tudo certo, injetamos os dados do usuário na requisição (req)
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.userSite = decoded.site_id;

        // 6. Chama o next() para a requisição seguir o fluxo até o Controller
        return next();
    });
};