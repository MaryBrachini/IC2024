var express = require('express');
var bairroApp = require("../app/Bairro/controller/ctlBairro");

var router = express.Router();

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
  console.log("[rte_Bairro|authenticaMiddle] Verificando sessão:", req.session); // Log da sessão completa
  console.log("[rte_Bairro|authenticaMiddle] req.session.isLogged",req.session.isLogged);
  console.log("[rte_Bairro|authenticaMiddle] req.session.token)",req.session.token);

  if (req.session && req.session.isLogged && req.session.token) {
    console.log("Usuário autenticado. Continuando para a rota.");
    return next();
  } else {
    console.log("[rte_Bairro|else] Usuário não autenticado. Redirecionando para a página de login.");
    req.session.redirectTo = req.originalUrl; // Salva a URL original para redirecionamento após login
    return res.redirect("/Login");
  }
};

//* GET métodos */
router.get('/', authenticationMiddleware, bairroApp.GetAllBairros);
router.get('/openBairroInsert', authenticationMiddleware, bairroApp.openBairroInsert);
router.get('/openBairroUpdate/:id', authenticationMiddleware, bairroApp.openBairroUpdate);

/* POST métodos */
router.post('/InsertBairro', authenticationMiddleware, bairroApp.InsertBairro);
router.post('/getDados', authenticationMiddleware, bairroApp.getDados);
router.post('/UpdateBairro', authenticationMiddleware, bairroApp.UpdateBairro); 
router.post('/deleteBairro', authenticationMiddleware, bairroApp.deleteBairro);

module.exports = router;
