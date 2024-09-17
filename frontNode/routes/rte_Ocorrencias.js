var express = require('express');
var OcorrenciasApp = require("../app/Ocorrencias/controller/ctlOcorrencias");

var router = express.Router();

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
  console.log("[rte_Ocorrencias|authenticaMiddle] Verificando sessão:", req.session); // Log da sessão completa
  console.log("[rte_Ocorrencias|authenticaMiddle] req.session.isLogged",req.session.isLogged);
  console.log("[rte_Ocorrencias|authenticaMiddle] req.session.token)",req.session.token);

  if (req.session && req.session.isLogged && req.session.token) {
    console.log("Usuário autenticado. Continuando para a rota.");
    return next();
  } else {
    console.log("[rte_Ocorrencias|else] Usuário não autenticado. Redirecionando para a página de login.");
    req.session.redirectTo = req.originalUrl; // Salva a URL original para redirecionamento após login
    return res.redirect("/Login");
  }
}; 

/* GET métodos */
router.get('/', authenticationMiddleware, OcorrenciasApp.getAllOcorrencias);
router.get('/insertOcorrencias', authenticationMiddleware, OcorrenciasApp.insertOcorrencias);
router.get('/viewOcorrencias/:id/:oper', authenticationMiddleware, OcorrenciasApp.viewOcorrencias);

/* POST métodos */
router.post('/insertOcorrencias', authenticationMiddleware, OcorrenciasApp.insertOcorrencias);
router.post('/DeleteOcorrencias', authenticationMiddleware, OcorrenciasApp.DeleteOcorrencias);
router.post('/viewOcorrencias', authenticationMiddleware, OcorrenciasApp.viewOcorrencias);

module.exports = router;
