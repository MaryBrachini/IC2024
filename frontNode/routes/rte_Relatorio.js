var express = require('express');
var relatorioApp = require("../app/Relatorio/controller/ctlRelatorio");

var router = express.Router();

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
    console.log("[rte_Relatorio|authenticaMiddle] Verificando sessão:", req.session); // Log da sessão completa
    if (req.session && req.session.isLogged && req.session.token) {
        console.log("Usuário autenticado. Continuando para a rota.");
        return next();
    } else {
        console.log("[rte_Relatorio|else] Usuário não autenticado. Redirecionando para a página de login.");
        req.session.redirectTo = req.originalUrl; // Salva a URL original para redirecionamento após login
        return res.redirect("/Login");
    }
};

/* GET métodos */
router.get('/', authenticationMiddleware, relatorioApp.getRelatorioOcorrencias);
router.get('/GetData',  relatorioApp.GetData); // Rota para visualizar o relatório

module.exports = router;
