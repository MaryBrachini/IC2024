const express = require('express');
const router = express.Router();

// Middleware de autenticação (se necessário)
function authenticationMiddleware(req, res, next) {
  console.log("[rte_Mapa|authenticaMiddle] Verificando sessão:", req.session);
  
  if (req.session && req.session.isLogged && req.session.token) {
    return next();
  } else {
    req.session.redirectTo = req.originalUrl; // Salva a URL original para redirecionar após login
    return res.redirect("/Login");
  }
}

// Rota para carregar a view de mapa
router.get('/mapa', authenticationMiddleware, (req, res) => {
    // Define o modelo de dados a ser passado para a view
    const model = {
        title: 'Mapa de Ocorrências'
    };

    // Renderiza a view 'view_mapa.vash' passando o modelo
    res.render('view_mapa', model); 
});

module.exports = router;
