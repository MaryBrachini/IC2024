var express = require('express');
var estadoApp = require("../app/Estado/controller/ctlEstado");

var router = express.Router();

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
  console.log("[rte_Estado|authenticaMiddle] Verificando sessão:", req.session); // Log da sessão completa
  console.log("[rte_Estado|authenticaMiddle] req.session.isLogged",req.session.isLogged);
  console.log("[rte_Estado|authenticaMiddle] req.session.token)",req.session.token);

  if (req.session && req.session.isLogged && req.session.token) {
    console.log("Usuário autenticado. Continuando para a rota.");
    return next();
  } else {
    console.log("[rte_Estado|else] Usuário não autenticado. Redirecionando para a página de login.");
    req.session.redirectTo = req.originalUrl; // Salva a URL original para redirecionamento após login
    return res.redirect("/Login");
  }
};

/* GET métodos */
router.get('/', authenticationMiddleware, estadoApp.getAllEstado);
router.get('/openEstadoInsert', authenticationMiddleware, estadoApp.openEstadoInsert);
router.get('/openEstadoUpdate/:id', authenticationMiddleware, estadoApp.openEstadoUpdate);

/* POST métodos */
router.post('/insertEstado', authenticationMiddleware, estadoApp.insertEstado);
router.post('/deleteEstado', authenticationMiddleware, estadoApp.deleteEstado);
router.post('/getDados', authenticationMiddleware, estadoApp.getDados);
router.post('/updateEstado', authenticationMiddleware, estadoApp.updateEstado);

module.exports = router;
