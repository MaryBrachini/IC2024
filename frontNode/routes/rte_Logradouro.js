var express = require('express');
var LogradouroApp = require("../app/Logradouro/controller/ctlLogradouro");

var router = express.Router();

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
  console.log("[rte_Logradouro|authenticaMiddle] Verificando sessão:", req.session); // Log da sessão completa
  console.log("[rte_Logradouro|authenticaMiddle] req.session.isLogged",req.session.isLogged);
  console.log("[rte_Logradouro|authenticaMiddle] req.session.token)",req.session.token);

  if (req.session && req.session.isLogged && req.session.token) {
    console.log("Usuário autenticado. Continuando para a rota.");
    return next();
  } else {
    console.log("[rte_Logradouro|else] Usuário não autenticado. Redirecionando para a página de login.");
    req.session.redirectTo = req.originalUrl; // Salva a URL original para redirecionamento após login
    return res.redirect("/Login");
  }
};

/* GET métodos */
router.get('/', authenticationMiddleware, LogradouroApp.getAllLogradouro);
router.get('/insertLogradouro', authenticationMiddleware, LogradouroApp.insertLogradouro);
router.get('/viewLogradouro/:id/:oper', authenticationMiddleware, LogradouroApp.viewLogradouro);

/* POST métodos */
router.post('/insertLogradouro', authenticationMiddleware, LogradouroApp.insertLogradouro);
router.post('/DeleteLogradouro', authenticationMiddleware, LogradouroApp.DeleteLogradouro);
router.post('/viewLogradouro', authenticationMiddleware, LogradouroApp.viewLogradouro);

module.exports = router;
