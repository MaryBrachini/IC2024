var express = require('express');
var cidadeApp = require("../app/Cidade/controller/ctlCidade");

var router = express.Router();

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
  /* console.log("[rte_Cidade|authenticaMiddle] Verificando sessão:", req.session); // Log da sessão completa
  console.log("[rte_Cidade|authenticaMiddle] req.session.isLogged",req.session.isLogged);
  console.log("[rte_Cidade|authenticaMiddle] req.session.token)",req.session.token); */

  if (req.session && req.session.isLogged && req.session.token) {
    console.log("Usuário autenticado. Continuando para a rota.");
    return next();
  } else {
    console.log("[rte_Cidade|else] Usuário não autenticado. Redirecionando para a página de login.");
    req.session.redirectTo = req.originalUrl; // Salva a URL original para redirecionamento após login
    return res.redirect("/Login");
  }
};

/* GET métodos */
router.get('/', authenticationMiddleware, cidadeApp.GetAllCidade);
router.get('/insertCidade', authenticationMiddleware, cidadeApp.insertCidade);
router.get('/viewCidade/:id/:oper', authenticationMiddleware, cidadeApp.viewCidade);

/* POST métodos */
router.post('/insertCidade', authenticationMiddleware, cidadeApp.insertCidade);
router.post('/DeleteCidade', authenticationMiddleware, cidadeApp.DeleteCidade);
router.post('/viewCidade', authenticationMiddleware, cidadeApp.viewCidade);
/* router.post('/getDados', authenticationMiddleware, cidadeApp.getDados); */
/* router.post('/update', authenticationMiddleware, cidadeApp.updateCidade); */

module.exports = router;
