var express = require('express');
var router = express.Router();

// Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
  console.log("[rte_Mapa|authenticaMiddle] Verificando sessão:", req.session); // Log da sessão completa
  console.log("[rte_Mapa|authenticaMiddle] req.session.isLogged",req.session.isLogged);
  console.log("[rte_Mapa|authenticaMiddle] req.session.token)",req.session.token);

  if (req.session && req.session.isLogged && req.session.token) {
    console.log("Usuário autenticado. Continuando para a rota.");
    return next();
  } else {
    console.log("[rte_Mapa|else] Usuário não autenticado. Redirecionando para a página de login.");
    req.session.redirectTo = req.originalUrl; // Salva a URL original para redirecionamento após login
    return res.redirect("/Login");
  }
};

router.get('/', authenticationMiddleware, (req, res) => {
    const model = {
        title: 'Mapas Interativos'
    };
    res.render('mapa/view_mapa', model);
});


module.exports = router;
