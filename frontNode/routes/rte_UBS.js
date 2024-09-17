var express = require('express');
var UBSApp = require("../app/UBS/controller/ctlUBS");

var router = express.Router();

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
  console.log("[rte_UBS|authenticaMiddle] Verificando sessão:", req.session); // Log da sessão completa
  console.log("[rte_UBS|authenticaMiddle] req.session.isLogged",req.session.isLogged);
  console.log("[rte_UBS|authenticaMiddle] req.session.token)",req.session.token);

  if (req.session && req.session.isLogged && req.session.token) {
    console.log("Usuário autenticado. Continuando para a rota.");
    return next();
  } else {
    console.log("[rte_UBS|else] Usuário não autenticado. Redirecionando para a página de login.");
    req.session.redirectTo = req.originalUrl; // Salva a URL original para redirecionamento após login
    return res.redirect("/Login");
  }
};

/* GET métodos */
router.get('/', authenticationMiddleware, UBSApp.getAllUBS);
router.get('/insertUBS', authenticationMiddleware, UBSApp.insertUBS);
router.get('/viewUBS/:id/:oper', authenticationMiddleware, UBSApp.viewUBS);

/* POST métodos */
router.post('/insertUBS', authenticationMiddleware, UBSApp.insertUBS);
router.post('/DeleteUBS', authenticationMiddleware, UBSApp.DeleteUBS);
router.post('/viewUBS', authenticationMiddleware, UBSApp.viewUBS);

module.exports = router;
