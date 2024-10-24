var express = require('express');
var epidemiaApp = require("../app/Epidemia/controller/ctlEpidemia")


var router = express.Router();

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
  console.log("[rte_Epidemia|authenticaMiddle] Verificando sessão:", req.session); // Log da sessão completa
  console.log("[rte_Epidemia|authenticaMiddle] req.session.isLogged",req.session.isLogged);
  console.log("[rte_Epidemia|authenticaMiddle] req.session.token)",req.session.token);

  if (req.session && req.session.isLogged && req.session.token) {
    console.log("Usuário autenticado. Continuando para a rota.");
    return next();
  } else {
    console.log("[rte_Epidemia|else] Usuário não autenticado. Redirecionando para a página de login.");
    req.session.redirectTo = req.originalUrl; // Salva a URL original para redirecionamento após login
    return res.redirect("/Login");
  }
};

//* GET métodos */
router.get('/', authenticationMiddleware, epidemiaApp.getAllEpidemia);
router.get('/openEpidemiaInsert', authenticationMiddleware, epidemiaApp.openEpidemiaInsert);
router.get('/openEpidemiaUpdate/:id', authenticationMiddleware, epidemiaApp.openEpidemiaUpdate);

/* POST métodos */
router.post('/insertEpidemia', authenticationMiddleware, epidemiaApp.insertEpidemia);
router.post('/deleteEpidemia', authenticationMiddleware, epidemiaApp.deleteEpidemia);
router.post('/getDados', authenticationMiddleware, epidemiaApp.getDados);
router.post('/updateEpidemia', authenticationMiddleware, epidemiaApp.updateEpidemia);

module.exports = router;
